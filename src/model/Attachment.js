import * as htmlToImage from 'html-to-image';
import md5 from 'md5';
import {getUrlParam, trackEvent} from '@/utils/window.ts';
import AP from "@/model/AP";

function iframeToPng(iframe) {
  return new Promise((resolv) => {
    window.addEventListener('message', ({source, data}) => {
      if(source.location.href !== window.location.href && data?.action === 'export.result') {
        resolv(data.data);
        console.debug('received PNG export result from iframe');
      }
    });

    iframe.contentWindow.postMessage({action: 'export'});
    console.debug('fired PNG export to iframe');
  });
}

function toPng() {
  try {
    /*
    There are 3 options:
    1) Get iframe document.body and generate png in parent frame; problem is: no style
    2) Call "toPng" method on iframe.contentWindow
    3) postMessage to iframe and receive result as message
    */
    const mainFrame = document.getElementById('mainFrame');
    if(mainFrame) {
      return iframeToPng(mainFrame);
    }

    var node = document.getElementsByClassName('screen-capture-content')[0];
    return htmlToImage.toBlob(node, {bgcolor: 'white'});
  } catch (e) {
    console.error('Failed to convert to png', e);
    trackEvent(JSON.stringify(e), 'convert_to_png', 'error');
  } finally {
    trackEvent('toPng', 'convert_to_png', 'export');
  }
}

export function buildAttachmentBasePath(pageId) {
  return '/rest/api/content/' + pageId + '/child/attachment';
}

export function buildGetRequestForAttachments(pageId) {
  return {
    url: buildAttachmentBasePath(pageId) + '?expand=version',
    type: 'GET'
  };
}

export function parseAttachmentsFromResponse(response) {
  return JSON.parse(response.body).results;
}

async function getAttachments(pageId) {
  trackEvent(pageId, 'get_attachments', 'before_request');
  const response = await AP.request(buildGetRequestForAttachments(pageId));
  trackEvent(response?.xhr?.status, 'get_attachments', 'after_request');
  return parseAttachmentsFromResponse(response);
}

function buildPostRequestToUploadAttachment(uri, hash, file) {
  return {
    url: uri,
    type: 'POST',
    contentType: 'multipart/form-data',
    data: {minorEdit: true, comment: hash, file: file}
  };
}

async function uploadAttachment(attachmentName, uri, hash) {
  const blob = await toPng();
  const file = new File([blob], attachmentName, {type: 'image/png'});
  console.debug('Uploading attachment to', uri);
  return await AP.request(buildPostRequestToUploadAttachment(uri, hash, file));
}

function buildPutRequestToUpdateAttachmentProperties(pageId, attachmentId, versionNumber, hash) {
  return {
    url: buildAttachmentBasePath(pageId) + '/' + attachmentId,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({
      minorEdit: true,
      id: attachmentId,
      type: 'attachment',
      version: {number: versionNumber},
      metadata: {comment: hash}
    })
  };
}

async function tryGetAttachment() {
  const pageId = getUrlParam("pageId");
  const attachments = await getAttachments(pageId);

  const attachmentName = 'zenuml-' + getUrlParam("uuid") + '.png';
  return attachments.find(a => a.title === attachmentName);
}

async function uploadAttachment2(hash, fnGetUri) {
  const pageId = getUrlParam("pageId");
  const attachmentName = 'zenuml-' + getUrlParam("uuid") + '.png';
  const uri = fnGetUri(pageId);
  return await uploadAttachment(attachmentName, uri, hash);
}

function uploadNewVersionOfAttachment(hash) {
  return async () => {
    const attachment = await tryGetAttachment();
    const attachmentId = attachment.id;
    const versionNumber = attachment.version.number + 1;
    trackEvent('uploadNewVersionOfAttachment' + versionNumber, 'upload_attachment', 'export');
    await uploadAttachment2(hash, (pageId) => {
      return buildAttachmentBasePath(pageId) + '/' + attachmentId + '/data';
    });
    return {attachmentId, versionNumber, hash};
  }
}

function uploadNewAttachment(hash) {
  return async () => {
    trackEvent('uploadNewAttachment', 'upload_attachment', 'export');
    const response = await uploadAttachment2(hash, buildAttachmentBasePath);
    const attachmentId = JSON.parse(response.body).results[0].id;
    const versionNumber = 1;
    return {attachmentId, versionNumber, hash};
  }
}

async function updateAttachmentProperties(attachmentMeta) {
  await AP.request(buildPutRequestToUpdateAttachmentProperties(getUrlParam("pageId"),
    attachmentMeta.attachmentId, attachmentMeta.versionNumber, attachmentMeta.hash));
}

// Add new version, response does have `results` property.
async function createAttachmentIfContentChanged(content) {
  console.debug('Checking attachment for code:', content);
  const attachment = await tryGetAttachment();
  const hash = md5(content);
  if (!attachment || hash !== attachment.metadata.comment) {
    let attachmentMeta = await (attachment ? uploadNewVersionOfAttachment(hash) : uploadNewAttachment(hash))();
    await updateAttachmentProperties(attachmentMeta);
  }
}

export default createAttachmentIfContentChanged;

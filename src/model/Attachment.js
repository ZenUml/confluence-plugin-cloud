import * as htmlToImage from 'html-to-image';
import md5 from 'md5';
import {getUrlParam, trackEvent} from '@/utils/window.ts';
import AP from "@/model/AP";
import global from '@/model/globals';

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

function attachmentNameByUuid(uuid) {
  return `zenuml-${uuid}.png`;
}

export async function getAttachmentDownloadLink(pageId, macroUuid) {
  const attachmentName = attachmentNameByUuid(macroUuid);
  const attachments = await global.apWrapper.getAttachmentsV2(pageId, {filename: attachmentName});
  if(attachments.length > 1) {
    console.warn(`Multiple attachments found with uuid "${macroUuid}" on page ${pageId}:`, attachments);
  }
  return attachments.length && `${attachments[0]._links.base}${attachments[0]._links.download}`;
}

async function tryGetAttachment() {
  const pageId = getUrlParam("pageId");
  const attachmentName = 'zenuml-' + getUrlParam("uuid") + '.png';
  const attachments = await global.apWrapper.getAttachmentsV2(pageId, {filename: attachmentName});
  const descending = attachments.sort((a, b) => b.version?.number - a.version?.number);
  return descending.length && descending[0];
}

async function uploadAttachment2(hash, fnGetUri) {
  const pageId = getUrlParam("pageId");
  const attachmentName = attachmentNameByUuid(getUrlParam("uuid"));
  const uri = fnGetUri(pageId);
  return await uploadAttachment(attachmentName, uri, hash);
}

function uploadNewVersionOfAttachment(hash) {
  return async () => {
    const attachment = await tryGetAttachment();
    const attachmentId = attachment.id;
    const versionNumber = attachment.version.number + 1;
    trackEvent('version:' + versionNumber, 'upload_attachment', 'export');
    await uploadAttachment2(hash, (pageId) => {
      return buildAttachmentBasePath(pageId) + '/' + attachmentId + '/data';
    });
    return {attachmentId, versionNumber, hash};
  }
}

function uploadNewAttachment(hash) {
  return async () => {
    trackEvent('version:1', 'upload_attachment', 'export');
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
  //Ensure this method will NOT be called multiple times at the same time.
  //There's an issue when diagram is edited through page edit, multiple 'diagramLoaded' events are fired afterwards, thus multiple calls to this method at (almost) same time, caused 409 or 503 error.
  if(window.createAttachmentInProgress) {
    return;
  }

  window.createAttachmentInProgress = true;

  try {
    const attachment = await tryGetAttachment();
    const hash = md5(content);
    if (!attachment || hash !== attachment.comment) {
      let attachmentMeta = await (attachment ? uploadNewVersionOfAttachment(hash) : uploadNewAttachment(hash))();
      await updateAttachmentProperties(attachmentMeta);
    }
  } finally {
    window.createAttachmentInProgress = false;
  }
}

export default createAttachmentIfContentChanged;

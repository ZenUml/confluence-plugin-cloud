import * as htmlToImage from 'html-to-image';
import md5 from 'md5';
import {getUrlParam} from '@/utils/window.ts';

function toPng() {
  try {
    var node = document.getElementsByClassName('screen-capture-content')[0];
    return htmlToImage.toBlob(node, {bgcolor: 'white', pixelRatio: 1});
  } catch (e) {
    console.error('Failed to convert to png', e);
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
  const response = await window.AP.request(buildGetRequestForAttachments(pageId));
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
  return await window.AP.request(buildPostRequestToUploadAttachment(uri, hash, file));
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
    await uploadAttachment2(hash, (pageId) => {
      return buildAttachmentBasePath(pageId) + '/' + attachmentId + '/data';
    });
    return {attachmentId, versionNumber, hash};
  }
}

function uploadNewAttachment(hash) {
  return async () => {
    const response = await uploadAttachment2(hash, buildAttachmentBasePath);
    const attachmentId = JSON.parse(response.body).results[0].id;
    const versionNumber = 1;
    return {attachmentId, versionNumber, hash};
  }
}

async function updateAttachmentProperties(attachmentMeta) {
  await window.AP.request(buildPutRequestToUpdateAttachmentProperties(getUrlParam("pageId"),
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

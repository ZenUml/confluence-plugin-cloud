function toPng() {
  var node = document.getElementsByClassName('sequence-diagram')[0];
  return domtoimage.toBlob(node, { bgcolor: 'white' });
}

function buildAttachmentBasePath(pageId) {
  return '/rest/api/content/' + pageId + '/child/attachment';
}

function buildGetRequestForAttachments(pageId) {
  return {
    url: buildAttachmentBasePath(pageId) + '?expand=version',
    type: 'GET'
  };
}

function parseAttachmentsFromResponse(response) {
  return JSON.parse(response.body).results;
}

async function getAttachments(pageId) {
  const response = await AP.request(buildGetRequestForAttachments(pageId));
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

async function updateAttachmentProperties(pageId, attachmentId, versionNumber, hash) {
  await AP.request(buildPutRequestToUpdateAttachmentProperties(pageId, attachmentId, versionNumber, hash));
}

function buildAttachmentUri(attachment, pageId) {
  return attachment != null
    ? buildAttachmentBasePath(pageId) + '/' + attachment.id + '/data'
    : buildAttachmentBasePath(pageId);
}

function buildAttachmentId(attachment, response) {
  return attachment != null ? attachment.id : JSON.parse(response.body).results[0].id;
}

function buildAttachmentVersionNumber(attachment) {
  return attachment != null ? attachment.version.number + 1 : 1;
}

async function createAttachmentIfContentChanged(content) {
  console.debug('Creating attachment for code:', content);
  const hash = md5(content);

  const pageId = getUrlParam("pageId");
  const attachments = await getAttachments(pageId);

  const attachmentName = 'zenuml-' + getUrlParam("uuid") + '.png';
  var attachment = attachments.find(a => a.title === attachmentName);

  if(attachment === null || hash !== attachment.metadata.comment) {
    const uri = buildAttachmentUri(attachment, pageId);
    console.debug('Uploading attachment:', uri, hash);
    const response = await uploadAttachment(attachmentName, uri, hash);

    const attachmentId = buildAttachmentId(attachment, response);
    const versionNumber = buildAttachmentVersionNumber(attachment);

    await updateAttachmentProperties(pageId, attachmentId, versionNumber, hash);
  }
}

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

async function updateAttachmentProperties2(response, hash) {
  const attachmentId = JSON.parse(response.body).results[0].id;
  await updateAttachmentProperties(getUrlParam("pageId"), attachmentId, 1, hash);
}

async function addNewAttachment(hash) {
  const response = await uploadAttachment2(hash, buildAttachmentBasePath);
  await updateAttachmentProperties2(response, hash);
}

// Add new version, response does have `results` property.
async function addNewVersionOfAttachment(hash, attId, newVersionNumber) {
  await uploadAttachment2(hash, (pageId) => {
    return buildAttachmentBasePath(pageId) + '/' + attId + '/data';
  });

  await updateAttachmentProperties(getUrlParam("pageId"), attId, newVersionNumber, hash);
}

async function createAttachmentIfContentChanged(content) {
  console.debug('Creating attachment for code:', content);
  var attachment = await tryGetAttachment();
  const hash = md5(content);
  if (!attachment) {
    await addNewAttachment(hash);
  } else if (hash !== attachment.metadata.comment) {
    await addNewVersionOfAttachment(hash, attachment.id, attachment.version.number + 1);
  }
}

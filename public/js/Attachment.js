
function toPng() {
  var node = document.getElementsByClassName('sequence-diagram')[0];
  return domtoimage.toBlob(node, { bgcolor: 'white' });
}

async function getAttachments(pageId) {
  var attachments;
  const response = await AP.request({
    url: '/rest/api/content/' + pageId + '/child/attachment?expand=version',
    type: 'GET'
  });
  attachments = JSON.parse(response.body).results;
  return attachments;
}

async function uploadAttachment(attachmentName, uri, hash) {
  const blob = await toPng();
  const file = new File([blob], attachmentName, {type: 'image/png'});
  console.debug('Uploading attachment to', uri);
  const response = await AP.request({
    url: uri,
    type: 'POST',
    contentType: 'multipart/form-data',
    data: {minorEdit: true, comment: hash, file: file}
  });
  return response;
}

async function updateAttachmentProperties(pageId, attachmentId, versionNumber, hash) {
  await AP.request({
    url: '/rest/api/content/' + pageId + '/child/attachment/' + attachmentId,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({minorEdit: true, id: attachmentId, type: 'attachment', version: {number: versionNumber}, metadata: {comment: hash}})
  });
}

async function createAttachmentIfContentChanged(content) {
  console.debug('Creating attachment for code:', content);
  const hash = md5(content);

  const pageId = getUrlParam("pageId");
  const attachments = await getAttachments(pageId);

  const attachmentName = 'zenuml-' + getUrlParam("uuid") + '.png';
  var attachment = attachments.find(a => a.title === attachmentName);

  const uri = attachment != null
    ? '/rest/api/content/' + pageId + '/child/attachment/' + attachment.id + '/data'
    : '/rest/api/content/' + pageId + '/child/attachment';

  if(attachment == null || hash !== attachment.metadata.comment) {
    console.debug('Uploading attachment:', uri, hash);
    const response = await uploadAttachment(attachmentName, uri, hash);

    const attachmentId = attachment != null ? attachment.id : JSON.parse(response.body).results[0].id;
    const versionNumber = attachment != null ? attachment.version.number + 1 : 1;

    await updateAttachmentProperties(pageId, attachmentId, versionNumber, hash);
  }
}

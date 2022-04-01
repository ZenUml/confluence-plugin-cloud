import {buildAttachmentBasePath, buildGetRequestForAttachments, parseAttachmentsFromResponse} from './Attachment';

describe('Attachment', () => {
  it('should return the correct AttachmentBasePath', () => {
    expect(buildAttachmentBasePath('12345')).toEqual('/rest/api/content/12345/child/attachment');
  });

  it('should build the Get request for attachments', () => {
    let basePath = buildAttachmentBasePath('12345');
    expect(buildGetRequestForAttachments('12345')).toEqual({
      url: basePath + '?expand=version',
      type: 'GET'
    });
  });

  it('should parse attachments from response', () => {
    let body = { results: [{ id: '1' }, { id: '2' }]};
    expect(parseAttachmentsFromResponse({
      "body": JSON.stringify(body)
    })).toStrictEqual([{ id: '1' }, { id: '2' }]);
  });


});
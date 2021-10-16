import MockAp from "@/model/MockAp";
import {ContentProperty} from "@/model/ContentProperty";

describe('MockAp', () => {
  it('constructor', () => {
    let mockAp = new MockAp();
    expect(mockAp.confluence).toBeDefined();
  })

  it('setup mock/stub for request', async () => {
    let mockAp = new MockAp();
    mockAp.whenRequestThenRespond('customContent', {body: '{key: "value"}'});

    let response = await mockAp.request({type: 'GET', url: 'customContent'});
    expect(response.body).toBe('{key: "value"}');
  })
})

// For ContentProperty see https://developer.atlassian.com/cloud/confluence/jsapi/classes/contentproperty/
describe('ContentProperty', () => {
  it('constructor', () => {
    let contentProp = new ContentProperty('key_1234', 'value', {number: 1});
    expect(contentProp.key).toBe('key_1234');
    expect(contentProp.value).toBe('value');
    expect(contentProp.version.number).toBe(1);
  })
})
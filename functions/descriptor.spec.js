import {onRequestGet} from "./descriptor";
import expectedDescriptor from "./test-data/expected-descriptor-full";
// This is hacky: https://stackoverflow.com/a/61858962/529187
import nodeFetch from 'node-fetch'
// Mocking Response for descriptor.js using node-fetch
if (typeof fetch === 'undefined') {
  global.Response = nodeFetch.Response
}

describe('descriptor', function() {
  it('should return a valid descriptor', async function() {
    const params = {
      request: {
        headers: {
          get: function() {
            return 'application/json';
          }
        },
        url: 'https://example.com/path/to/resource',
      }
    }
    const response = await onRequestGet(params);
    expect(response.status).toBe(200);
    expect(await response.json()).toStrictEqual(expectedDescriptor)
  });
});
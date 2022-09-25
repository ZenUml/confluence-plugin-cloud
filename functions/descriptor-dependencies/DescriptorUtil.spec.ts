import {getDescriptor} from "./DescriptorUtil";
import expectedDescriptor from "../test-data/expected-descriptor-full";

describe('DescriptorUtil', () => {
  it('should return correct descriptor json', function () {
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
    const descriptor = getDescriptor(params);
    expect(descriptor).toEqual(expectedDescriptor);
  });
})
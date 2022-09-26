import {getDescriptor, replaceUrls} from "./DescriptorUtil";
import expectedDescriptor from "../test-data/expected-descriptor-full";
const descriptor = require('../atlassian-connect.json');

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

  it('should replace urls', function () {
    descriptor.modules.dynamicContentMacros.forEach((macro: any) => {
      // sequence-viewer.html?version=__VERSION__
      // &spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&outputType={output.type}
      // &addonKey=__ADDON_KEY__&contentKey=__CONTENT_KEY__
      expect(macro.editor.url).toContain('version=__VERSION__');
      expect(macro.editor.url).toContain('addonKey=__ADDON_KEY__');
      // TODO: is contentKey used anywhere?
      // expect(macro.editor.url).toContain('contentKey=__CONTENT_KEY__');
    });
    replaceUrls(descriptor.modules, (url: string) => url);
    const version = '2022.07';
    const key = 'com.zenuml.confluence-addon';
    expectedDescriptor.modules.dynamicContentMacros.forEach((macro: any) => {
      expect(macro.editor.url).toContain(`version=${version}`);
      expect(macro.editor.url).toContain(`addonKey=${key}`);
      // expect(macro.editor.url).toContain(`contentKey=${getCustomContentKeyForModule(macro, expectedDescriptor.modules)}`);
    });
  })
})
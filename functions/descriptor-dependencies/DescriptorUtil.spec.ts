import {descriptorNs} from '../descriptor'
import {getDescriptor, replaceUrls} from "./DescriptorUtil";
import expectedDescriptor from "../test-data/expected-descriptor-full";
import DynamicContentMacro = descriptorNs.DynamicContentMacro;
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

  it('makes sure all urls have version and addonKey', function () {
    const modules = descriptor.modules;
    modules.dynamicContentMacros.forEach((macro: any) => {
      // sequence-viewer.html?version=__VERSION__
      // &spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&outputType={output.type}
      // &addonKey=__ADDON_KEY__&contentKey=__CONTENT_KEY__
      expect(macro.editor.url).toContain('version=__VERSION__');
      expect(macro.editor.url).toContain('addonKey=__ADDON_KEY__');
      // TODO: is contentKey used anywhere?
      // expect(macro.editor.url).toContain('contentKey=__CONTENT_KEY__');
    });
  })

  it('should replace all urls under modules', function () {
    const fakeUrl = 'fake-url';
    const modules = descriptor.modules;
    replaceUrls(modules, () => fakeUrl);
    modules.dynamicContentMacros.forEach((macro: DynamicContentMacro) => {
      expect(macro.editor.url).toBe(fakeUrl);
      expect(macro.renderModes.default.url).toBe(fakeUrl);
    });
    modules.generalPages.forEach((page: any) => {
      expect(page.url).toBe(fakeUrl);
    })
    expect(modules.postInstallPage.url).toBe(fakeUrl);
    modules.webPanels.forEach((panel: any) => {
      expect(panel.url).toBe(fakeUrl);
    })
  })
})
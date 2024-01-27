import MockAp from '@/model/MockAp'
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import ApWrapper2 from "@/model/ApWrapper2";
import TestHelper from '../../../tests/unit/TestHelper';
import globals from '@/model/globals';

global.fetch = () => Promise.resolve(new Response("mock fetch success"));


describe('CompositeContentProvider', () => {
  test('should fallback to content property when no custom content id is provided', async () => {
    const mockAp = new MockAp('contentId');
    mockAp.request = () => {
      throw Error('custom content or content property not found')
    }
    mockAp.confluence.setContentProperty({key: 'key', version: {number: 1}, value: 'abcd'}, () => {})
    mockAp.confluence.saveMacro({uuid: 'uuid'}, 'body')

    const contentProvider = defaultContentProvider(new ApWrapper2(mockAp));
    const {doc} = (await contentProvider.load());
    expect(doc.code).toBe('abcd');
  })

  test('should fallback to macro body when content property fails', async () => {
    const mockAp = new MockAp('contentId');
    mockAp.request = () => {
      throw Error('custom content or content property not found')
    }
    mockAp.confluence.saveMacro({}, 'body')

    const contentProvider = defaultContentProvider(new ApWrapper2(mockAp));
    const {doc} = (await contentProvider.load());
    expect(doc.code).toBe('body');
  })

  // This is used in embedding documents
  describe('embeded', () => {
    beforeEach(() => {
      globals.isEmbedded = true;
    });

    test('should use url based content id if rendered.for==custom-content-native', async () => {
      TestHelper.setUpUrlParam('rendered.for=custom-content-native&content.id=123');
      const mockAp = new MockAp('contentId');
      // body will not be used
      mockAp.confluence.saveMacro({}, 'body');
      mockAp.setCustomContent(123, {
        source: 'custom-content',
        code: 'A.method',
        styles:{"#A":{"backgroundColor":"#57d9a3"}}
      });

      const contentProvider = defaultContentProvider(new ApWrapper2(mockAp));
      const {doc} = (await contentProvider.load());
      expect(doc.code).toBe('A.method');
    })

    afterEach(() => {
      globals.isEmbedded = false;
    });
  });

})
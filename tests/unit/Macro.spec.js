import MockAp from '@/model/MockAp'
import Macro from '@/model/Macro'
import ApWrapper2 from "@/model/ApWrapper2";
import helper from './TestHelper';

let mockAp, mockApConfluence;
let macro;

jest.mock('../../src/utils/uuid', () => {
  return () => 'random_uuid'
})

describe('Macro', () => {
  let gtag;
  const contentId = 'abcd'

  beforeEach(() => {
    helper.setUpUrlParam('contentKey=sequence');

    mockAp = new MockAp(contentId);
    mockApConfluence = mockAp.confluence;
    macro = new Macro(new ApWrapper2(mockAp));

    gtag = jest.fn();
    window.gtag = gtag;
  });

  describe('load content when initialising', () => {
    // no data, no body, no prop
    it('should default to example', async () => {
      const code = (await macro.load()).code
      expect(code).toBe(macro.EXAMPLE)

      expect(gtag.mock.calls).toEqual([
        ['event', 'new_macro', {event_category: 'custom_content', event_label: 'sequence'}]
      ])
    })

    // data
    test('A macro with only uuid must have content property', async () => {
      mockApConfluence.saveMacro({uuid: 1234});
      expect(macro.load()).rejects.toThrowError('A macro with only uuid must have content property.');

      mockApConfluence.saveMacro({uuid: '1234'}, 'body')
      expect(macro.load()).rejects.toThrowError();
    })

    // body
    test('or macro body', async () => {
      mockApConfluence.saveMacro({}, 'body')
      const code = (await macro.load()).code;
      expect(code).toBe('body')

      expect(gtag.mock.calls).toEqual([
        ['event', 'load_macro', {event_category: 'macro_body', event_label: 'sequence'}],
      ])
    })

    test('or content property old', async () => {
      mockApConfluence.saveMacro({uuid: '1234'})
      mockApConfluence.setContentProperty({key: 'zenuml-sequence-macro-1234-body', value: 'A.method'})
      const code = (await macro.load()).code;
      expect(code).toBe('A.method')

      expect(gtag.mock.calls).toEqual([
        ['event', 'load_macro', {event_category: 'content_property_old', event_label: 'sequence'}],
      ])
    })

    // data, prop
    test('or content property', async () => {
      mockApConfluence.saveMacro({uuid: '1234'})
      mockApConfluence.setContentProperty({key: 'zenuml-sequence-macro-1234-body', value: {code: 'A.method'}})
      const code = (await macro.load()).code;
      expect(code).toBe('A.method')

      expect(gtag.mock.calls).toEqual([
        ['event', 'load_macro', {event_category: 'content_property', event_label: '_sequence'}],
      ])
    })

    test('or content property as object {code, styles}', async () => {
      mockApConfluence.saveMacro({uuid: '1234'})
      mockApConfluence.setContentProperty({key: 'zenuml-sequence-macro-1234-body', value: {code: 'A.method', styles: {'#A': { backgroundColor: '#FFF'}}}})
      const code = (await macro.load()).code;
      expect(code).toBe('A.method')
      const styles = (await macro.load()).styles
      expect(styles['#A'].backgroundColor).toBe('#FFF')
    })

    // data, body, prop
    test('or content property', async () => {
      mockApConfluence.saveMacro({uuid: '1234'}, 'body')
      mockApConfluence.setContentProperty({key: 'zenuml-sequence-macro-1234-body', value: 'A.method'})
      const code = (await macro.load()).code;
      expect(code).toBe('A.method')
    })

    // body, prop
    test('if no macro data', async () => {
      mockApConfluence.saveMacro({}, 'body')
      mockApConfluence.setContentProperty({key: 'zenuml-sequence-macro-1234-body', value: 'A.method'})
      const code = (await macro.load()).code;
      expect(code).toBe('body')
    })

    test('should load from custom content', async () => {
      mockApConfluence.saveMacro({customContentId: 1234})
      mockAp.setCustomContent(1234, {code: 'A.m'})
      const code = (await macro.load()).code;
      expect(code).toBe('A.m')
    })

    test('should fallback to macro body when content property fails', async () => {
      mockApConfluence.saveMacro({uuid: '1234'}, 'body')
      mockApConfluence.getContentProperty = jest.fn(() => {
        throw 'getContentProperty error'
      })
      
      const code = (await macro.load()).code;
      expect(code).toBe('body');

      expect(gtag.mock.calls).toEqual(expect.arrayContaining([
        ['event', 'get_content_property', {event_category: 'unexpected_error', event_label: 'property is not found with key:zenuml-sequence-macro-1234-body'}],
      ]));
    })

    test('should throw error if fallback to macro body also fails', async () => {
      const uuid = '1234';
      const data = {uuid};
      mockApConfluence.saveMacro(data, undefined)
      mockApConfluence.getContentProperty = jest.fn(() => {
        throw 'getContentProperty error'
      })
      
      try {
        await macro.load();
        expect(true).toBe(false);
      } catch(e) {
        expect(e).toEqual({message: `property is not found with key:zenuml-sequence-macro-${uuid}-body`, data});
      }

      expect(gtag.mock.calls).toEqual(expect.arrayContaining([
        ['event', 'get_content_property', {event_category: 'unexpected_error', event_label: 'property is not found with key:zenuml-sequence-macro-1234-body'}],
      ]));
    })

  })
})
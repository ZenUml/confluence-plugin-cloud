import MockAp from '@/model/MockAp'
import Macro from '@/model/Macro'

let mockAp, mockApConfluence;
let macro;

jest.mock('../../src/utils/uuid', () => {
  return () => 'random_uuid'
})
describe('Macro', () => {
  let gtag;
  const contentId = 'abcd'

  beforeEach(() => {
    mockAp = new MockAp(contentId);
    mockApConfluence = mockAp.confluence;
    macro = new Macro(mockAp);

    gtag = jest.fn();
    window.gtag = gtag;
  });

  describe('load content when initialising', () => {
    // no data, no body, no prop
    it('should default to example', async () => {
      const code = (await macro.load()).code
      expect(code).toBe(macro.EXAMPLE)

      expect(gtag.mock.calls).toEqual([
        ['event', 'load_macro', {event_category: 'macro_body', event_label: contentId}],
        ['event', 'load_macro', {event_category: 'default_example', event_label: contentId}]
      ])
    })

    // data
    test('data, no body or property', async () => {
      mockApConfluence.saveMacro({uuid: 1234})
      const code = (await macro.load()).code;
      expect(code).toBe(macro.EXAMPLE)
    })

    // body
    test('or macro body', async () => {
      mockApConfluence.saveMacro({}, 'body')
      const code = (await macro.load()).code;
      expect(code).toBe('body')

      expect(gtag.mock.calls).toEqual([
        ['event', 'load_macro', {event_category: 'macro_body', event_label: contentId}],
      ])
    })

    // data, prop
    test('or content property', async () => {
      mockApConfluence.saveMacro({uuid: '1234'})
      mockApConfluence.setContentProperty({key: 'zenuml-sequence-macro-1234-body', value: 'A.method'})
      const code = (await macro.load()).code;
      expect(code).toBe('A.method')

      expect(gtag.mock.calls).toEqual([
        ['event', 'load_macro', {event_category: 'content_property', event_label: contentId}],
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

    // data, body
    test('or content property', async () => {
      mockApConfluence.saveMacro({uuid: '1234'}, 'body')
      const code = (await macro.load()).code;
      expect(code).toBe('body')
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
      mockAp.setCustomContent(1234, 'body')
      const code = (await macro.load()).code;
      expect(code).toBe('body')
    })

  })
})
import MockAp from '@/model/MockAp'
import {ContentPropertyStorageProvider} from "@/model/ContentProvider/ContentPropertyStorageProvider";
import MockApConfluence from "@/model/MockApConfluence";
import ApWrapper2 from "@/model/ApWrapper2";

let mockAp: MockAp, mockApConfluence: MockApConfluence;


// generate response for AP.request. The parameter is the `value` at {body:"body: raw: { value }"}
describe('ContentPropertyStorageProvider', () => {
  let gtag: any;
  const contentId = 'abcd'

  beforeEach(() => {
    mockAp = new MockAp(contentId);
    mockApConfluence = mockAp.confluence as MockApConfluence;

    gtag = jest.fn();
    // @ts-ignore
    window.gtag = gtag;
  });

  test('cannot find content property', async () => {
    const contentPropertyStorageProvider = new ContentPropertyStorageProvider(new ApWrapper2(mockAp));
    try {
      await contentPropertyStorageProvider.getDiagram(undefined)
    } catch (e: any) {
      expect(e.message).toBe('property is not found with key:zenuml-sequence-macro-fake-macro-uuid-body')
    }
  })

  test('or content property old', async () => {
    mockApConfluence.saveMacro({uuid: '1234'}, '')
    mockApConfluence.setContentProperty({
      key: 'zenuml-sequence-macro-1234-body', version: {number: 1}, value: 'A.method'
    }, () => {})
    const contentPropertyStorageProvider = new ContentPropertyStorageProvider(new ApWrapper2(mockAp));
    const diagram = await contentPropertyStorageProvider.getDiagram(undefined)
    expect(diagram?.code).toBe('A.method')

    expect(gtag.mock.calls).toEqual([
      ['event', 'load_macro', {
        event_category: 'content_property_old',
        event_label: 'sequence',
        client_domain: 'unknown_atlassian_domain',
        user_account_id: 'unknown_user_account_id',
        confluence_space: 'unknown_space'
      }],
    ])
  })

  test('or content property as object {code, styles}', async () => {
    mockApConfluence.saveMacro({uuid: '1234'}, '')
    mockApConfluence.setContentProperty({
      key: 'zenuml-sequence-macro-1234-body',
      version: {number: 1},
      value: {code: 'A.method', styles: {'#A': {backgroundColor: '#FFF'}}}
    }, () => {})
    const contentPropertyStorageProvider = new ContentPropertyStorageProvider(new ApWrapper2(mockAp));
    const diagram = await contentPropertyStorageProvider.getDiagram(undefined)

    expect(diagram?.code).toBe('A.method')
    const styles = diagram?.styles || {}
    // @ts-ignore
    expect(styles['#A'].backgroundColor).toBe('#FFF')

    expect(gtag.mock.calls).toEqual([
      ['event', 'load_macro', {
        event_category: 'content_property',
        event_label: '_sequence',
        client_domain: 'unknown_atlassian_domain',
        user_account_id: 'unknown_user_account_id',
        confluence_space: 'unknown_space'
      }],
    ])

  })
})
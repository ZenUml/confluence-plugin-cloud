import MockAp from '@/model/MockAp'
import helper from '../../../tests/unit/TestHelper';
import {ContentPropertyStorageProvider} from "@/model/ContentProvider/ContentPropertyStorageProvider";
import {MacroBodyStorageProvider} from "@/model/ContentProvider/MacroBodyStorageProvider";
import MockApConfluence from "@/model/MockApConfluence";
import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";
import defaultCompositeContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import {Diagram, DiagramType} from "@/model/Diagram/Diagram";

let mockAp: MockAp, mockApConfluence: MockApConfluence;

jest.mock('@/utils/uuid', () => {
  return () => 'random_uuid'
})


// generate response for AP.request. The parameter is the `value` at {body:"body: raw: { value }"}
function buildResponse(body_body_raw_value: Diagram) {
  return {body: JSON.stringify({body: {raw: {value: JSON.stringify(body_body_raw_value)}}})};
}

describe('Content Provider', () => {
  let gtag: any;
  const contentId = 'abcd'

  beforeEach(() => {
    helper.setUpUrlParam('contentKey=sequence');

    mockAp = new MockAp(contentId);
    jest.mock('@/model/AP', () => {
        return mockAp;
      }
    )
    // mockAp.request = async () => {
    //   console.log('#######@@@@@@@@@@@@@@')
    //   return undefined
    // }
    mockApConfluence = mockAp.confluence as MockApConfluence;
    // @ts-ignore
    // macro = new Macro(new ApWrapper2(mockAp));

    gtag = jest.fn();
    // @ts-ignore
    window.gtag = gtag;
  });

  it('should default to example', async () => {
    // fallback to example is to be handled after loading with content provider
  })

  test('cannot find content property', async () => {
    const contentPropertyStorageProvider = new ContentPropertyStorageProvider(mockAp);
    try {
      await contentPropertyStorageProvider.getDiagram(undefined)
    } catch (e: any) {
      expect(e.message).toBe('property is not found with key:zenuml-sequence-macro-fake-macro-uuid-body')
    }
  })

  // body
  test('get macro body', async () => {
    const storageProvider = new MacroBodyStorageProvider(mockAp);
    await storageProvider.getDiagram(undefined)
  })

  test('or content property old', async () => {
    mockApConfluence.saveMacro({uuid: '1234'}, '')
    mockApConfluence.setContentProperty({
      key: 'zenuml-sequence-macro-1234-body', version: {number: 1}, value: 'A.method'
    }, () => {})
    const contentPropertyStorageProvider = new ContentPropertyStorageProvider(mockAp);
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

  // data, prop
  test('or content property', async () => {
    mockApConfluence.saveMacro({uuid: '1234'}, '')
    mockApConfluence.setContentProperty({
      key: 'zenuml-sequence-macro-1234-body', version: {number: 1}, value: {code: 'A.method'}
    }, () => {})
    const contentPropertyStorageProvider = new ContentPropertyStorageProvider(mockAp);
    const diagram = await contentPropertyStorageProvider.getDiagram(undefined)
    expect(diagram?.code).toBe('A.method')

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

  test('or content property as object {code, styles}', async () => {
    mockApConfluence.saveMacro({uuid: '1234'}, '')
    mockApConfluence.setContentProperty({
      key: 'zenuml-sequence-macro-1234-body',
      version: {number: 1},
      value: {code: 'A.method', styles: {'#A': {backgroundColor: '#FFF'}}}
    }, () => {})
    const contentPropertyStorageProvider = new ContentPropertyStorageProvider(mockAp);
    const diagram = await contentPropertyStorageProvider.getDiagram(undefined)

    expect(diagram?.code).toBe('A.method')
    const styles = diagram?.styles || {}
    // @ts-ignore
    expect(styles['#A'].backgroundColor).toBe('#FFF')
  })

  // data, body, prop
  test('or content property', async () => {
    mockApConfluence.saveMacro({uuid: '1234'}, 'body')
    mockApConfluence.setContentProperty({version: {number: 0}, key: 'zenuml-sequence-macro-1234-body', value: 'A.method'}, () => {})
    const contentPropertyStorageProvider = new ContentPropertyStorageProvider(mockAp);
    const diagram = await contentPropertyStorageProvider.getDiagram(undefined)
    expect(diagram?.code).toBe('A.method')
  })

  // body, prop
  test('if no macro data', async () => {
    mockApConfluence.saveMacro({}, 'body')
    const storageProvider = new MacroBodyStorageProvider(mockAp);
    const diagram = await storageProvider.getDiagram(undefined)
    expect(diagram?.code).toBe('body')
  })

  test('should load from custom content', async () => {
    mockApConfluence.saveMacro({customContentId: 1234}, '')
    mockAp.setCustomContent(1234, {code: 'A.m'})
    const storageProvider = new CustomContentStorageProvider(mockAp);
    const diagram = await storageProvider.getDiagram('1234')
    expect(diagram?.code).toBe('A.m')
  })

  test('use local mock ap in storage provider', async () => {
    mockAp = new MockAp(contentId);
    mockAp.request = () => {
      return buildResponse({code: 'A.m', diagramType: DiagramType.Sequence})
    }
    const storageProvider = new CustomContentStorageProvider(mockAp);
    const diagram = await storageProvider.getDiagram('1234')
    expect(diagram?.code).toBe('A.m')
  })

  test.skip('should fallback to macro body when content property fails', async () => {
    mockAp = new MockAp(contentId);
    mockAp.request = () => {
      throw Error('custom content or content property not found')
    }
    mockAp.confluence.saveMacro({}, 'body')

    const contentProvider = defaultCompositeContentProvider(mockAp);
    const {content} = (await contentProvider.load());
    expect(content.code).toBe('body');

    // expect(gtag.mock.calls).toEqual(expect.arrayContaining([
    //   ['event', 'get_content_property', {
    //     event_category: 'warning',
    //     event_label: 'property is not found with key:zenuml-sequence-macro-1234-body',
    //     client_domain: 'unknown_atlassian_domain',
    //     confluence_space: 'unknown_space',
    //     user_account_id: 'unknown_user_account_id'
    //   }],
    // ]));
  })

  // test('should throw error if fallback to macro body also fails', async () => {
  //   const uuid = '1234';
  //   const data = {uuid};
  //   mockApConfluence.saveMacro(data, undefined)
  //   mockApConfluence.getContentProperty = jest.fn(() => {
  //     throw 'getContentProperty error'
  //   })
  //
  //   try {
  //     await macro.load();
  //     expect(true).toBe(false);
  //   } catch (e) {
  //     expect(e).toEqual({message: `property is not found with key:zenuml-sequence-macro-${uuid}-body`, data});
  //   }
  //
  //   expect(gtag.mock.calls).toEqual(expect.arrayContaining([
  //     ['event', 'get_content_fallback', {
  //       event_category: 'error',
  //       event_label: 'Fallback to macro body failed',
  //       client_domain: 'unknown_atlassian_domain',
  //       confluence_space: 'unknown_space',
  //       user_account_id: 'unknown_user_account_id'
  //     }],
  //   ]));
  // })
})
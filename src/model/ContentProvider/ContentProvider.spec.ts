import MockAp from '@/model/MockAp'
import helper from '../../../tests/unit/TestHelper';
import MockApConfluence from "@/model/MockApConfluence";

let mockAp: MockAp, mockApConfluence: MockApConfluence;

jest.mock('@/utils/uuid', () => {
  return () => 'random_uuid'
})


// generate response for AP.request. The parameter is the `value` at {body:"body: raw: { value }"}
// function buildResponse(body_body_raw_value: Diagram) {
//   return {body: JSON.stringify({body: {raw: {value: JSON.stringify(body_body_raw_value)}}})};
// }

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
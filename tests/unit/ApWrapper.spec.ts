import MockAp from "@/model/MockAp";
import ApWrapper2 from "@/model/ApWrapper2";
import {setUpWindowLocation} from "../SetUpWindowLocation";
import {buildEnrichedCustomContent, buildCustomContentResponse} from "../CustomContentFixtures";
import helper from './TestHelper';

describe('ApWrapper', () => {

  it('tells whether it is a lite version or full version', () => {
    helper.setUpUrlParam('contentKey=zenuml-content-sequence');

    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    expect(apWrapper2.isLite()).toBeFalsy();
  })

  it('tells a lite version', () => {
    helper.setUpUrlParam('addonKey=com.zenuml.confluence-addon-lite&contentKey=zenuml-content-sequence');

    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    expect(apWrapper2.isLite()).toBeTruthy();
  })

  it('tells us the page id', async () => {
    setUpWindowLocation("?contentKey=zenuml-content-sequence");
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    const getLocationContext = jest.fn().mockImplementation(async () => {
      return {
        contentId: "page-001"
      }
    });
    apWrapper2.getLocationContext = getLocationContext.bind(apWrapper2);
    expect(await apWrapper2.getPageId()).toBe('page-001');
  })

  it('gets custom content by id (on the original page)', async () => {
    setUpWindowLocation("?contentKey=zenuml-content-sequence");
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    const _requestFn = jest.fn().mockImplementation(async () => {
      return buildCustomContentResponse("page-001", "A.method")});
    apWrapper2._requestFn = _requestFn.bind(apWrapper2);

    const getPageId = jest.fn().mockImplementation(async () => { return "page-001" });
    apWrapper2.getPageId = getPageId.bind(apWrapper2);
    expect(await apWrapper2.getCustomContentById("custom-content-001"))
      .toEqual(buildEnrichedCustomContent("page-001", "A.method", false));
  })

  it('gets custom content by id (on a different page)', async () => {
    setUpWindowLocation("?contentKey=zenuml-content-sequence");
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    const _requestFn = jest.fn().mockImplementation(async () => {
      return buildCustomContentResponse("page-002", "A.method")});
    apWrapper2._requestFn = _requestFn.bind(apWrapper2);

    const getPageId = jest.fn().mockImplementation(async () => { return "page-001" });
    apWrapper2.getPageId = getPageId.bind(apWrapper2);
    expect(await apWrapper2.getCustomContentById("custom-content-001"))
      .toEqual(buildEnrichedCustomContent("page-002", "A.method", true));
  })

})
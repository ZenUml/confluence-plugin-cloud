import MockAp from "@/model/MockAp";
import ApWrapper2 from "@/model/ApWrapper2";
import {setUpWindowLocation} from "../SetUpWindowLocation";
import {buildCustomContentResponse, buildEnrichedCustomContent} from "../CustomContentFixtures";
import helper from './TestHelper';

describe('ApWrapper', () => {
  beforeEach(() => {
    helper.setUpUrlParam('contentKey=zenuml-content-sequence');
  });

  it('tells if the user has edit permission', async () => {
    const ap = new ApWrapper2(new MockAp());
    ap._requestFn = jest.fn().mockImplementation(async (req: any) => {
      const hasPermission = req.data.includes('user-001');
      return {
        body: JSON.stringify({
          hasPermission
        })
      }
    });
    ap.currentUser = {
      atlassianAccountId: 'user-001'
    }
    expect(await ap.canUserEdit()).toBeTruthy();
    ap.currentUser = {
      atlassianAccountId: 'user-002'
    }
    expect(await ap.canUserEdit()).toBeFalsy();
  })

  it('tells whether it is a lite version or full version', () => {

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

  it('gets custom content by id (on the original page)', async () => {
    setUpWindowLocation("?contentKey=zenuml-content-sequence");
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    const _requestFn = jest.fn().mockImplementation(async () => {
      return buildCustomContentResponse("12345", "A.method")});
    apWrapper2._requestFn = _requestFn.bind(apWrapper2);

    const getPageId = jest.fn().mockImplementation(async () => { return 12345 });
    apWrapper2._page.getPageId = getPageId.bind(apWrapper2);
    expect(await apWrapper2.getCustomContentById("custom-content-001"))
      .toEqual(buildEnrichedCustomContent("custom-content-001", "12345", "A.method", false));
  })

  it('gets custom content by id (on a different page)', async () => {
    setUpWindowLocation("?contentKey=zenuml-content-sequence");
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    const _requestFn = jest.fn().mockImplementation(async () => {
      return buildCustomContentResponse("12346", "A.method")});
    apWrapper2._requestFn = _requestFn.bind(apWrapper2);

    const getPageId = jest.fn().mockImplementation(async () => { return 12345 });
    apWrapper2._page.getPageId = getPageId.bind(apWrapper2);
    expect(await apWrapper2.getCustomContentById("custom-content-001"))
      .toEqual(buildEnrichedCustomContent("custom-content-001", "12346", "A.method", true));
  })

  it('initializeContext', async () => {
    setUpWindowLocation("?contentKey=zenuml-content-sequence");
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    await apWrapper2.initializeContext();
    expect(await apWrapper2.currentUser).toStrictEqual({"atlassianAccountId": "fake:user-account-id"});
    expect(await apWrapper2.currentSpace).toBe('fake-space');
  })

  it('must NOT throw exception when initializeContext', async () => {
    setUpWindowLocation("?contentKey=zenuml-content-sequence");
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    const _getCurrentUser = jest.fn().mockImplementation(async () => {
      throw new Error("mock error");
    });
    apWrapper2._getCurrentUser = _getCurrentUser.bind(apWrapper2);
    await apWrapper2.initializeContext();
    expect(await apWrapper2.currentUser).toBeUndefined();
    expect(await apWrapper2.currentSpace).toBeUndefined();
  })

  it('must NOT throw exception when initializeContext', async () => {
    setUpWindowLocation("?contentKey=zenuml-content-sequence");
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    const _getCurrentSpace = jest.fn().mockImplementation(async () => {
      throw new Error("mock error");
    });
    apWrapper2._getCurrentSpace = _getCurrentSpace.bind(apWrapper2);
    await apWrapper2.initializeContext();
    expect(await apWrapper2.currentUser).toStrictEqual({"atlassianAccountId": "fake:user-account-id"});
    expect(await apWrapper2.currentSpace).toBeUndefined();
  })
})
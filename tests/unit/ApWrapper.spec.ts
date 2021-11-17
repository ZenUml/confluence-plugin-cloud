import MockAp from "@/model/MockAp";
import ApWrapper2 from "@/model/ApWrapper2";

describe('ApWrapper', () => {

  it('tells whether it is a lite version or full version', () => {
    delete window.location;
    // @ts-ignore
    window.location = new URL("https://zenuml.com/?contentKey=zenuml-content-sequence");
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    expect(apWrapper2.isLite()).toBeFalsy();
  })

  it('tells whether it is a lite version or full version', () => {
    delete window.location;
    // @ts-ignore
    window.location = new URL("https://zenuml.com/?contentKey=zenuml-content-sequence&addonKey=com.zenuml.confluence-addon-lite");
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    expect(apWrapper2.isLite()).toBeTruthy();
  })

  it('tells us the page id', async () => {
    delete window.location;
    // @ts-ignore
    window.location = new URL("https://zenuml.com/?contentKey=zenuml-content-sequence");
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
})
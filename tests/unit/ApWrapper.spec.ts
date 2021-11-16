import MockAp from "@/model/MockAp";
import ApWrapper2 from "@/model/ApWrapper2";

describe('ApWrapper', () => {
  beforeEach(() => {
    // See the following pattern at https://icing.space/2021/mocking-window-location-in-jest/
    delete window.location;
    // @ts-ignore
    window.location = Object.assign(new URL("https://zenuml.com/?contentKey=zenuml-content-sequence"), {
      ancestorOrigins: "",
      assign: jest.fn(),
      reload: jest.fn(),
      replace: jest.fn()
    });

  });
  it('tells whether it is a lite version or full version', () => {
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    expect(apWrapper2.isLite()).toBeFalsy();
  })

  it('tells whether it is a lite version or full version', () => {
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    delete window.location;
    // @ts-ignore
    window.location = new URL('https://zenuml.com/?addonKey=com.zenuml.confluence-addon-lite')
    expect(apWrapper2.isLite()).toBeTruthy();
  })
})
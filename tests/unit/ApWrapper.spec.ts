import MockAp from "@/model/MockAp";
import ApWrapper2 from "@/model/ApWrapper2";

describe('ApWrapper', () => {
  it('tells whether it is a lite version or full version', () => {
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp, 'sequence');
    expect(apWrapper2.isLite()).toBeFalsy();
  })

  it('tells whether it is a lite version or full version', () => {
    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp, 'sequence');
    delete window.location;
    // @ts-ignore
    window.location = new URL('https://zenuml.com/?addonKey=com.zenuml.confluence-addon-lite')
    expect(apWrapper2.isLite()).toBeTruthy();
  })
})
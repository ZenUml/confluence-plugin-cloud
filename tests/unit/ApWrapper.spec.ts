import MockAp from "@/model/MockAp";
import ApWrapper2 from "@/model/ApWrapper2";
import helper from './TestHelper';

describe('ApWrapper', () => {
  it('tells whether it is a lite version or full version', () => {
    helper.setUpUrlParam('contentKey=sequence');

    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    expect(apWrapper2.isLite()).toBeFalsy();
  })

  it('tells a lite version', () => {
    helper.setUpUrlParam('addonKey=com.zenuml.confluence-addon-lite&contentKey=sequence');

    let mockAp = new MockAp();
    let apWrapper2 = new ApWrapper2(mockAp);
    expect(apWrapper2.isLite()).toBeTruthy();
  })
})
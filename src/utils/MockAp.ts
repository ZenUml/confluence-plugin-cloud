import MockApConfluence from "@/utils/MockApConfluence.ts";

export default class MockAp {
  public confluence: any

  constructor(confluence: any) {
    this.confluence = confluence;
    if (window.location.href.includes('localhost')) {
      console.log('You are using a mocked AP.confluence')
      let mockApConfluence = new MockApConfluence();
      // @ts-ignore
      window.AP = {
        confluence: mockApConfluence,
        resize() {
        }
      }
    }
  }
}
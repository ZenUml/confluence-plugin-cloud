import MockAp from "@/model/MockAp";

describe('MockAp', () => {
  it('constructor', () => {
    let mockAp = new MockAp('content_1234');
    expect(mockAp.contentId).toBe('content_1234');
  })
})
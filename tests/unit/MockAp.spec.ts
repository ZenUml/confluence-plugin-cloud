import MockAp from "@/model/MockAp";

describe('MockAp', function () {
  it('request', () => {
    const mockedAp = new MockAp();
    const resp = mockedAp.request();
    expect(resp).toBe('OK. (req is empty)')
  })
});
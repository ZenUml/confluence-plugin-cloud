import MockAp from "@/model/MockAp";

describe('MockAp', function () {
  it('request', async () => {
    const mockedAp = new MockAp();
    const resp = await mockedAp.request();
    expect(resp).toBe('OK. (req is empty)')
  })
});
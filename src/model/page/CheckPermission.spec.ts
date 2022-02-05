import CheckPermission from "@/model/page/CheckPermission";
describe('Check Page Permission', () => {
  it('should be able to check page permission', async () => {
    // then
    let requestFn = jest.fn().mockImplementation(async (req: any) => {
      const hasPermission = req.data.includes('user-001');
      return {
        body: JSON.stringify({
          hasPermission
        })
      }
    });
    expect(await CheckPermission('page-001', 'user-001', requestFn)).toBeTruthy();
    expect(await CheckPermission('page-001', 'user-002', requestFn)).toBeFalsy();
  })
})
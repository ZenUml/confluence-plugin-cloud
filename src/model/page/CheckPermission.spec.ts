import CheckPermission from "@/model/page/CheckPermission";
import {vi} from "vitest";
describe('Check Page Permission', () => {
  it('should be able to check page permission', async () => {
    // then
    let requestFn = vi.fn().mockImplementation(async (req: any) => {
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
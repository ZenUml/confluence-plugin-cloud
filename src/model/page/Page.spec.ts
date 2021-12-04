import {AtlasPage} from "@/model/page/AtlasPage";

describe('Page', () => {
  it('should know its page id', async () => {
    const page = new AtlasPage();
    const getLocationContext = jest.fn().mockImplementation(async () => {
      return {
        contentId: "page-001"
      }
    });
    page.getLocationContext = getLocationContext;
    expect(await page.getPageId()).toBe("page-001");
  });
  it('should list all macros', async () => {
    const page = new AtlasPage();
    expect(await page.macros(() => true)).toEqual([]);
  })
})
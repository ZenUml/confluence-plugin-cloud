import {AtlasPage} from "@/model/page/AtlasPage";
import {ILocationContext} from "@/model/ILocationContext";

describe('Page', () => {
  it('should know its page id', async () => {
    const page = new AtlasPage();
    const getLocationContext = jest.fn().mockImplementation(async (): Promise<ILocationContext> => {
      return {
        spaceKey: "space-001",
        contentType: "page",
        contentId: "page-001"
      }
    });

    page._getLocationContext = getLocationContext;
    expect(await page.getPageId()).toBe("page-001");
    expect(await page.getSpaceKey()).toBe("space-001");
  });
  it('should list all macros', async () => {
    const page = new AtlasPage();
    expect(await page.macros(() => true)).toEqual([]);
  })
})
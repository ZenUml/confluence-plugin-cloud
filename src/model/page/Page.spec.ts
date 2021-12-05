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
    expect(await page.getContentType()).toBe("page");
  });

  // A matcher function is passed to page.countMacros(). This functions accepts
  // a `MacroParams` object and returns a boolean.
  it('should count macros that match the matcher', async () => {
    const page = new AtlasPage();
    page.getPageId = jest.fn().mockImplementation(() => "page-001");
    page._requestFn = jest.fn().mockImplementation(async () => {
      let doc = {
        type: "doc",
        content: [
          {
            type: "extension",
            attrs: {
              extensionKey: "com.atlassian.confluence.macro.core",
              parameters: {
                macroParams: {
                  macroId: "macro-001",
                  macroName: "Macro 1",
                  customContentId: {
                    value: "custom-content-001"
                  },
                  macroParams: {
                    macroParam1: "Macro Param 1",
                    macroParam2: "Macro Param 2"
                  }
                }
              }
            }
          }
        ]
      };
      const responseBody = {
        body: {
          atlas_doc_format: {
            value: JSON.stringify(doc)
          }
        }
      };

      return {
        body: JSON.stringify(responseBody)
      }
    });
    expect(await page.countMacros(() => true)).toEqual(1);
    expect(await page.countMacros((macroParams) => {
      return macroParams.customContentId?.value === "custom-content-001"
    })).toEqual(1);
    expect(await page.countMacros(() => false)).toEqual(0);
    expect(await page.countMacros((macroParams) => {
      return macroParams.customContentId?.value === "custom-content-002"
    })).toEqual(0);
  })
})
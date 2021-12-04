import {AtlasPage} from "@/model/page/AtlasPage";

describe('Page', () => {
  it('should list all macros', () => {
    const page = new AtlasPage(String(1234));
    expect(page.macros).toEqual([]);
  })
})
import GraphMacroViewer from "@/utils/GraphMacroViewer";
import MockApConfluence from "@/utils/model/MockApConfluence";

describe('GraphMacro', () => {
  it('should have macroIdentifier as `graph`', () => {
    const mockApConfluence = new MockApConfluence();
    let graphMacro = new GraphMacroViewer({confluence: mockApConfluence});
    expect(graphMacro._macroIdentifier).toBe('graph')
  })
})
import GraphMacroViewer from "@/utils/GraphMacroViewer";
import MockApConfluence from "@/utils/MockApConfluence";

describe('GraphMacro', () => {
  it('should have macroIdentifier as `graph`', () => {
    const mockApConfluence = new MockApConfluence();
    let graphMacro = new GraphMacroViewer({confluence: mockApConfluence});
    expect(graphMacro._macroKeyPrefix).toBe('zenuml-graph-macro')
  })
})
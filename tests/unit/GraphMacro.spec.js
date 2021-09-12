import GraphMacro from "@/model/GraphMacro";
import MockApConfluence from "@/model/MockApConfluence";

describe('GraphMacro', () => {
  it('should have macroIdentifier as `graph`', () => {
    const mockApConfluence = new MockApConfluence();
    delete window.location;
    // @ts-ignore
    window.location = new URL('https://zenuml.com/?contentKey=zenuml-content-graph')
    let graphMacro = new GraphMacro({confluence: mockApConfluence});
    expect(graphMacro._macroIdentifier).toBe('graph')
  })
})
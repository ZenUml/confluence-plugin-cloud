import GraphMacro from "@/model/GraphMacro";
import MockApConfluence from "@/model/MockApConfluence";
import ApWrapper2 from "@/model/ApWrapper2";

describe('GraphMacro', () => {
  it('should have macroIdentifier as `graph`', () => {
    const mockApConfluence = new MockApConfluence();
    delete window.location;
    // @ts-ignore
    window.location = new URL('https://zenuml.com/?contentKey=zenuml-content-graph')
    let ap = {confluence: mockApConfluence};
    new GraphMacro(new ApWrapper2(ap));
  })
})
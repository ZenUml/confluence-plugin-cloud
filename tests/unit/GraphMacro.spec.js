import GraphMacro from "@/model/GraphMacro";
import MockApConfluence from "@/model/MockApConfluence";
import ApWrapper2 from "@/model/ApWrapper2";
import {setUpWindowLocation} from "../SetUpWindowLocation";

describe('GraphMacro', () => {
  it('should have macroIdentifier as `graph`', () => {
    setUpWindowLocation("?contentKey=zenuml-content-graph");
    const mockApConfluence = new MockApConfluence();
    let ap = {confluence: mockApConfluence};
    new GraphMacro(new ApWrapper2(ap));
  })
})
import {NULL_DIAGRAM} from "@/model/Diagram/Diagram";

describe('Diagram', function () {
  it('has a NULL_DIAGRAM function', function () {
    expect(NULL_DIAGRAM).toBeDefined();
    const nullDiagram = NULL_DIAGRAM;
    expect(nullDiagram).toStrictEqual(NULL_DIAGRAM);
    expect(nullDiagram).toBe(NULL_DIAGRAM);
  })
})
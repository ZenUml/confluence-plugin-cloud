import {DynamicContentMacro} from "atlassian-descriptor";
import {DynamicContentMacroImpl} from "./DynamicContentMacroImpl";
import expectedSequenceDiagramMacroFull from "../test-data/expected-sequence-diagram-macro-full"
import expectedGraphMacroFull from "../test-data/expected-graph-macro-full"
import expectedOpenApiMacroFull from "../test-data/expected-openapi-macro-full"
describe('DynamicContentMacro', function () {
  it('should return a dynamic content macro object', function () {
    const macro = new DynamicContentMacroImpl('macro-key', 'macro-name','macro-description',
      'macro-editor-url', 'attachment-url', 'macro-viewer-url');
    expect(macro.key).toEqual('macro-key');
    expect(macro.name.value).toEqual('macro-name');
    expect(macro.description.value).toEqual('macro-description');
    expect(macro.renderModes.default.url).toEqual('attachment-url');
    expect(macro.editor.url).toEqual('macro-editor-url');
    expect(macro.url).toEqual('macro-viewer-url');
  });

  it('should return a sequence diagram macro object', function () {
    const macro = DynamicContentMacroImpl.SequenceDiagramMacro;
    expect(macro).toEqual(expectedSequenceDiagramMacroFull);
  })

  it('should return a graph macro object', function () {
    const macro = DynamicContentMacroImpl.GraphMacro;
    expect(macro).toEqual(expectedGraphMacroFull);
  })

  it('should return an openapi macro object', function () {
    const macro = DynamicContentMacroImpl.OpenApiMacro;
    expect(macro).toEqual(expectedOpenApiMacroFull);
  })
});
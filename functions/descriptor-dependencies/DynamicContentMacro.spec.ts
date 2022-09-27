import {DynamicContentMacro} from "atlassian-descriptor";
import {DynamicContentMacroImpl} from "./DynamicContentMacroImpl";
import expectedSequenceDiagramMacroFull from "../test-data/expected-sequence-diagram-macro-full"
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

  // test SequenceDiagramMacro
  it('should return a sequence diagram macro object', function () {
    const macro = DynamicContentMacroImpl.SequenceDiagramMacro;
    expect(macro).toEqual(expectedSequenceDiagramMacroFull);
  })
});
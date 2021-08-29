import SequenceDiagramLoader from "@/utils/SequenceDiagramLoader";
import {IApWrapper} from "@/utils/IApWrapper";
import {IMacroData} from "@/utils/IMacroData";

class MockApWrapper implements IApWrapper {
  private _param: any;
  private _code: any;
  setUp_saveMacro(param: { uuid: string; } | null, code: string | undefined) {
    this._param = param;
    this._code = code;
  }

  async getMacroBody() {
    return this._code;
  }

  setup_saveContentProperty(content: { key?: string; value: any; }) {
    this._code = content.value;
  }
  // Note: we do not need key for this method.
  async getContentProperty2() {
    return {code: this._code};
  }

  getMacroData(): Promise<IMacroData | null> {
    return Promise.resolve(null);
  }
}

describe('SequenceDiagramLoader', () => {
  it('Load macro body', async () => {
    let mockApWrapper = new MockApWrapper();
    mockApWrapper.setUp_saveMacro(null, 'A.method1');
    let sequenceDiagramLoader = new SequenceDiagramLoader(mockApWrapper);
    let diagram = await sequenceDiagramLoader.load();
    expect(diagram.code).toBe('A.method1')
  })

  it('Load from content property by uuid from macro data', async () => {
    let mockApWrapper = new MockApWrapper();
    mockApWrapper.setUp_saveMacro({
      uuid: 'uuid_1234'
    }, '');
    mockApWrapper.setup_saveContentProperty({key: 'zenuml-sequence-macro-1234-body', value: 'A.method'})
    let sequenceDiagramLoader = new SequenceDiagramLoader(mockApWrapper);
    let diagram = await sequenceDiagramLoader.load();
    expect(diagram.code).toBe('A.method')
  })

  it('Load from custom content by uuid from macro data', () => {

  })
})
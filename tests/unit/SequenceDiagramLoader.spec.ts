import SequenceDiagramLoader from "@/utils/SequenceDiagramLoader";
import {IApWrapper} from "@/utils/IApWrapper";

class MockApWrapper implements IApWrapper {
  private _param: any;
  private _code: string | undefined;
  private _key: string | undefined;
  private _hasCustomContent: boolean = false;
  private _hasContentProperty: boolean = false;
  setUp_saveMacro(param: { uuid?: string, contentId?: string; } | null, code: string | undefined) {
    this._param = param;
    this._code = code;
  }

  async getMacroBody() {
    return this._code;
  }

  setup_saveContentProperty(content: { key?: string; value: any; }) {
    this._key = content.key;
    this._hasContentProperty = true;
    this._code = content.value;
  }
  // Note: we do not need key for this method.
  async getContentProperty2() {
    if(!this._hasContentProperty) {
      return undefined;
    }
    return {value: {code: this._code}};
  }

  async getMacroData() {
    return Promise.resolve(undefined);
  }

  setUp_saveCustomContent(code: string) {
    this._hasCustomContent = true;
    this._code = code;
  }

  async getCustomContent() {
    if(this._hasCustomContent) {
      return {value: { code: this._code }};
    }
    return undefined;
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
    mockApWrapper.setup_saveContentProperty({key: 'zenuml-sequence-macro-1234-body', value: 'A.method2'})
    let sequenceDiagramLoader = new SequenceDiagramLoader(mockApWrapper);
    let diagram = await sequenceDiagramLoader.load();
    expect(diagram.code).toBe('A.method2')
  })

  it('Load from custom content by uuid from macro data', async () => {
    let mockApWrapper = new MockApWrapper();
    mockApWrapper.setUp_saveMacro({
      contentId: 'content_1234'
    }, '');
    mockApWrapper.setUp_saveCustomContent('A.method3')
    let sequenceDiagramLoader = new SequenceDiagramLoader(mockApWrapper);
    let diagram = await sequenceDiagramLoader.load();
    expect(diagram.code).toBe('A.method3')

  })
})
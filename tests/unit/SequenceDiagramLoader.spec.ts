import SequenceDiagramLoader from "@/model/SequenceDiagramLoader";
import {IApWrapper, VersionType} from "@/model/IApWrapper";
import {ICustomContent} from "@/model/ICustomContent";
import {IContentPropertyNormalised} from "@/model/IContentProperty";
import {MacroIdentifier} from "@/model/MacroIdentifier";
import {IMacroData} from "@/model/IMacroData";
import {DataSource, Diagram, DiagramType} from '@/model/Diagram';

class MockApWrapper implements IApWrapper {
  versionType: VersionType = VersionType.Lite;

  createCustomContent(content: Diagram): Promise<any> {
      throw new Error("Method not implemented.");
  }
  updateCustomContent(contentObj: ICustomContent, newBody: Diagram): Promise<any> {
      throw new Error("Method not implemented.");
  }
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
  async getContentProperty2(): Promise<IContentPropertyNormalised | undefined> {
    if(!this._hasContentProperty) {
      return undefined;
    }
    return {value: {code: this._code, diagramType: DiagramType.Sequence, source: DataSource.ContentProperty}};
  }

  async setContentProperty(_: IContentPropertyNormalised) {}

  async getMacroData() {
    return Promise.resolve(undefined);
  }

  setUp_saveCustomContent(code: string) {
    this._hasCustomContent = true;
    this._code = code;
  }

  async getCustomContent(): Promise<ICustomContent | undefined> {
    if(this._hasCustomContent) {
      return {container: {id: "", type: ""}, id: "", space: {key: ""}, title: "", type: "", version: {number: 0},
        value: { code: this._code, diagramType: DiagramType.Sequence, source: DataSource.CustomContent }};
    }
    return undefined;
  }

  isLite(): boolean {
    return false;
  }

  _macroIdentifier: MacroIdentifier = MacroIdentifier.Sequence;

  getCustomContentById(id: string): Promise<ICustomContent | undefined> {
    return Promise.resolve(undefined);
  }

  getPageId(): Promise<string> {
    return Promise.resolve("");
  }

  hasCustomContent(): boolean {
    return false;
  }

  saveCustomContent(customContentId: string, value: object): Promise<any> {
    return Promise.resolve(undefined);
  }

  saveMacro(params: IMacroData, body: string): void {
  }

  async canUserEdit(): Promise<boolean> {
    return true;
  }

  initializeContext(): void {
  }

  isDisplayMode(): any {
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
    expect(diagram.code).toBe('A.method3');
  })
})
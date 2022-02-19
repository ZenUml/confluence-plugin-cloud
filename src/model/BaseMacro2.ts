import uuidv4 from '../utils/uuid';
import {getUrlParam, trackEvent} from '@/utils/window.ts';
import ApWrapper2 from "./ApWrapper2";
import {IApWrapper} from "@/model/IApWrapper";
import {IContentPropertyNormalised} from "@/model/IContentProperty";
import {ICustomContent} from "@/model/ICustomContent";
import {IMacroData} from "@/model/IMacroData";
import {DataSource, Diagram, DiagramType} from "@/model/Diagram";

class BaseMacro2 {
  _diagram?: Diagram;
  _uuid: any;
  _customContentId: string | undefined;
  _loaded = false;
  _standaloneCustomContent: boolean;
  _addonVersion: string;
  _apWrapper: IApWrapper;

  constructor(apWrapper2: ApWrapper2) {
    this._apWrapper = apWrapper2;

    const renderedFor = getUrlParam('rendered.for');
    this._standaloneCustomContent = renderedFor === 'custom-content-native';

    this._addonVersion = getUrlParam('version') || '';
  }

  // deprecated: We should rely on diagram.diagramType. For old diagrams we do not have that saved.
  getDiagramType(diagram: Diagram | undefined): string {
    if(diagram?.code) {
      return '_sequence';
    }
    if(diagram?.mermaidCode) {
      return '_mermaid';
    }
    if(diagram?.graphXml) {
      return '_graph';
    }
    return '_unknown';
  }

  trackDiagramEvent(diagram: Diagram | undefined, event: string, category: string) {
    trackEvent(diagram?.diagramType || this.getDiagramType(diagram), event, category);
  }

  async getCustomContent() {
    if(this._customContentId) {
      const result = await this._apWrapper.getCustomContentById(this._customContentId);
      this.trackDiagramEvent(result?.value, 'load_macro', 'custom_content');
      return result;
    }
  }

  async getContentProperty(): Promise<IContentPropertyNormalised | undefined> {
    let content = await this._apWrapper.getContentProperty2();
    if(content?.value.source === DataSource.ContentPropertyOld) {
      this.trackDiagramEvent(content?.value, 'load_macro', 'content_property_old');
    } else {
      this.trackDiagramEvent(content?.value, 'load_macro', 'content_property');
    }
    return content;
  }

  async getMacroBody() {
    const body = await this._apWrapper.getMacroBody();
    if(body) {
      trackEvent('sequence', 'load_macro', 'macro_body');
    }
    return body;
  }

  async getContent(): Promise<IContentPropertyNormalised | ICustomContent | undefined> {
    if(this._standaloneCustomContent) {
      // @ts-ignore
      this._customContentId = getUrlParam('content.id');
      return await this.getCustomContent();
    }
    const macroData = await this._apWrapper.getMacroData();

    // When the macro is edited for the first time, macro data is not available in the preview mode
    // Fall back to the uuid parameter in the URL.
    // This is defined in the descriptor and is only available for sequence-viewer.html.
    this._uuid = macroData?.uuid || getUrlParam('uuid');

    this._customContentId = macroData?.customContentId;
    
    if(this._customContentId) {
      return await this.getCustomContent();
    }
    if(this._uuid) {
      return await this.getContentProperty();
    }
    return undefined;
  }

  async load(): Promise<Diagram> {
    let payload, body;
    try {
      payload = await this.getContent();
      if(!payload?.value) {
        body = await this.getMacroBody();
      }
    } catch(e) { //get content property could fail sometimes
      console.debug('Load content error, fallback to macro body');
      body = await this.getMacroBody();
      if(!body) {
        throw e;
      }
    }

    this._loaded = true;
    this._diagram = payload?.value || this.diagramForCode(body);
    return this._diagram;
  }

  diagramForCode(code: string | undefined): Diagram {
    return {
      id: this._uuid,
      diagramType: DiagramType.Sequence,
      code: code,
      source: DataSource.MacroBody
    };
  }

  // Warning! Do not call getXXX in save. Do retest if you want to call getXXX.
  // It does not work as of 17th May 2020. That is why we have stored key and version
  async save(diagram: Diagram) {
    if (!this._loaded) {
      throw new Error('You have to call load before calling save()')
    }
    const uuid = this._uuid || uuidv4();

    let customContent;
    if(this._customContentId && !this._diagram?.isCopy) {
      customContent = await this._apWrapper.saveCustomContent(this._customContentId, diagram);
    } else {
      customContent = await this._apWrapper.createCustomContent(diagram);
    }

    this.trackDiagramEvent(diagram, 'save_macro', 'custom_content');

    const macroParam = {uuid: uuid, updatedAt: new Date()} as IMacroData;
    macroParam.customContentId = customContent.id;

    // Saving core data to body for disaster recovery
    let body = BaseMacro2.getCoreData(diagram);
    this._apWrapper.saveMacro(macroParam, body);
    this.trackDiagramEvent(diagram, 'save_macro', 'macro_body');

    return customContent.id;
  }

  async saveOnDialog(diagram: Diagram) {
    if (!this._loaded) {
      throw new Error('You have to call load before calling save()')
    }

    if(this._diagram?.source === DataSource.ContentProperty) {
      const contentProperty = {
        key: this._diagram?.payload?.key,
        value: diagram,
        version: {
          number: (this._diagram?.payload?.version.number || 0) + 1
        }
      }
    
      await this._apWrapper.setContentProperty(contentProperty as IContentPropertyNormalised);
      this.trackDiagramEvent(diagram, 'save_macro', 'content_property');
      return;
    }

    if(this._customContentId) {
      await this._apWrapper.saveCustomContent(this._customContentId, diagram);
      this.trackDiagramEvent(diagram, 'save_macro', 'custom_content');
    }
  }

  async canEditOnDialog(): Promise<boolean> {
    const isVersionSupported = this._addonVersion >= '2021.11';
    const notMacroBody = this._diagram?.source !== DataSource.MacroBody;
    const notCopy = !this._diagram?.isCopy;
    return isVersionSupported && this._loaded && notMacroBody && notCopy && (await this._apWrapper.canUserEdit());
  }

  private static getCoreData(value: Diagram) {
    let body;
    switch (value.diagramType) {
      case DiagramType.Sequence:
        body = value.code || '';
        break;
      case DiagramType.Mermaid:
        body = value.mermaidCode || '';
        break;
      case DiagramType.Graph:
        body = value.graphXml || '';
        break;
    }
    return body;
  }
}

export default BaseMacro2
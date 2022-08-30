import uuidv4 from '../utils/uuid';
import {getUrlParam, trackEvent} from '@/utils/window';
import {IApWrapper} from "@/model/IApWrapper";
import {IMacroData} from "@/model/IMacroData";
import {DataSource, Diagram} from "@/model/Diagram/Diagram";

class BaseMacro2 {
  _diagram?: Diagram;
  _uuid: any;
  _customContentId: string | undefined;
  _loaded = false;
  _addonVersion: string;
  _apWrapper: IApWrapper;

  constructor(apWrapper2: IApWrapper) {
    this._apWrapper = apWrapper2;

    this._addonVersion = getUrlParam('version') || '';
  }

  initializeContext() {
    this._apWrapper.initializeContext();
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

  async saveOnDialog(diagram: Diagram) {
    // if (!this._loaded) {
    //   throw new Error('You have to call load before calling save()')
    // }

    if(this._diagram?.source === DataSource.ContentProperty) {
      this.trackDiagramEvent(diagram, 'save_macro_skipped', 'content_property');
      return;
    }

    if(this._customContentId) {
      await this._apWrapper.saveCustomContent(this._customContentId, diagram);
      this.trackDiagramEvent(diagram, 'save_macro', 'custom_content');
    }
  }

  async saveEmbedded(customContentId: string, customContentType: string, diagram: Diagram) {
    // if (!this._loaded) {
    //   throw new Error('You have to call load before calling save')
    // }
    const uuid = this._uuid || uuidv4();

    const macroParam = {uuid: uuid, updatedAt: new Date(), customContentId, customContentType} as IMacroData;

    console.log('Save embedded: ', macroParam);

    this._apWrapper.saveMacro(macroParam, '');
    this.trackDiagramEvent(diagram, 'save_macro', 'embedded');
  }
}

export default BaseMacro2
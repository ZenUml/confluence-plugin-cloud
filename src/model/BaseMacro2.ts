import {getUrlParam, trackEvent} from '@/utils/window';
import {IApWrapper} from "@/model/IApWrapper";
import {Diagram} from "@/model/Diagram/Diagram";

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
}

export default BaseMacro2
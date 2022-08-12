import ApWrapper2 from "@/model/ApWrapper2";
import {IAp} from "@/model/IAp";
import {StorageProvider} from "@/model/ContentProvider/StorageProvider";
import {DataSource, Diagram, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import {trackEvent} from "@/utils/window";

// deprecated: We should rely on diagram.diagramType. For old diagrams we do not have that saved.
function getDiagramType(diagram: Diagram | undefined): string {
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

function trackDiagramEvent(diagram: Diagram | undefined, event: string, category: string) {
  trackEvent(diagram?.diagramType || getDiagramType(diagram), event, category);
}

export class ContentPropertyStorageProvider implements StorageProvider {
  private apWrapper: ApWrapper2;

  constructor(AP: IAp) {
    this.apWrapper = new ApWrapper2(AP);
  }

  async getContent(id: string | undefined): Promise<Diagram> {
    const contentProperty = await this.apWrapper.getContentProperty2();
    console.log('content property', contentProperty);
    if(contentProperty?.value.source === DataSource.ContentPropertyOld) {
      trackDiagramEvent(contentProperty?.value, 'load_macro', 'content_property_old');
    } else {
      trackDiagramEvent(contentProperty?.value, 'load_macro', 'content_property');
    }
    return contentProperty?.value || NULL_DIAGRAM;
  }

  async getCustomContentList() {
    return await this.apWrapper.listCustomContentByType(['zenuml-content-sequence', 'zenuml-content-graph']);
  }
}
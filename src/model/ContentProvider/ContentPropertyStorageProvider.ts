import ApWrapper2 from "@/model/ApWrapper2";
import {IAp} from "@/model/IAp";
import {StorageProvider} from "@/model/ContentProvider/StorageProvider";
import {DataSource, Diagram, DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import {trackEvent} from "@/utils/window";
import {IContentPropertyNormalised} from "@/model/IContentProperty";

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

  // We load content property only if the entry is a macro but not a dialog.
  // So we do not need id to be passed in.
  async getDiagram(id: undefined): Promise<Diagram> {
    let contentProperty;

    let macroData = await this.apWrapper.getMacroData();
    const uuid = macroData?.uuid;
    if (!uuid) {
      console.warn('`uuid` is empty. This diagram has not been initialised. Most likely it has not been edited.')
      return NULL_DIAGRAM;
    }
    let key = this.apWrapper.propertyKey(uuid);
    let property = await this.apWrapper.getContentProperty(key);
    if (!property) {
      console.warn('property is not found with key:' + key);
      return NULL_DIAGRAM;
    }
    contentProperty = Object.assign({}, property) as IContentPropertyNormalised;
    if (typeof property.value === "string") {
      contentProperty.value = {
        diagramType: DiagramType.Sequence,
        source: DataSource.ContentPropertyOld,
        code: property.value
      }
    } else {
      contentProperty.value.source = DataSource.ContentProperty;
    }
    contentProperty.value.id = key;
    contentProperty.value.payload = contentProperty; // To cache content property key and version on Diagram object

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
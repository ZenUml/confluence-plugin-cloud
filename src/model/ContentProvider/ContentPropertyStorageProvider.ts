import ApWrapper2 from "@/model/ApWrapper2";
import {StorageProvider} from "@/model/ContentProvider/StorageProvider";
import {DataSource, Diagram, DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import {getUrlParam, trackEvent} from "@/utils/window";
import {IContentProperty, IContentPropertyNormalised} from "@/model/IContentProperty";
import {MacroIdentifier} from "@/model/MacroIdentifier";

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
  private readonly _macroIdentifier: MacroIdentifier;

  constructor(apWrapper: ApWrapper2) {
    this.apWrapper = apWrapper;
    let macroIdentifier: MacroIdentifier;
    let contentKey = getUrlParam('contentKey');
    if (!contentKey) {
      console.warn('contentKey URL parameter is not provided. It can be `sequence` or `graph`. Falling back to `sequence`');
      contentKey = 'sequence';
    }
    if (contentKey?.includes('sequence')) {
      macroIdentifier = MacroIdentifier.Sequence;
    } else if (contentKey?.includes('graph')) {
      macroIdentifier = MacroIdentifier.Graph
    } else {
      console.warn('Wrong value in contentKey URL parameter. Fall back to `sequence`.')
      macroIdentifier = MacroIdentifier.Sequence;
    }
    this._macroIdentifier = macroIdentifier;
  }

  propertyKey(uuid: string) {
    const macroKey = `zenuml-${this._macroIdentifier}-macro`;
    return `${macroKey}-${uuid}-body`;
  }

  // We load content property only if the entry is a macro but not a dialog.
  // So we do not need id to be passed in.
  async getDiagram(id: undefined): Promise<Diagram> {
    let macroData = await this.apWrapper.getMacroData();
    const uuid = macroData?.uuid;
    if (!uuid) {
      console.warn('`uuid` is empty. This diagram has not been initialised. Most likely it has not been edited.')
      return NULL_DIAGRAM;
    }
    let key = this.propertyKey(uuid);
    let property = await this.apWrapper.getContentProperty(key);
    if (!property) {
      console.warn('property is not found with key:' + key);
      return NULL_DIAGRAM;
    }
    const contentProperty = ContentPropertyStorageProvider._normaliseContentProperty(property, key);

    return contentProperty.value;
  }

  private static _normaliseContentProperty(property: IContentProperty, key: string) {
    const contentProperty = Object.assign({}, property) as IContentPropertyNormalised;
    if (typeof property.value === "string") {
      contentProperty.value = {
        diagramType: DiagramType.Sequence,
        source: DataSource.ContentPropertyOld,
        code: property.value
      }
      trackDiagramEvent(contentProperty.value, 'load_macro', 'content_property_old');
    } else {
      contentProperty.value.source = DataSource.ContentProperty;
      trackDiagramEvent(contentProperty.value, 'load_macro', 'content_property');
    }
    contentProperty.value.id = key;
    return contentProperty;
  }
}

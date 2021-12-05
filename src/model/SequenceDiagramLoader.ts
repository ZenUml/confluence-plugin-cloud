import {DataSource, Diagram, DiagramType} from "@/model/Diagram";
import {IApWrapper} from "@/model/IApWrapper";
import Example from "@/utils/sequence/Example";

// TODO: Check if we should use it in other scenarios. It is only used in viewer dialog for the moment.
export default class SequenceDiagramLoader {
  apWrapper: IApWrapper;

  constructor(apWrapper: IApWrapper) {
    this.apWrapper = apWrapper;
  }

  async load() : Promise<Diagram>{
    let customContent = await this.apWrapper.getCustomContent();
    if (customContent) {
      console.log("SequenceDiagramLoader: Loaded custom content");
      return customContent.value;
    }
    console.warn('SequenceDiagramLoader: Custom Content is empty. Loading from content property.');
    let contentProperty = await this.apWrapper.getContentProperty2();
    if (contentProperty) {
      return contentProperty.value;
    }
    console.error('SequenceDiagramLoader: contentProperty is empty. Falling back to macro body.');
    let macroBody = await this.apWrapper.getMacroBody();
    if (macroBody) {
      console.warn('SequenceDiagramLoader: loaded from macro body');
      return {id: 'NO_ID',  code: macroBody, styles: {}, diagramType: DiagramType.Sequence,source: DataSource.MacroBody};
    }
    console.warn('SequenceDiagramLoader: macro body is empty. Use example.');
    return {id: 'NO_ID', code: Example, styles: {}, diagramType: DiagramType.Sequence,source: DataSource.Example};
  }
}
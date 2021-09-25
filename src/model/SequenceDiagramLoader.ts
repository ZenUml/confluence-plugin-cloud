import {DataSource, Diagram, DiagramType} from "@/model/Diagram";
import {IApWrapper} from "@/model/IApWrapper";
import Example from "@/utils/sequence/Example";

export default class SequenceDiagramLoader {
  apWrapper: IApWrapper;

  constructor(apWrapper: IApWrapper) {
    this.apWrapper = apWrapper;
  }

  async load() : Promise<Diagram>{
    let customContent = await this.apWrapper.getCustomContent();
    if (customContent) {
      return { code: customContent.value.code, styles: customContent.value.styles, diagramType: DiagramType.Sequence, source: DataSource.CustomContent }
    }
    console.debug('contentProperty is empty. Loading from content property.');
    let contentProperty = await this.apWrapper.getContentProperty2();
    if (contentProperty) {
      console.log('loaded from contentProperty', contentProperty);
      return {code: contentProperty.value.code, styles: contentProperty.value.styles, diagramType: DiagramType.Sequence,source: DataSource.ContentProperty};
    }
    console.log('contentProperty is empty. Loading from macro body.');
    let macroBody = await this.apWrapper.getMacroBody();
    if (macroBody) {
      console.log('loaded from macro body', macroBody)
      return {code: macroBody, styles: {}, diagramType: DiagramType.Sequence,source: DataSource.MacroBody};
    }
    console.log('macro body is empty. Use example.');
    return {code: Example, styles: {}, diagramType: DiagramType.Sequence,source: DataSource.Example};
  }
}
import {DataSource, Diagram} from "@/utils/Diagram";
import {IApWrapper} from "@/utils/IApWrapper";

export default class SequenceDiagramLoader {
  apWrapper: IApWrapper;

  constructor(apWrapper: IApWrapper) {
    this.apWrapper = apWrapper;
  }

  async load() : Promise<Diagram>{
    let customContent = await this.apWrapper.getCustomContent();
    if (customContent) {
      return { code: customContent.value.code, source: DataSource.CustomContent }
    }
    console.debug('contentProperty is empty. Loading from content property.');
    let contentProperty = await this.apWrapper.getContentProperty2();
    if (contentProperty) {
      console.log('loaded contentProperty', contentProperty);
      return {code: contentProperty.value.code, source: DataSource.ContentProperty};
    }
    console.log('contentProperty is empty. Loading from macro body.');
    return {code: await this.apWrapper.getMacroBody() || '', source: DataSource.MacroBody};
  }
}
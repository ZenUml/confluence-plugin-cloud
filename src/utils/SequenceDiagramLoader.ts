import {Diagram} from "@/utils/Diagram";
import {IApWrapper} from "@/utils/IApWrapper";

export default class SequenceDiagramLoader {
  apWrapper: IApWrapper;

  constructor(apWrapper: IApWrapper) {
    this.apWrapper = apWrapper;
  }

  async load() : Promise<Diagram>{
    let customContent = await this.apWrapper.getCustomContent();
    if (customContent) {
      return { code: customContent.value.code }
    }
    let contentProperty = await this.apWrapper.getContentProperty2();
    if(!contentProperty) {
      console.log('contentProperty is empty. Load from macro body.');
      return { code: await this.apWrapper.getMacroBody() || ''};
    } else {
      console.log('loaded contentProperty', contentProperty);
      return {code: contentProperty.value.code};
    }
  }
}
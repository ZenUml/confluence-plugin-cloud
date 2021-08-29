import {Diagram} from "@/utils/Diagram";
import {IApWrapper} from "@/utils/IApWrapper";

export default class SequenceDiagramLoader {
  apWrapper: IApWrapper;

  constructor(apWrapper: IApWrapper) {
    this.apWrapper = apWrapper;
  }

  async load() : Promise<Diagram>{
    let content = await this.apWrapper.getContentProperty2();
    if(!content) {
      return { code: await this.apWrapper.getMacroBody() || ''};
    } else {
      console.log('loaded content from content property', content);
      return content;
    }
  }
}
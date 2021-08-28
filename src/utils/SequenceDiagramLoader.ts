import ApWrapper2 from "./ApWrapper2";
import {Diagram} from "@/utils/Diagram";

export default class SequenceDiagramLoader {
  apWrapper: ApWrapper2;

  constructor(apWrapper: ApWrapper2) {
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
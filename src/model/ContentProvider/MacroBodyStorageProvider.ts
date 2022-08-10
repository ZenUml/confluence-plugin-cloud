import ApWrapper2 from "@/model/ApWrapper2";
import {IAp} from "@/model/IAp";
import {StorageProvider} from "@/model/ContentProvider/StorageProvider";
import {Diagram, DiagramType} from "@/model/Diagram";

export class MacroBodyStorageProvider implements StorageProvider {
  private apWrapper: ApWrapper2;

  constructor(AP: IAp) {
    this.apWrapper = new ApWrapper2(AP);
  }

  async getContent(id: string | undefined): Promise<Diagram | undefined> {
    const macroBody = await this.apWrapper.getMacroBody();
    console.log('macro body', macroBody);
    return {diagramType: DiagramType.Sequence, code: macroBody};
  }

  async getCustomContentList() {
    return await this.apWrapper.listCustomContentByType(['zenuml-content-sequence', 'zenuml-content-graph']);
  }
}
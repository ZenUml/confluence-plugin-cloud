import ApWrapper2 from "@/model/ApWrapper2";
import {IAp} from "@/model/IAp";
import {StorageProvider} from "@/model/ContentProvider/StorageProvider";
import {Diagram, DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";

export class MacroBodyStorageProvider implements StorageProvider {
  private apWrapper: ApWrapper2;

  constructor(AP: IAp) {
    this.apWrapper = new ApWrapper2(AP);
  }

  async getDiagram(id: string | undefined): Promise<Diagram> {
    const macroBody = await this.apWrapper.getMacroBody();
    if(!macroBody) {
      return NULL_DIAGRAM;
    }
    return {diagramType: DiagramType.Sequence, code: macroBody};
  }

  async getCustomContentList() {
    return await this.apWrapper.listCustomContentByType(['zenuml-content-sequence', 'zenuml-content-graph']);
  }
}
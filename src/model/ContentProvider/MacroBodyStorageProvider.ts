import ApWrapper2 from "@/model/ApWrapper2";
import {StorageProvider} from "@/model/ContentProvider/StorageProvider";
import {Diagram, DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";

export class MacroBodyStorageProvider implements StorageProvider {
  private apWrapper: ApWrapper2;

  constructor(apWrapper: ApWrapper2) {
    this.apWrapper = apWrapper;
  }

  async getDiagram(id: string | undefined): Promise<Diagram> {
    const macroBody = await this.apWrapper.getMacroBody();
    if(!macroBody) {
      return NULL_DIAGRAM;
    }
    return {diagramType: DiagramType.Sequence, code: macroBody};
  }
}

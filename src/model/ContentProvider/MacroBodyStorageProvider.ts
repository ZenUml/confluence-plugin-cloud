import ApWrapper2 from "@/model/ApWrapper2";
import {StorageProvider} from "@/model/ContentProvider/StorageProvider";
import {Diagram, DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import {IApWrapper} from "@/model/IApWrapper";

export class MacroBodyStorageProvider implements StorageProvider {
  private apWrapper: IApWrapper;

  constructor(apWrapper: IApWrapper) {
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

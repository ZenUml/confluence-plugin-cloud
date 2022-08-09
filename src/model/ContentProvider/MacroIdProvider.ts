import {IAp} from "@/model/IAp";
import ApWrapper2 from "@/model/ApWrapper2";
import uuidv4 from "@/utils/uuid";

export class MacroIdProvider {
  private apWrapper: ApWrapper2;

  constructor(AP: IAp) {
    this.apWrapper = new ApWrapper2(AP);
  }

  async getId(): Promise<string | undefined> {
    const macroData = await this.apWrapper.getMacroData();
    return macroData?.customContentId;
  }

  async save(id: string) {
    const macroData = await this.apWrapper.getMacroData();
    const uuid = macroData?.uuid || uuidv4();
    this.apWrapper.saveMacro({uuid, customContentId: id, updatedAt: new Date()}, '');
  }
}
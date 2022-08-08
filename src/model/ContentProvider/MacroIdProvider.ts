import {IAp} from "@/model/IAp";
import ApWrapper2 from "@/model/ApWrapper2";

export class MacroIdProvider {
  private apWrapper: ApWrapper2;

  constructor(AP: IAp) {
    this.apWrapper = new ApWrapper2(AP);
  }

  async getId(): Promise<string | undefined> {
    const macroData = await this.apWrapper.getMacroData();
    return macroData?.customContentId;
  }
}
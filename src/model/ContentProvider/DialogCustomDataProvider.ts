import ApWrapper2 from "@/model/ApWrapper2";
import {IdProvider} from "@/model/ContentProvider/IdProvider";
import {IApWrapper} from "@/model/IApWrapper";

export class DialogCustomDataProvider implements IdProvider {
  private apWrapper: IApWrapper;

  constructor(apWrapper: IApWrapper) {
    this.apWrapper = apWrapper;
  }

  async getId() {
    const data: any = await this.apWrapper.getDialogCustomData();
    return data && (data['content.id'] || data.contentId);
  }

  async getUuid() {
    const macroData = await this.apWrapper.getMacroData();
    return macroData?.uuid;
  }
}

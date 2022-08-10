import ApWrapper2 from "@/model/ApWrapper2";
import {IAp} from "@/model/IAp";
import {StorageProvider} from "@/model/ContentProvider/StorageProvider";
import {Diagram} from "@/model/Diagram";

export class CustomContentStorageProvider implements StorageProvider {
  private apWrapper: ApWrapper2;

  constructor(AP: IAp) {
    this.apWrapper = new ApWrapper2(AP);
  }

  async getContent(id: string | undefined): Promise<Diagram | undefined> {
    if (!id) {
      return undefined;
    }
    const customContent = await this.apWrapper.getCustomContentById(id);
    // @ts-ignore
    const value = customContent?.body?.raw.value;
    return JSON.parse(value);
  }

  async getCustomContentList() {
    return await this.apWrapper.listCustomContentByType(['zenuml-content-sequence', 'zenuml-content-graph']);
  }
}
import ApWrapper2 from "@/model/ApWrapper2";
import {IAp} from "@/model/IAp";
import {StorageProvider} from "@/model/ContentProvider/StorageProvider";

export class CustomContentStorageProvider implements StorageProvider {
  private apWrapper: ApWrapper2;

  constructor(AP: IAp) {
    this.apWrapper = new ApWrapper2(AP);
  }

  async getContent(id: string): Promise<Object | undefined> {
    const customContent = await this.apWrapper.getCustomContentById(id);
    // @ts-ignore
    const value = customContent?.body?.raw.value;
    const code = JSON.parse(value).code;
    return {code};
  }

  async getCustomContentList() {
    return await this.apWrapper.listCustomContentByType(['zenuml-content-sequence', 'zenuml-content-graph']);
  }
}
import ApWrapper2 from "@/model/ApWrapper2";
import {IAp} from "@/model/IAp";
import {StorageProvider} from "@/model/ContentProvider/StorageProvider";
import {Diagram, NULL_DIAGRAM} from "@/model/Diagram/Diagram";

export class CustomContentStorageProvider implements StorageProvider {
  private apWrapper: ApWrapper2;

  constructor(AP: IAp) {
    this.apWrapper = new ApWrapper2(AP);
  }

  async getDiagram(id: string | undefined): Promise<Diagram> {
    if (!id) {
      return NULL_DIAGRAM;
    }
    const customContent = await this.apWrapper.getCustomContentById(id);
    // @ts-ignore
    const value = customContent?.body?.raw.value;
    return JSON.parse(value);
  }

  async getCustomContentList() {
    return await this.apWrapper.listCustomContentByType(['zenuml-content-sequence', 'zenuml-content-graph']);
  }

  async save(diagram: Diagram): Promise<string> {
    let customContent;
    if (diagram?.source === 'custom-content' && diagram?.id && !diagram?.isCopy) {
      customContent = await this.apWrapper.saveCustomContent(diagram.id, diagram);
    } else {
      customContent = await this.apWrapper.createCustomContent(diagram);
    }
    return customContent.id;
  }
}
import ApWrapper2 from "@/model/ApWrapper2";
import {StorageProvider} from "@/model/ContentProvider/StorageProvider";
import {Diagram, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import {IApWrapper} from "@/model/IApWrapper";

export class CustomContentStorageProvider implements StorageProvider {
  private apWrapper: IApWrapper;

  constructor(apWrapper: IApWrapper) {
    this.apWrapper = apWrapper;
  }

  async getDiagram(id: string | undefined): Promise<Diagram> {
    if (!id) {
      return NULL_DIAGRAM;
    }
    const customContent = await this.apWrapper.getCustomContentById(id);
    // @ts-ignore
    return customContent?.value;
  }

  async getCustomContentList() {
    return await this.apWrapper.searchCustomContent();
  }

  async save(diagram: Diagram): Promise<string> {
    let customContent;
    if (diagram?.source === 'custom-content' && diagram?.id && !diagram?.isCopy) {
      customContent = await this.apWrapper.saveCustomContent(diagram.id, diagram);
    } else {
      customContent = await this.apWrapper.createCustomContent(diagram);
    }
    return String(customContent.id);
  }
}

import ApWrapper2 from "@/model/ApWrapper2";
import {StorageProvider} from "@/model/ContentProvider/StorageProvider";
import {Diagram, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import { SearchResults } from "../ICustomContent";

export class CustomContentStorageProvider implements StorageProvider {
  private apWrapper: ApWrapper2;

  constructor(apWrapper: ApWrapper2) {
    this.apWrapper = apWrapper;
  }

  async getDiagram(id: string | undefined): Promise<Diagram> {
    if (!id) {
      return NULL_DIAGRAM;
    }
    const customContent = await this.apWrapper.getCustomContentByIdV2(id);
    // @ts-ignore
    return customContent?.value;
  }

  async getCustomContentList(maxItems?: number) {
    return await this.apWrapper.searchCustomContent(maxItems);
  }

  async searchPagedCustomContent(pageSize?: number,keyword: string='',onlyMine: boolean=false,docType: string='',): Promise<SearchResults> {
    return await this.apWrapper.searchPagedCustomContent(pageSize,keyword,onlyMine,docType);
  }
  async searchNextPageCustomContent(nextPageUrl: string): Promise<SearchResults> {
    return await this.apWrapper.searchPagedCustomContentByUrl(nextPageUrl);
  }

  async save(diagram: Diagram): Promise<string> {
    let customContent;
    if (diagram?.source === 'custom-content' && diagram?.id && !diagram?.isCopy) {
      customContent = await this.apWrapper.saveCustomContentV2(diagram.id, diagram);
    } else {
      customContent = await this.apWrapper.createCustomContent(diagram);
    }
    return String(customContent.id);
  }
}
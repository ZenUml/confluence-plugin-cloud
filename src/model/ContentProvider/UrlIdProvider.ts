import {getUrlParam} from "@/utils/window";
import {IdProvider} from "@/model/ContentProvider/IdProvider";

export class UrlIdProvider implements IdProvider{

  async getId(): Promise<string | undefined> {
    return getUrlParam('content.id');
  }
}
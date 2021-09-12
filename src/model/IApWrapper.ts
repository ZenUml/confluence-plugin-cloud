import {IMacroData} from "@/model/IMacroData";
import {IContentProperty} from "@/model/IContentProperty";
import {ICustomContent} from "@/model/ICustomContent";

export interface IApWrapper {
  isLite(): boolean;

  getMacroData(): Promise<IMacroData | undefined>;

  getMacroBody(): Promise<string | undefined>;

  getContentProperty2(): Promise<IContentProperty | undefined>;

  getCustomContent(): Promise<ICustomContent | undefined>;

  getCustomContentById(id: string): Promise<ICustomContent | undefined>;

  getPageId(): Promise<string>;

  hasCustomContent(): boolean;

  saveCustomContent(customContentId: string, uuid: string, value: object): Promise<any>;

  saveMacro(params: IMacroData, body: string): void;
}
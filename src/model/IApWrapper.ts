import {IMacroData} from "@/model/IMacroData";
import {IContentPropertyNormalised} from "@/model/IContentProperty";
import {ICustomContent} from "@/model/ICustomContent";
import {ICustomContentResponseBody} from "@/model/ICustomContentResponseBody";
import {Diagram} from "@/model/Diagram";

export enum VersionType {
  Lite = 'lite',
  Full = 'full'
}

export interface IApWrapper {
  versionType: VersionType;
  initializeContext(): void;
  isLite(): boolean;

  // Macro APIs
  getMacroData(): Promise<IMacroData | undefined>;
  getMacroBody(): Promise<string | undefined>;
  saveMacro(params: IMacroData, body: string): void;

  // Content Property APIs
  getContentProperty2(): Promise<IContentPropertyNormalised | undefined>;

  getCustomContent(): Promise<ICustomContent | undefined>;
  getCustomContentById(id: string): Promise<ICustomContent | undefined>;
  listCustomContentByType(type: string): Promise<Array<ICustomContentResponseBody>>;
  createCustomContent(content: Diagram): Promise<any>;
  updateCustomContent(contentObj: ICustomContent, newBody: Diagram): Promise<any>;
  saveCustomContent(customContentId: string, value: Diagram): Promise<any>;

  canUserEdit(): Promise<boolean>;

  isDisplayMode(): any;
}
import {IMacroData} from "@/model/IMacroData";
import {ICustomContent, ICustomContentV2} from "@/model/ICustomContent";
import {Diagram} from "@/model/Diagram/Diagram";
import { ICustomContentResponseBodyV2 } from "./ICustomContentResponseBody";
import { Attachment } from "./ConfluenceTypes";

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

  getCustomContent(): Promise<ICustomContent | undefined>;
  getCustomContentById(id: string): Promise<ICustomContent | undefined>;
  getCustomContentByIdV2(id: string): Promise<ICustomContentV2 | undefined>;
  searchCustomContent(): Promise<Array<ICustomContent>>;
  createCustomContent(content: Diagram): Promise<any>;
  updateCustomContent(contentObj: ICustomContent, newBody: Diagram): Promise<any>;
  saveCustomContent(customContentId: string, value: Diagram): Promise<any>;
  saveCustomContentV2(customContentId: string, value: Diagram): Promise<ICustomContentResponseBodyV2>;
  getAttachmentsV2(pageId?: string, queryParameters?: any): Promise<Array<Attachment>>;
  canUserEdit(): Promise<boolean>;

  isDisplayMode(): any;
}
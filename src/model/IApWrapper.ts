import {IMacroData} from "@/model/IMacroData";
import {IContentProperty, IContentPropertyNormalised} from "@/model/IContentProperty";
import {ICustomContent} from "@/model/ICustomContent";
import {MacroIdentifier} from "@/model/MacroIdentifier";
import {Diagram} from "@/model/Diagram";

export enum VersionType {
  Lite = 'lite',
  Full = 'full'
}

export interface IApWrapper {
  _macroIdentifier: MacroIdentifier;
  versionType: VersionType;

  isLite(): boolean;

  getMacroData(): Promise<IMacroData | undefined>;

  getMacroBody(): Promise<string | undefined>;

  getContentProperty2(): Promise<IContentPropertyNormalised | undefined>;

  getCustomContent(): Promise<ICustomContent | undefined>;

  getCustomContentById(id: string): Promise<ICustomContent | undefined>;

  getPageId(): Promise<string>;

  hasCustomContent(): boolean;

  saveCustomContent(customContentId: string, value: Diagram): Promise<any>;

  saveMacro(params: IMacroData, body: string): void;

  createCustomContent(content: Diagram): Promise<any>;

  updateCustomContent(contentObj: ICustomContent, newBody: Diagram): Promise<any>;
}
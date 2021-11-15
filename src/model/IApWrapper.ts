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
  getPageId(): Promise<string>;

  // Macro APIs
  getMacroData(): Promise<IMacroData | undefined>;
  getMacroBody(): Promise<string | undefined>;
  saveMacro(params: IMacroData, body: string): void;

  // Content Property APIs
  getContentProperty2(): Promise<IContentPropertyNormalised | undefined>;

  // Custom Content APIs
  hasCustomContent(): boolean;
  getCustomContent(): Promise<ICustomContent | undefined>;
  getCustomContentById(id: string): Promise<ICustomContent | undefined>;
  createCustomContent(content: Diagram): Promise<any>;
  updateCustomContent(contentObj: ICustomContent, newBody: Diagram): Promise<any>;
  saveCustomContent(customContentId: string, value: Diagram): Promise<any>;
}
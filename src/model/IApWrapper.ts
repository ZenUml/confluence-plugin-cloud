import {IMacroData} from "@/model/IMacroData";
import {ICustomContent} from "@/model/ICustomContent";
import {Diagram} from "@/model/Diagram/Diagram";

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
  searchCustomContent(): Promise<Array<ICustomContent>>;
  createCustomContent(content: Diagram): Promise<any>;
  updateCustomContent(contentObj: ICustomContent, newBody: Diagram): Promise<any>;
  saveCustomContent(customContentId: string, value: Diagram): Promise<any>;

  canUserEdit(): Promise<boolean>;

  isDisplayMode(): any;
}
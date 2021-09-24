import {IMacroData} from "@/model/IMacroData";
import {IContentProperty} from "@/model/IContentProperty";
import {ICustomContent} from "@/model/ICustomContent";
import {MacroIdentifier} from "@/model/MacroIdentifier";
import {Diagram} from "@/model/Diagram";

export interface IApWrapper {
  _macroIdentifier: MacroIdentifier;

  isLite(): boolean;

  getMacroData(): Promise<IMacroData | undefined>;

  getMacroBody(): Promise<string | undefined>;

  getContentProperty2(): Promise<IContentProperty | undefined>;

  getCustomContent(): Promise<ICustomContent | undefined>;

  getCustomContentById(id: string): Promise<ICustomContent | undefined>;

  getPageId(): Promise<string>;

  hasCustomContent(): boolean;

  saveCustomContent(customContentId: string | undefined, title: string, value: Diagram): Promise<any>;

  saveMacro(params: IMacroData, body: string): void;
}
import {IMacroData} from "@/utils/IMacroData";
import {IContentProperty} from "@/utils/IContentProperty";
import {ICustomContent} from "@/utils/ICustomContent";

export interface IApWrapper {
  getMacroData(): Promise<IMacroData | undefined>;

  getMacroBody(): Promise<string | undefined>;

  getContentProperty2(): Promise<IContentProperty | undefined>;

  getCustomContent(): Promise<ICustomContent | undefined>;
}
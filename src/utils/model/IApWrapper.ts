import {IMacroData} from "@/utils/model/IMacroData";
import {IContentProperty} from "@/utils/model/IContentProperty";
import {ICustomContent} from "@/utils/model/ICustomContent";

export interface IApWrapper {
  getMacroData(): Promise<IMacroData | undefined>;

  getMacroBody(): Promise<string | undefined>;

  getContentProperty2(): Promise<IContentProperty | undefined>;

  getCustomContent(): Promise<ICustomContent | undefined>;
}
import {Diagram} from "@/utils/Diagram";
import {IMacroData} from "@/utils/IMacroData";

export interface IApWrapper {
  getMacroData(): Promise<IMacroData | null>;

  getMacroBody(): Promise<string | null>;

  getContentProperty2(): Promise<Diagram>;
}
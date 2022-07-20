import {ICallback} from "@/model/ICallback";

export interface IConfluence {
  getMacroData: (callback: ICallback) => void;
  getMacroBody: (callback: ICallback) => void;
  getContentProperty: (key: string, callback: ICallback) => void;
  saveMacro: (macroData: object, macroBody: string) => void;
}
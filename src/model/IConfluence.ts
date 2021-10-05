import {ICallback} from "@/model/ICallback";
import {ContentProperty} from "@/model/ContentProperty";

export interface IConfluence {
  getMacroData: (callback: ICallback) => void;
  getMacroBody: (callback: ICallback) => void;
  getContentProperty: (key: string, callback: ICallback) => void;
  setContentProperty: (content: ContentProperty, callback: ICallback) => void;
  saveMacro: (macroData: object, macroBody: string) => void;
}
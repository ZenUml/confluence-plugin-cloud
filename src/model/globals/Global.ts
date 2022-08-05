import {IApWrapper} from "@/model/IApWrapper";
import BaseMacro2 from "@/model/BaseMacro2";

let global = {
  macro: {} as BaseMacro2,
  apWrapper: {} as IApWrapper,
};
// @ts-ignore
window.global = global;
export default global
import {IApWrapper} from "@/model/IApWrapper";
import BaseMacro2 from "@/model/BaseMacro2";

let global = {
  macro: {} as BaseMacro2,
  apWrapper: {} as IApWrapper,
};
// @ts-ignore
// global is used in jest as a global variable. So we have to use globals.
window.globals = global;
export default global
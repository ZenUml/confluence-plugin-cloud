import {IApWrapper} from "@/model/IApWrapper";

let global = {
  apWrapper: {} as IApWrapper,
};
// @ts-ignore
// global is used in jest as a global variable. So we have to use globals.
window.globals = global;
export default global
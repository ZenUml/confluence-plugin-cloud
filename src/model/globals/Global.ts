import {IApWrapper} from "@/model/IApWrapper";
import AP, {isEmbedded} from "@/model/AP";
import ApWrapper2 from "@/model/ApWrapper2";

const global = {
  apWrapper: new ApWrapper2(AP) as IApWrapper,
  isEmbedded: isEmbedded,
};

// @ts-ignore
// global is used in jest as a global variable. So we have to use globals.
window.globals = global;
export default global
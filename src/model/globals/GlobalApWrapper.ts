import global from './Global';
import AP, {isEmbedded} from "@/model/AP";
import ApWrapper2 from "@/model/ApWrapper2";

global.apWrapper = new ApWrapper2(AP);
global.isEmbedded = isEmbedded;
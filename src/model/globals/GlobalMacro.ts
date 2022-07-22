import global from './Global';
import AP from "@/model/AP";
import ApWrapper2 from "@/model/ApWrapper2";
import Macro from "@/model/Macro";

global.macro = new Macro(new ApWrapper2(AP));

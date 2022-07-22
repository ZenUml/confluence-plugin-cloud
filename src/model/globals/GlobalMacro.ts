import global from './Global';
import './GlobalApWrapper';
import Macro from "@/model/Macro";

global.macro = new Macro(global.apWrapper);

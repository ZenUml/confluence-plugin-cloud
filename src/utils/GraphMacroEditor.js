import {compress} from './compress';
import GraphMacroViewer from "@/utils/GraphMacroViewer";

class GraphMacroEditor extends GraphMacroViewer {

  async save(code) {
    const compressedCode = compress(code);
    return super.save({graphXml: compressedCode, compressed: true});
  }
}

export default GraphMacroEditor
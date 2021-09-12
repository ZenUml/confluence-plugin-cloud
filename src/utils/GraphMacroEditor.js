import {compress} from './compress';
import GraphMacro from "@/model/GraphMacro";

class GraphMacroEditor extends GraphMacro {

  async save(code) {
    const compressedCode = compress(code);
    return super.save({graphXml: compressedCode, compressed: true});
  }
}

export default GraphMacroEditor
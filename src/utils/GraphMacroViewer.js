import {decompress} from './compress';
import BaseMacro2 from "@/model/BaseMacro2";

class GraphMacroViewer extends BaseMacro2 {

  async load() {
    const result = await super.load();
    if(result.compressed) {
      result.graphXml = decompress(result.graphXml);
    }

    return result;
  }
}

export default GraphMacroViewer
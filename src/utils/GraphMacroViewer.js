import LZUTF8 from 'lzutf8';
import ConfluenceWrapper from "@/utils/ConfluenceWrapper";

const COMPRESS_ENCODING = 'Base64';

class GraphMacroViewer {
  _key;
  _versionNumber;
  _loaded = false;
  _macroKeyPrefix = `zenuml-graph-macro`;

  // eslint-disable-next-line
  constructor(confluence = AP.confluence) {
    this._confluenceWrapper = new ConfluenceWrapper(confluence);
  }

  propertyKey(uuid) {
    return `${this._macroKeyPrefix}-${uuid}-body`;
  }

  async getContentProperty() {
    const macroData = await this._confluenceWrapper.getMacroData();
    console.debug('macro data loaded:', macroData);
    const key = macroData?.uuid;
    this._key = key;
    if (!key) {
      console.warn('macro key (uuid) is not available in macro data (parameters).')
    } else {
      return this._confluenceWrapper.getContentProperty(this.propertyKey(key));
    }
  }

  async load() {
    this._loaded = true
    const contentProp = await this.getContentProperty();
    let code;
    let graphXml;
    let compressed;
    this._versionNumber = contentProp?.version?.number || 0;
    if(typeof contentProp?.value === 'string') {
      console.error('ERR-300: The value in content property is of a wrong type.')
    } else {
      graphXml = contentProp?.value?.graphXml
      compressed = contentProp?.value?.compressed
      if(compressed) {
        graphXml = LZUTF8.decompress(graphXml, {inputEncoding: COMPRESS_ENCODING});
      }
    }
    code = code || await this._confluenceWrapper.getMacroBody();

    if(graphXml !== code) {
      console.warn('WARN-301: The content stored in macro body and in content property are different.')
    }
    return {graphXml};
  }
}

export default GraphMacroViewer
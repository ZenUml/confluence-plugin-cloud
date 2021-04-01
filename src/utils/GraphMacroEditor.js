import uuidv4 from './uuid';
import LZUTF8 from 'lzutf8';
import GraphMacroViewer from "@/utils/GraphMacroViewer";

const COMPRESS_ENCODING = 'Base64';

class GraphMacroEditor extends GraphMacroViewer{

  // Warning! Do not call getXXX in save. Do retest if you want to call getXXX.
  // It does not work as of 17th May 2020. That is why we have stored key and version
  async save(code) {
    if (!this._loaded) {
      throw new Error('You have to call load before calling save()')
    }
    const key = this._key || uuidv4()
    this._confluenceWrapper.saveMacro({uuid: key, updatedAt: new Date()}, code);
    const versionNumber = this._versionNumber;

    const compressedCode = LZUTF8.compress(code, {outputEncoding: COMPRESS_ENCODING});

    const value = {graphXml: compressedCode, compressed: true};

    const contentProperty = {
      key: this.propertyKey(key),
      value: value,
      version: {
        number: versionNumber ? versionNumber + 1 : 1
      }
    }
    await this._confluenceWrapper.setContentProperty(contentProperty);
  }
}

export default GraphMacroEditor
import uuidv4 from './uuid';
import LZUTF8 from 'lzutf8';
import ConfluenceWrapper from "@/utils/ConfluenceWrapper";

const COMPRESS_ENCODING = 'Base64';
const CUSTOM_CONTENT_TYPE = 'ac:com.zenuml.confluence-addon:zenuml-sequence-diagram';

class Macro {
  EXAMPLE = `@Lambda OrderController
<<BFF>> OrderService
group BusinessService {
  PurchaseService
  InvoiceService
}
//\`POST /orders\`
OrderController.create(payload) {
  OrderService.create(payload) {
    order = new Order(payload)
    par {
      PurchaseService.createPO(order)
      InvoiceService.createInvoice(order)      
    }
  }
}`
  _key;
  _versionNumber;
  _loaded = false;
  _macroIdentifier;

  // eslint-disable-next-line
  constructor(ap = AP, macroIdentifier = 'sequence') {
    this._confluenceWrapper = new ConfluenceWrapper(ap);
    this._macroIdentifier = macroIdentifier;
  }

  propertyKey(uuid) {
    const macroKey = `zenuml-${this._macroIdentifier}-macro`;
    return `${macroKey}-${uuid}-body`;
  }

  getUrlParam (param) {
    const matches = (new RegExp(param + '=([^&]*)')).exec(window.location.search);
    return matches && matches[1] && decodeURIComponent(matches[1]);
  }

  getSpaceKey() {
    return this.getUrlParam('spaceKey');
  }

  async getContentProperty() {
    const macroData = await this._confluenceWrapper.getMacroData();

    // When the macro is edited for the first time, macro data is not available in the preview mode
    // Fall back to the uuid parameter in the URL.
    // This is defined in the descriptor and is only available for sequence-viewer.html.
    const key = macroData?.uuid || this.getUrlParam('uuid');
    this._key = key;
    return key ? await this._confluenceWrapper.getContentProperty(this.propertyKey(key)) : null;
  }


  async load() {
    this._loaded = true
    const contentProp = await this.getContentProperty();
    let code;
    let styles;
    let mermaidCode;
    let diagramType;
    let graphXml;
    let compressed;
    this._versionNumber = contentProp?.version?.number || 0;
    if(typeof contentProp?.value === 'string') {
      code = contentProp?.value
    } else {
      code = contentProp?.value?.code
      styles = contentProp?.value?.styles
      mermaidCode = contentProp?.value?.mermaidCode
      diagramType = contentProp?.value?.diagramType
      graphXml = contentProp?.value?.graphXml
      compressed = contentProp?.value?.compressed
    }
    code = code || await this._confluenceWrapper.getMacroBody();

    if(!mermaidCode && !code) {
      code = this.EXAMPLE;
    }

    styles = styles || {}

    if(compressed) {
      graphXml = LZUTF8.decompress(graphXml, {inputEncoding: COMPRESS_ENCODING});
    }
    console.debug('Loaded macro', code, styles, mermaidCode, diagramType);
    return {code, styles, mermaidCode, diagramType, graphXml};
  }

  // Warning! Do not call getXXX in save. Do retest if you want to call getXXX.
  // It does not work as of 17th May 2020. That is why we have stored key and version
  async save(code, styles, mermaidCode, diagramType) {
    console.debug('Saving macro', code, styles, mermaidCode, diagramType);
    if (!this._loaded) {
      throw new Error('You have to call load before calling save()')
    }
    const key = this._key || uuidv4()
    this._confluenceWrapper.saveMacro({uuid: key, updatedAt: new Date()}, code);
    const versionNumber = this._versionNumber;

    const compressedCode = LZUTF8.compress(code, {outputEncoding: COMPRESS_ENCODING});

    const value = this._macroIdentifier === 'graph' ?
      {graphXml: compressedCode, compressed: true} : {code, styles, mermaidCode, diagramType};

    const contentProperty = {
      key: this.propertyKey(key),
      value: value,
      version: {
        number: versionNumber ? versionNumber + 1 : 1
      }
    }
    await this._confluenceWrapper.setContentProperty(contentProperty);

    await this._confluenceWrapper.createCustomContent(CUSTOM_CONTENT_TYPE, this.getSpaceKey(), value);
  }
}

export default Macro
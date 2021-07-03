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
  _customContentId;
  _versionNumber;
  _loaded = false;
  _macroIdentifier;
  _pageId;

  // eslint-disable-next-line
  constructor(ap = AP, macroIdentifier = 'sequence') {
    this._confluenceWrapper = new ConfluenceWrapper(ap);
    this._macroIdentifier = macroIdentifier;
  }

  async initPageId() {
    if(!this._pageId) {
      this._pageId = await this._confluenceWrapper.getPageId();
    }
  }

  propertyKey(uuid) {
    const macroKey = `zenuml-${this._macroIdentifier}-macro`;
    return `${macroKey}-${uuid}-body`;
  }

  getUrlParam (param) {
    const matches = (new RegExp(param + '=([^&]*)')).exec(window.location.search);
    return matches && matches[1] && decodeURIComponent(matches[1]);
  }

  async getContent() {
    const macroData = await this._confluenceWrapper.getMacroData();

    // When the macro is edited for the first time, macro data is not available in the preview mode
    // Fall back to the uuid parameter in the URL.
    // This is defined in the descriptor and is only available for sequence-viewer.html.
    const key = macroData?.uuid || this.getUrlParam('uuid');
    this._key = key;
    this._customContentId = macroData.customContentId;
    
    if(this._customContentId) {
      this.fireEvent('load_macro', 'custom_content');
      return await this._confluenceWrapper.getCustomContentById(this._customContentId);
    }

    return key ? await this.getContentProperty(key) : null;
  }

  async getContentProperty(key) {
    this.fireEvent('load_macro', 'content_property');
    return await this._confluenceWrapper.getContentProperty(this.propertyKey(key));
  }

  async getMacroBody() {
    this.fireEvent('load_macro', 'macro_body');
    return await this._confluenceWrapper.getMacroBody();
  }

  fireEvent(event, category) {
    /* eslint-disable no-undef */
    gtag('event', event, {'event_category': category, 'event_label' : this._pageId});
  }

  async load() {
    await this.initPageId();

    const payload = await this.getContent();
    let code;
    let styles;
    let mermaidCode;
    let diagramType;
    let graphXml;
    let compressed;
    this._versionNumber = payload?.version?.number || 0;
    if(typeof payload?.value === 'string') {
      code = payload?.value
    } else {
      code = payload?.value?.code
      styles = payload?.value?.styles
      mermaidCode = payload?.value?.mermaidCode
      diagramType = payload?.value?.diagramType
      graphXml = payload?.value?.graphXml
      compressed = payload?.value?.compressed
    }
    code = code || await this.getMacroBody();

    if(!mermaidCode && !code) {
      this.fireEvent('load_macro', 'default_example');
      code = this.EXAMPLE;
    }

    styles = styles || {}

    if(compressed) {
      graphXml = LZUTF8.decompress(graphXml, {inputEncoding: COMPRESS_ENCODING});
    }

    this._loaded = true;
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
    const key = this._key || uuidv4();

    const compressedCode = LZUTF8.compress(code, {outputEncoding: COMPRESS_ENCODING});

    const value = this._macroIdentifier === 'graph' ?
      {graphXml: compressedCode, compressed: true} : {code, styles, mermaidCode, diagramType};

    const customContent = await this._confluenceWrapper.saveCustomContent(this._customContentId, key, CUSTOM_CONTENT_TYPE, value);
    this.fireEvent('save_macro', 'custom_content');

    this._confluenceWrapper.saveMacro({uuid: key, customContentId: customContent.id, updatedAt: new Date()}, code);
    this.fireEvent('save_macro', 'macro_body');
    const versionNumber = this._versionNumber;

    const contentProperty = {
      key: this.propertyKey(key),
      value: value,
      version: {
        number: versionNumber ? versionNumber + 1 : 1
      }
    }
    await this._confluenceWrapper.setContentProperty(contentProperty);
    this.fireEvent('save_macro', 'content_property');

  }
}

export default Macro
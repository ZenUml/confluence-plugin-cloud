import uuidv4 from './uuid';
import { getUrlParam, trackEvent } from './window';
import ConfluenceWrapper from "@/utils/ConfluenceWrapper";

class BaseMacro {
  _key;
  _customContentId;
  _versionNumber;
  _loaded = false;
  _macroIdentifier;
  _pageId;
  _standaloneCustomContent;

  constructor(ap, macroIdentifier) {
    this._confluenceWrapper = new ConfluenceWrapper(ap);
    this._macroIdentifier = macroIdentifier;
  }

  async initPageId() {
    if(!this._pageId) {
      this._customContentId = getUrlParam('content.id');
      console.debug('custom content id: ', this._customContentId);
      this._standaloneCustomContent = !!this._customContentId;
      this._pageId = this._customContentId || (await this._confluenceWrapper.getPageId());
    }
  }

  propertyKey(uuid) {
    const macroKey = `zenuml-${this._macroIdentifier}-macro`;
    return `${macroKey}-${uuid}-body`;
  }

  async getCustomContent() {
    trackEvent(this._pageId, 'load_macro', 'custom_content');
    return await this._confluenceWrapper.getCustomContentById(this._customContentId);
  }

  async getContentProperty(key) {
    trackEvent(this._pageId, 'load_macro', 'content_property');
    return await this._confluenceWrapper.getContentProperty(this.propertyKey(key));
  }

  async getMacroBody() {
    if(this._standaloneCustomContent) {
      return;
    }
    
    trackEvent(this._pageId, 'load_macro', 'macro_body');
    return await this._confluenceWrapper.getMacroBody();
  }

  async getContent() {
    if(this._customContentId) {
      return await this.getCustomContent();
    }

    const macroData = await this._confluenceWrapper.getMacroData();
    console.debug('macro data loaded:', macroData);

    // When the macro is edited for the first time, macro data is not available in the preview mode
    // Fall back to the uuid parameter in the URL.
    // This is defined in the descriptor and is only available for sequence-viewer.html.
    const key = macroData?.uuid || getUrlParam('uuid');
    this._key = key;
    this._customContentId = macroData.customContentId;
    
    if(this._customContentId) {
      return await this.getCustomContent();
    }

    return key ? await this.getContentProperty(key) : null;
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

    styles = styles || {}

    this._loaded = true;
    const result = {code, styles, mermaidCode, diagramType, graphXml, compressed};

    console.debug('Loaded macro', result);
    return result;
  }

  // Warning! Do not call getXXX in save. Do retest if you want to call getXXX.
  // It does not work as of 17th May 2020. That is why we have stored key and version
  async save(value) {
    console.debug('Saving macro', value);
    if (!this._loaded) {
      throw new Error('You have to call load before calling save()')
    }
    const key = this._key || uuidv4();

    const customContent = await this._confluenceWrapper.saveCustomContent(this._customContentId, key, value);
    trackEvent(this._pageId, 'save_macro', 'custom_content');

    this._confluenceWrapper.saveMacro({uuid: key, customContentId: customContent.id, updatedAt: new Date()}, value.code);
    trackEvent(this._pageId, 'save_macro', 'macro_body');
    const versionNumber = this._versionNumber;

    const contentProperty = {
      key: this.propertyKey(key),
      value: value,
      version: {
        number: versionNumber ? versionNumber + 1 : 1
      }
    }
    await this._confluenceWrapper.setContentProperty(contentProperty);
    trackEvent(this._pageId, 'save_macro', 'content_property');

  }
}

export default BaseMacro
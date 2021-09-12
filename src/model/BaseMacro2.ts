import uuidv4 from '../utils/uuid';
import { getUrlParam, trackEvent } from '@/utils/window';
import ApWrapper2 from "./ApWrapper2";
import {IAp} from "@/model/IAp";
import {IApWrapper} from "@/model/IApWrapper";
import {IContentProperty} from "@/model/IContentProperty";
import {ICustomContent} from "@/model/ICustomContent";
import {IMacroData} from "@/model/IMacroData";
import {MacroIdentifier} from "@/model/MacroIdentifier";

class BaseMacro2 {
  _key: any;
  _customContentId: string | undefined;
  _loaded = false;
  _macroIdentifier: any;
  _pageId: any;
  _standaloneCustomContent: boolean;
  private _confluenceWrapper: IApWrapper;

  constructor(ap: IAp) {
    this._confluenceWrapper = new ApWrapper2(ap);
    this._macroIdentifier = this._confluenceWrapper._macroIdentifier;
    this._standaloneCustomContent = getUrlParam('rendered.for') === 'custom-content-native';
  }

  async initPageId() {
    if(!this._pageId) {
      this._pageId = getUrlParam('content.id') || (await this._confluenceWrapper.getPageId());
    }
  }

  propertyKey(uuid: string) {
    const macroKey = `zenuml-${this._macroIdentifier}-macro`;
    return `${macroKey}-${uuid}-body`;
  }

  async getCustomContent() {
    trackEvent(this._pageId, 'load_macro', 'custom_content');
    if(this._customContentId) {
      return await this._confluenceWrapper.getCustomContentById(this._customContentId);
    }
  }

  async getContentProperty(key: string) {
    trackEvent(this._pageId, 'load_macro', 'content_property');
    return await this._confluenceWrapper.getContentProperty2();
  }

  async getMacroBody() {
    if(this._standaloneCustomContent) {
      return;
    }
    
    trackEvent(this._pageId, 'load_macro', 'macro_body');
    return await this._confluenceWrapper.getMacroBody();
  }

  async getContent(): Promise<IContentProperty | ICustomContent | undefined> {
    if(this._standaloneCustomContent) {
      console.debug('rendering for custom content native viewer.');
      // @ts-ignore
      this._customContentId = getUrlParam('content.id');
      console.debug('custom content id:', this._customContentId);
      return await this.getCustomContent();
    }
    const macroData = await this._confluenceWrapper.getMacroData();
    console.debug('macro data loaded:', macroData);

    // When the macro is edited for the first time, macro data is not available in the preview mode
    // Fall back to the uuid parameter in the URL.
    // This is defined in the descriptor and is only available for sequence-viewer.html.
    const key = macroData?.uuid || getUrlParam('uuid');
    this._key = key;
    this._customContentId = macroData?.customContentId;
    
    if(this._customContentId) {
      return await this.getCustomContent();
    }

    return key ? await this.getContentProperty(key) : undefined;
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
    // only for very old version
    if(typeof payload?.value === 'string') {
      code = payload?.value
    } else {
      const contentProp = payload as IContentProperty;
      code = contentProp?.value?.code
      styles = contentProp?.value.styles
      mermaidCode = contentProp?.value?.mermaidCode
      diagramType = contentProp?.value?.diagramType
      graphXml = contentProp?.value?.graphXml
      compressed = contentProp?.value?.compressed
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
  async save(value: object) {
    console.debug('Saving macro', value);
    if (!this._loaded) {
      throw new Error('You have to call load before calling save()')
    }
    const key = this._key || uuidv4();
    const macroParam = {uuid: key, updatedAt: new Date()} as IMacroData;

    //make sure it's compatible with old descriptor
    if(this._confluenceWrapper.hasCustomContent() && this._customContentId) {
      const customContent = await this._confluenceWrapper.saveCustomContent(this._customContentId, key, value);
      trackEvent(this._pageId, 'save_macro', 'custom_content');
      macroParam.customContentId = customContent.id;
    }

    //TODO: Edit issue when editing content property based macro in viewer
    // @ts-ignore
    this._confluenceWrapper.saveMacro(macroParam, value.code);
    trackEvent(this._pageId, 'save_macro', 'macro_body');
  }
}

export default BaseMacro2
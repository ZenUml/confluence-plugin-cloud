import {getUrlParam} from './window';
import {Diagram} from "@/utils/Diagram";

// Each iFrame provides context for only one macro.
// getMacroData returns the macro data for the CURRENT macro.
// ApWrapper2 converts callback to Promise and also encapsulates
interface Confluence {
  getMacroData: (arg0: (data: any) => void) => void;
  getMacroBody: (arg0: (body: any) => void) => void;
  getContentProperty: (arg0: any, arg1: (cp: any) => void) => void;
  setContentProperty: (arg0: any, arg1: (result: any) => void) => void;
  saveMacro: (arg0: any, arg1: any) => void;
}

interface ApRequestFunc {
  (arg0: { url: string; type: string; contentType?: string; data?: string; }): any
}

interface AP {
  confluence: Confluence;
  request: ApRequestFunc;
  navigator: any;
  dialog: any;
}

interface MacroData {
  uuid: string
}

interface ContentProperty {
  value: { code: string }
}

interface ContentPropertyIn {
}

interface MacroParams {
}

// custom content APIs.
export default class ApWrapper2 {
  _confluence: Confluence;
  _request: ApRequestFunc;
  _navigator: any;
  _dialog: any;
  _macroIdentifier: string;

  constructor(ap: AP, macroIdentifier: string) {
    this._macroIdentifier = macroIdentifier;
    this._confluence = ap.confluence;
    this._request = ap.request;
    this._navigator = ap.navigator;
    this._dialog = ap.dialog;
  }

  getMacroData(): Promise<MacroData|null> {
    return new Promise(((resolve) => {
      try {
        this._confluence.getMacroData((data) => {
          resolve(data)
          console.debug('Loaded macro data:', data)
        })
      } catch (e) {
        // eslint-disable-next-line
        console.error('Failed to retrieve macro data.', e)
        resolve(null)
      }
    }))
  }

  //FIXME: this method throws error in custom content viewer
  getMacroBody(): Promise<string|null> {
    return new Promise((resolve) => {
      try {
        this._confluence.getMacroBody((body) => {
          resolve(body)
        })
      } catch (e) {
        // eslint-disable-next-line
        console.error('Failed to retrieve macro body.', e)
        resolve(null)
      }
    })
  }

  propertyKey(uuid: string) {
    const macroKey = `zenuml-${this._macroIdentifier}-macro`;
    return `${macroKey}-${uuid}-body`;
  }

  async getContentProperty2(): Promise<Diagram> {
    let macroData = await this.getMacroData();
    const uuid = macroData?.uuid;
    if(!uuid) {
      throw '`uuid` is empty. This diagram was not properly saved.'
    }
    let key = this.propertyKey(uuid);
    let property = await this.getContentProperty(key);
    if(!property) {
      throw 'property is not find with key:' + key;
    }
    let {value} = property;
    return {code: value.code};
  }

  getContentProperty(key: any): Promise<ContentProperty|null> {
    return new Promise(resolve => {
      try {
        this._confluence.getContentProperty(key, (cp) => {
          resolve(cp)
        })
      } catch (e) {
        // eslint-disable-next-line
        console.error('Failed to retrieve content property.', e)
        resolve(null)
      }
    })
  }

  async setContentProperty(content: ContentPropertyIn) {
    return new Promise((resolve, reject) => {
      this._confluence.setContentProperty(content, (result) => {
        if(result.error) {
          // eslint-disable-next-line
          console.error('Failed to update content property.', result.error)
          reject(result.error)
        } else {
          resolve(true)
        }
      })
    })
  }

  saveMacro(params: MacroParams, body: string) {
    this._confluence.saveMacro(params, body)
  }

  getSpaceKey() { //TODO: cacheable
    const navigator = this._navigator;
    return new Promise((resolv) => {
      navigator.getLocation((data: any) => {
        resolv(data.context.spaceKey);
      });
    });
  }

  getPageId() { //TODO: cacheable
    const navigator = this._navigator;
    return new Promise((resolve) => {
      navigator.getLocation((data: { context: { contentId: unknown; }; }) => {
        resolve(data.context.contentId);
      });
    });
  }

  getContentKey() {
    return getUrlParam('contentKey');
  }

  hasCustomContent() {
    return !!(this.getContentKey());
  }

  getCustomContentType() {
    return `ac:${getUrlParam('addonKey')}:${this.getContentKey()}`;
  }

  parseCustomContentResponse(response: { body: string; }) {
    return response && response.body && JSON.parse(response.body);
  }

  async createCustomContent(uuid: string, content: object) {
    const spaceKey = await this.getSpaceKey(); //TODO: cacheable
    const type = this.getCustomContentType();
    const bodyData = {
      "type": type,
      "title": uuid,
      "space": {
        "key": spaceKey
      },
      "body": {
        "raw": {
          "value": JSON.stringify(content),
          "representation": "raw"
        }
      }
    };

    const response = await this._request({
      url: '/rest/api/content',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(bodyData)
    });
    return this.parseCustomContentResponse(response);
  }

  async updateCustomContent(contentObj: { type: any; title: any; version: { number: number; }; id: any; }, newBody: any) {
    const spaceKey = await this.getSpaceKey();
    const bodyData = {
      "type": contentObj.type,
      "title": contentObj.title,
      "space": {
        "key": spaceKey
      },
      "body": {
        "raw": {
          "value": JSON.stringify(newBody),
          "representation": "raw"
        }
      },
      "version": {
        "number": contentObj.version.number + 1
      }
    };

    const response = await this._request({
      url: `/rest/api/content/${contentObj.id}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(bodyData)
    });
    return this.parseCustomContentResponse(response);
  }

  async getCustomContentByTitle(type: any, title: any) {
    const spaceKey = await this.getSpaceKey();
    const url = `/rest/api/content?type=${type}&title=${title}&spaceKey=${spaceKey}&expand=children,history,version.number`;
    const results = JSON.parse((await this._request({type: 'GET', url})).body).results;
    if(results.length > 1) {
      throw `multiple results found with type ${type}, title ${title}`;
    }
    if(results.length === 1) {
      return results[0];
    }
    return null;
  }

  async getCustomContentById(id: string) {
    const url = `/rest/api/content/${id}?expand=body.raw,version.number`;
    const response = await this._request({type: 'GET', url});
    const customContent = this.parseCustomContentResponse(response);
    return Object.assign({}, customContent, {value: JSON.parse(customContent.body.raw.value)});
  }

  async saveCustomContent(customContentId: string, uuid: string, value: object) {
    if(customContentId) {
      const existing = await this.getCustomContentById(customContentId);
      return await this.updateCustomContent(existing, value);
    } else {
      return await this.createCustomContent(uuid, value);
    }
  }

  getDialogCustomData() {
    const dialog = this._dialog;
    return new Promise((resolv) => {
      try {
        dialog.getCustomData((data: unknown) => {
          // eslint-disable-next-line
          console.log('custom data:', data);
          resolv(data);
        });
      } catch(e) {
        // eslint-disable-next-line
        console.error('error getting custom data:', e);
        resolv();
      }
    });
  }

  isDisplayMode() {
    return getUrlParam('outputType') === 'display';
  }
}

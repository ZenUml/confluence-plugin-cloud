import {getUrlParam} from './window';
import {IApWrapper} from "@/utils/IApWrapper";
import {IMacroData} from "@/utils/IMacroData";
import {IContentProperty} from "@/utils/IContentProperty";
import {ICustomContent} from "@/utils/ICustomContent";

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
  (arg0: { url: string; type: string; contentType?: string; data?: string; success?: any; error?: any }): any
}

interface AP {
  confluence: Confluence;
  request: ApRequestFunc;
  navigator: any;
  dialog: any;
  user: any;
}

interface ContentPropertyIn {
}

interface MacroParams {
}

// custom content APIs.
export default class ApWrapper2 implements IApWrapper {
  _confluence: Confluence;
  _request: ApRequestFunc;
  _navigator: any;
  _dialog: any;
  _macroIdentifier: string;
  _user: any;

  constructor(ap: AP, macroIdentifier: string) {
    this._macroIdentifier = macroIdentifier;
    this._confluence = ap.confluence;
    this._request = ap.request;
    this._navigator = ap.navigator;
    this._dialog = ap.dialog;
    this._user = ap.user;
  }

  getMacroData(): Promise<IMacroData | undefined> {
    return new Promise(((resolve) => {
      try {
        this._confluence.getMacroData((data) => {
          resolve(data)
          console.debug('Loaded macro data:', data)
        })
      } catch (e) {
        // eslint-disable-next-line
        console.error('Failed to retrieve macro data.', e)
        resolve(undefined)
      }
    }))
  }

  //FIXME: this method throws error in custom content viewer
  getMacroBody(): Promise<string | undefined> {
    return new Promise((resolve) => {
      try {
        this._confluence.getMacroBody((body) => {
          resolve(body)
        })
      } catch (e) {
        // eslint-disable-next-line
        console.error('Failed to retrieve macro body.', e)
        resolve(undefined)
      }
    })
  }

  propertyKey(uuid: string) {
    const macroKey = `zenuml-${this._macroIdentifier}-macro`;
    return `${macroKey}-${uuid}-body`;
  }

  async getContentProperty2(): Promise<IContentProperty | undefined> {
    let macroData = await this.getMacroData();
    const uuid = macroData?.uuid;
    if (!uuid) {
      console.debug('`uuid` is empty. This diagram has not been initialised. Most likely it has not been edited.')
      return undefined;
    }
    let key = this.propertyKey(uuid);
    let property = await this.getContentProperty(key);
    if (!property) {
      throw 'property is not find with key:' + key;
    }
    return property;
  }

  getContentProperty(key: any): Promise<IContentProperty|null> {
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

  async updateCustomContent(contentObj: ICustomContent, newBody: any) {
    const spaceKey = await this.getSpaceKey();
    let newVersionNumber = 1;

    if(contentObj.version?.number) {
      newVersionNumber += contentObj.version?.number
    }
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
        "number": newVersionNumber
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

  async getCustomContentById(id: string): Promise<ICustomContent|undefined> {
    const url = `/rest/api/content/${id}?expand=body.raw,version.number`;
    const response = await this._request({type: 'GET', url});
    const customContent = this.parseCustomContentResponse(response);
    console.debug(`Loaded custom content by id ${id}.`);
    return Object.assign({}, customContent, {value: JSON.parse(customContent.body.raw.value)});
  }

  async saveCustomContent(customContentId: string, uuid: string, value: object) {
    if(customContentId) {
      const existing = await this.getCustomContentById(customContentId);
      if(existing) {
        return await this.updateCustomContent(existing, value);
      } else {
        return await this.createCustomContent(uuid, value);
      }
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

  async getCustomContent(): Promise<ICustomContent | undefined> {
    const macroData = await this.getMacroData();
    if(macroData && macroData.customContentId) {
      return this.getCustomContentById(macroData.customContentId);
    }
    return undefined;
  }

  
  getCurrentUser() {
    return new Promise(resolv => this._user.getCurrentUser((user: any) => resolv(user)));
  }

  canUserEdit() {
    return new Promise(resolv =>
      Promise.all([
        this.getPageId(),
        this.getCurrentUser()
      ]).then(([pageId, user]) => 
        this._request({
          type: 'GET',
          url: `/rest/api/content/${pageId}/restriction/byOperation/update/user?accountId=${(user as any).atlassianAccountId}`,
          contentType: 'application/json;charset=UTF-8',
          success: () => resolv(true),
          error: () => resolv(false)
        })
      )
    );
  }
}

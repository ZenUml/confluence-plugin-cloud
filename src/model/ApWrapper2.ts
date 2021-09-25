import {getUrlParam} from '@/utils/window';
import {IApWrapper, VersionType} from "@/model/IApWrapper";
import {IMacroData} from "@/model/IMacroData";
import {IContentProperty} from "@/model/IContentProperty";
import {ICustomContent} from "@/model/ICustomContent";
import {IUser} from "@/model/IUser";
import {IConfluence} from "@/model/IConfluence";
import {IAp} from "@/model/IAp";
import {MacroIdentifier} from "@/model/MacroIdentifier";
import {DataSource, Diagram, DiagramType} from "@/model/Diagram";

interface ContentPropertyIn {
}

interface ILocationContext {
  spaceKey: string;
  contentType: string;
  contentId: string;
}

// custom content APIs.
export default class ApWrapper2 implements IApWrapper {
  versionType: VersionType;
  _confluence: IConfluence;
  _requestFn: {
    (req: IApRequest): any
  };
  _navigator: any;
  _dialog: any;
  public _macroIdentifier: MacroIdentifier;
  _locationContext: any;
  _user: any;

  constructor(ap: IAp) {
    this.versionType = this.isLite() ? VersionType.Lite : VersionType.Full;
    let macroIdentifier: MacroIdentifier;
    const contentKey = getUrlParam('contentKey');
    if (!contentKey) {
      console.error('contentKey URL parameter must be provided. It can be `sequence` or `graph`.')
    }
    if (contentKey?.includes('sequence')) {
      macroIdentifier = MacroIdentifier.Sequence;
    } else if (contentKey?.includes('graph')) {
      macroIdentifier = MacroIdentifier.Graph
    } else {
      console.error('Wrong value in contentKey URL parameter. Fall back to `sequence`.')
      macroIdentifier = MacroIdentifier.Sequence;
    }

    this._macroIdentifier = macroIdentifier;
    this._confluence = ap.confluence;
    this._requestFn = ap.request;
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
      let message = 'property is not find with key:' + key;
      console.error(message);
      throw {
        message: message,
        data: macroData
      }
    }
    if(typeof property.value === "object") {
      property.value.source = DataSource.ContentProperty;
    }
    return property;
  }

  getContentProperty(key: any): Promise<IContentProperty|undefined> {
    return new Promise(resolve => {
      try {
        this._confluence.getContentProperty(key, (cp) => {
          resolve(cp)
        })
      } catch (e) {
        // eslint-disable-next-line
        console.error('Failed to retrieve content property.', e)
        resolve(undefined)
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

  saveMacro(params: IMacroData, body: string) {
    this._confluence.saveMacro(params, body)
  }

  getLocationContext(): Promise<ILocationContext> {
    if(this._locationContext) {
      return Promise.resolve(this._locationContext);
    }

    const self = this;

    return new Promise((resolve) => {
      self._navigator.getLocation((data: any) => {
        self._locationContext = data.context;
        resolve(data.context);
      });
    });
  }

  async getSpaceKey() {
    const locationContext = await this.getLocationContext();
    return (locationContext.spaceKey);
  }

  async getPageId() {
    // @ts-ignore
    const locationContext = await this.getLocationContext();
    return (locationContext.contentId);
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

  async createCustomContent(title: string, content: Diagram) {
    const context = await this.getLocationContext();
    const type = this.getCustomContentType();
    const container = {id: context.contentId, type: context.contentType};
    const bodyData = {
      "type": type,
      "title": title,
      "space": {
        "key": context.spaceKey
      },
      "container": container,
      "body": {
        "raw": {
          "value": JSON.stringify(content),
          "representation": "raw"
        }
      }
    };

    const response = await this._requestFn({
      url: '/rest/api/content',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(bodyData)
    });
    return this.parseCustomContentResponse(response);
  }

  async updateCustomContent(contentObj: ICustomContent, newBody: Diagram) {
    let newVersionNumber = 1;

    if (contentObj.version?.number) {
      newVersionNumber += contentObj.version?.number
    }
    const bodyData = {
      "type": contentObj.type,
      "title": contentObj.title,
      "space": {
        "key": contentObj.space.key
      },
      "container": contentObj.container,
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

    const response = await this._requestFn({
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
    const results = JSON.parse((await this._requestFn({type: 'GET', url})).body).results;
    if(results.length > 1) {
      throw `multiple results found with type ${type}, title ${title}`;
    }
    if(results.length === 1) {
      return results[0];
    }
    return null;
  }

  async getCustomContentById(id: string): Promise<ICustomContent | undefined> {
    const url = `/rest/api/content/${id}?expand=body.raw,version.number,container,space`;
    const response = await this._requestFn({type: 'GET', url});
    const customContent = this.parseCustomContentResponse(response);
    console.debug(`Loaded custom content by id ${id}.`);
    let diagram = JSON.parse(customContent.body.raw.value);
    if(typeof diagram === "string") {
      diagram = {
        code: diagram,
        diagramType: DiagramType.Sequence
      }
    }
    diagram.source = DataSource.CustomContent;
    return Object.assign({}, customContent, {value: diagram});
  }

  async saveCustomContent(customContentId: string, title: string, value: Diagram) {
    let result;
    // TODO: Do we really need to check whether it exists?
    const existing = await this.getCustomContentById(customContentId);
    if (existing) {
      result = await this.updateCustomContent(existing, value);
    } else {
      result = await this.createCustomContent(title, value);
    }
    return result
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


  _getCurrentUser(): Promise<IUser> {
    return new Promise(resolv => this._user.getCurrentUser((user: IUser) => resolv(user)));
  }

  canUserEdit() {
    return new Promise(resolv =>
      Promise.all([
        this.getPageId(),
        this._getCurrentUser()
      ]).then(([pageId, user]) => 
        this._requestFn({
          type: 'GET',
          url: `/rest/api/content/${pageId}/restriction/byOperation/update/user?accountId=${user.atlassianAccountId}`,
          contentType: 'application/json;charset=UTF-8',
          success: () => resolv(true),
          error: () => resolv(false)
        })
      )
    );
  }

  isLite(): boolean {
    // @ts-ignore
    return getUrlParam('addonKey')?.includes('lite');
  }
}

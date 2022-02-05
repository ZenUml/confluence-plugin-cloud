import {getUrlParam, trackEvent} from '@/utils/window';
import {IApWrapper, VersionType} from "@/model/IApWrapper";
import {IMacroData} from "@/model/IMacroData";
import {IContentProperty, IContentPropertyNormalised} from "@/model/IContentProperty";
import {ICustomContent} from "@/model/ICustomContent";
import {IUser} from "@/model/IUser";
import {IConfluence} from "@/model/IConfluence";
import {IAp} from "@/model/IAp";
import {MacroIdentifier} from "@/model/MacroIdentifier";
import {DataSource, Diagram, DiagramType} from "@/model/Diagram";
import {ICustomContentResponseBody} from "@/model/ICustomContentResponseBody";
import {AtlasPage} from "@/model/page/AtlasPage";

export default class ApWrapper2 implements IApWrapper {
  versionType: VersionType;
  _confluence: IConfluence;
  _requestFn: {
    (req: IApRequest): any
  };
  _navigator: any;
  _dialog: any;
  _macroIdentifier: MacroIdentifier;
  _user: any;
  _page: AtlasPage;

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
    this._page = new AtlasPage(ap);
  }

  getMacroData(): Promise<IMacroData | undefined> {
    return new Promise(((resolve) => {
      try {
        this._confluence.getMacroData((data) => {
          resolve(data)
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

  async getContentProperty2(): Promise<IContentPropertyNormalised | undefined> {
    let macroData = await this.getMacroData();
    const uuid = macroData?.uuid;
    if (!uuid) {
      console.warn('`uuid` is empty. This diagram has not been initialised. Most likely it has not been edited.')
      return undefined;
    }
    let key = this.propertyKey(uuid);
    let property = await this.getContentProperty(key);
    if (!property) {
      let message = 'property is not found with key:' + key;
      console.error(message);
      trackEvent(message, 'get_content_property', 'unexpected_error');
      throw {
        message: message,
        data: macroData
      }
    }
    let result = Object.assign({}, property) as IContentPropertyNormalised;
    if(typeof property.value === "string") {
      result.value = {
        diagramType: DiagramType.Sequence,
        source: DataSource.ContentPropertyOld,
        code: property.value
      }
    } else {
      result.value.source = DataSource.ContentProperty;
    }
    result.value.id = key;
    result.value.payload = result; // To cache content property key and version on Diagram object
    return result;
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

  async setContentProperty(content: IContentPropertyNormalised) {
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

  getContentKey() {
    return getUrlParam('contentKey');
  }

  hasCustomContent() {
    return !!(this.getContentKey());
  }

  getCustomContentType() {
    return `ac:${getUrlParam('addonKey')}:${this.getContentKey()}`;
  }

  parseCustomContentResponse(response: { body: string; }): ICustomContentResponseBody {
    return response && response.body && JSON.parse(response.body);
  }

  async createCustomContent(content: Diagram) {
    const type = this.getCustomContentType();
    // TODO: Can the type be blog?
    const container = {id: await this._page.getPageId(), type: await this._page.getContentType()};
    const bodyData = {
      "type": type,
      "title": content.title || `Untitled ${new Date().toISOString()}`,
      "space": {
        "key": await this._page.getSpaceKey()
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

  async getCustomContentById(id: string): Promise<ICustomContent | undefined> {
    const customContent = await this.getCustomContentRaw(id);
    if (!customContent) {
      throw Error(`Failed to load custom content by id ${id}`);
    }
    let diagram = JSON.parse(customContent.body.raw.value);
    diagram.source = DataSource.CustomContent;
    const count = (await this._page.countMacros((m) => {
      return m?.customContentId?.value === id;
    }));
    console.debug(`Found ${count} macros on page`);

    const pageId = String(await this._page.getPageId());
    let isCrossPageCopy = pageId !== String(customContent?.container?.id);
    if (isCrossPageCopy || count > 1) {
      diagram.isCopy = true;
      console.warn('Detected copied macro');
      if(isCrossPageCopy) {
        trackEvent('cross_page', 'duplication_detect', 'warning');
      }
      if(count > 1) {
        trackEvent('same_page', 'duplication_detect', 'warning');
      }
    } else {
      diagram.isCopy = false;
    }
    diagram.id = id;
    let assign = <unknown>Object.assign({}, customContent, {value: diagram});
    return <ICustomContent>assign;
  }

  private async getCustomContentRaw(id: string) {
    const url = `/rest/api/content/${id}?expand=body.raw,version.number,container,space`;
    try {
      const response = await this._requestFn({type: 'GET', url});
      const customContent = this.parseCustomContentResponse(response);
      console.debug(`Loaded custom content by id ${id}.`);
      return customContent;
    } catch (e) {
      trackEvent(e.message, 'load_custom_content', 'error');
      // TODO: return a NullCustomContentObject
      return undefined;
    }
  }

  async saveCustomContent(customContentId: string, value: Diagram) {
    let result;
    // TODO: Do we really need to check whether it exists?
    const existing = await this.getCustomContentById(customContentId);
    const pageId = String(await this._page.getPageId());
    const count = (await this._page.countMacros((m) => {
      return m?.customContentId?.value === customContentId;
    }));

    // Make sure we don't update custom content on a different page
    // and there is only one macro linked to the custom content on the current page.
    if (existing && pageId === String(existing?.container?.id) && count === 1) {
      result = await this.updateCustomContent(existing, value);
    } else {
      if(count > 1) {
        console.warn(`Detected copied macro on the same page ${pageId}.`);
      }
      if (pageId !== String(existing?.container?.id)) {
        console.warn(`Detected copied macro on page ${pageId} (current) and ${existing?.container?.id}.`);
      }
      result = await this.createCustomContent(value);
    }
    return result
  }

  getDialogCustomData() {
    const dialog = this._dialog;
    return new Promise((resolv) => {
      try {
        dialog.getCustomData((data: unknown) => {
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
    return new Promise(resolv => this._user.getCurrentUser((user: IUser) => {
      resolv(user);
    }));
  }

  canUserEdit(): Promise<boolean> {
    const checkPermission = (pageId: any, userId: any) => 
      this._requestFn({
        type: 'POST',
        url: `/rest/api/content/${pageId}/permission/check`,
        contentType: 'application/json', 
        data: JSON.stringify({subject: {type: 'user', identifier: userId}, operation: 'update'})
      })
      .then((response: any) => {
        const data = JSON.parse(response.body);
        return data.hasPermission;
      }, (e: any) => console.error(`Error checking content permission:`, e));

    return Promise.all([
      this._page.getPageId(),
      this._getCurrentUser()
    ]).then(([pageId, user]) => checkPermission(pageId, user.atlassianAccountId), console.error);
  }

  isLite(): boolean {
    // @ts-ignore
    return getUrlParam('addonKey')?.includes('lite');
  }
}

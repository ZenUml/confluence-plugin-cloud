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
import CheckPermission, {PermissionCheckRequestFunc} from "@/model/page/CheckPermission";

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
  currentUser: IUser | undefined;
  currentSpace: string | undefined;
  currentPageUrl: string | undefined;

  constructor(ap: IAp) {
    this.versionType = this.isLite() ? VersionType.Lite : VersionType.Full;
    let macroIdentifier: MacroIdentifier;
    let contentKey = getUrlParam('contentKey');
    if (!contentKey) {
      console.warn('contentKey URL parameter is not provided. It can be `sequence` or `graph`. Falling back to `sequence`');
      contentKey = 'sequence';
    }
    if (contentKey?.includes('sequence')) {
      macroIdentifier = MacroIdentifier.Sequence;
    } else if (contentKey?.includes('graph')) {
      macroIdentifier = MacroIdentifier.Graph
    } else {
      console.warn('Wrong value in contentKey URL parameter. Fall back to `sequence`.')
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

  async initializeContext(): Promise<void> {
    try {
      this.currentUser = await this._getCurrentUser();
      this.currentSpace = await this._getCurrentSpace();
      this.currentPageUrl = await this._getCurrentPageUrl();
    } catch (e: any) {
      console.error(e);
      try {
        trackEvent('error', 'initializeContext', e.message);
      } catch (e) {
        console.error(e);
      }
    }
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
      trackEvent(message, 'get_content_property', 'warning');
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

  saveMacro(params: IMacroData, body: string) {
    this._confluence.saveMacro(params, body)
  }

  getContentKey() {
    return getUrlParam('contentKey');
  }

  getCustomContentTypePrefix() {
    return `ac:${getUrlParam('addonKey')}`;
  }

  getCustomContentType() {
    return `${this.getCustomContentTypePrefix()}:${this.getContentKey()}`;
  }

  parseCustomContentResponse(response: { body: string; }): ICustomContentResponseBody {
    return response && response.body && JSON.parse(response.body);
  }

  parseCustomContentListResponse(response: { body: string; }): Array<ICustomContentResponseBody> {
    return response && response.body && JSON.parse(response.body)?.results;
  }

  async createCustomContent(content: Diagram) {
    const type = this.getCustomContentType();
    // TODO: Can the type be blog?
    const container = {id: await this._page.getPageId(), type: await this._page.getContentType()};
    const bodyData = {
      "type": type,
      "title": content.title || `Untitled ${new Date().toISOString()}`,
      "space": {
        "key": this.currentSpace || await this._getCurrentSpace()
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
      trackEvent(JSON.stringify(e), 'load_custom_content', 'error');
      // TODO: return a NullCustomContentObject
      return undefined;
    }
  }

  async listCustomContentByType(type: string): Promise<Array<ICustomContentResponseBody>> {
    const customContentType = `${this.getCustomContentTypePrefix()}:${type}`;
    const spaceKey = await this._getCurrentSpace();
    const url = `/rest/api/content?spaceKey=${spaceKey}&type=${customContentType}&expand=body.raw,version.number,container,space`;
    try {
      const response = await this._requestFn({type: 'GET', url});
      const customContentList = this.parseCustomContentListResponse(response);
      console.debug(`Listed custom content by type ${customContentType}.`);
      return customContentList;
    } catch (e) {
      trackEvent(JSON.stringify(e), 'listCustomContentByType', 'error');
      return [] as Array<ICustomContentResponseBody>;
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
    return new Promise((resolv: Function) => {
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
    return new Promise(resolv => this._user.getCurrentUser((user: IUser) => resolv(user)));
  }

  async _getCurrentSpace(): Promise<string> {
    return this.currentSpace || (this.currentSpace = await this._page.getSpaceKey());
  }

  async _getCurrentPageUrl(): Promise<string> {
    return this.currentPageUrl || (this.currentPageUrl = await this._page.getHref());
  }

  async canUserEdit(): Promise<boolean> {
    const pageId = await this._page.getPageId();
    return await CheckPermission(pageId, this.currentUser?.atlassianAccountId || '', this._requestFn as PermissionCheckRequestFunc)
  }

  isLite(): boolean {
    // @ts-ignore
    return getUrlParam('addonKey')?.includes('lite');
  }
}

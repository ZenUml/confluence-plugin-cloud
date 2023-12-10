import {getUrlParam, trackEvent} from '@/utils/window';
import time from '@/utils/timer';
import {IApWrapper, VersionType} from "@/model/IApWrapper";
import {IMacroData} from "@/model/IMacroData";
import {IContentProperty} from "@/model/IContentProperty";
import {ICustomContent, ICustomContentV2, SearchResults} from "@/model/ICustomContent";
import {IUser} from "@/model/IUser";
import {IConfluence} from "@/model/IConfluence";
import {IAp} from "@/model/IAp";
import {DataSource, Diagram} from "@/model/Diagram/Diagram";
import {ICustomContentResponseBody, ICustomContentResponseBodyV2} from "@/model/ICustomContentResponseBody";
import {AtlasPage} from "@/model/page/AtlasPage";
import CheckPermission, {PermissionCheckRequestFunc} from "@/model/page/CheckPermission";
import { ISpace, LocationTarget } from './ILocationContext';
import { Attachment } from './ConfluenceTypes';

const CUSTOM_CONTENT_TYPES = ['zenuml-content-sequence', 'zenuml-content-graph'];
const SEARCH_CUSTOM_CONTENT_LIMIT: number = 1000;

export default class ApWrapper2 implements IApWrapper {
  versionType: VersionType;
  _confluence: IConfluence;
  _requestFn: {
    (req: IApRequest): any
  };
  _navigator: any;
  _dialog: any;
  _user: any;
  _page: AtlasPage;
  currentUser: IUser | undefined;
  currentSpace: ISpace | undefined;
  currentPageId: string | undefined;
  currentPageUrl: string | undefined;
  locationTarget: LocationTarget | undefined;
  nextPageUrl: string ='';
  constructor(ap: IAp) {
    this.versionType = this.isLite() ? VersionType.Lite : VersionType.Full;
    this._confluence = ap.confluence;
    this._requestFn = ap.request;
    this._navigator = ap.navigator;
    this._dialog = ap.dialog;
    this._user = ap.user;
    this._page = new AtlasPage(ap);
  }

  async initializeContext(): Promise<void> {
    console.log('initializeContext starts');
    try {
      this.currentUser = await this._getCurrentUser();
      this.currentSpace = await this._getCurrentSpace();
      this.currentPageUrl = await this._getCurrentPageUrl();
      this.locationTarget = await this._getLocationTarget();
      this.currentPageId = await this._page.getPageId();
      console.log('initializeContext', this.currentUser, this.currentSpace, this.currentPageUrl, this.locationTarget, this.currentPageId);

      if(window) {
        //@ts-ignore
        window.initialContext = {currentUser: this.currentUser, currentSpace: this.currentSpace, currentPageUrl: this.currentPageUrl, currentPageId: this.currentPageId, locationTarget: this.locationTarget};
      }
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
          console.debug('Loaded macro data', data);
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

  // All document types will be using the same content key.
  // Old documents that uses the old content key will not be migrated.
  // We may migrate them in the future.
  getContentKey() {
    return 'zenuml-content-sequence';
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

  parseCustomContentResponseV2(response: { body: string; }): ICustomContentResponseBodyV2 {
    return response && response.body && JSON.parse(response.body);
  }

  parseCustomContentListResponse(response: { body: string; }): Array<ICustomContentResponseBody> {
    return response && response.body && JSON.parse(response.body)?.results;
  }

  async createCustomContent(content: Diagram) {
    const type = this.getCustomContentType();
    const bodyData: any = {
      "type": type,
      "title": content.title || `Untitled ${new Date().toISOString()}`,
      "space": {
        "key": (await this._getCurrentSpace()).key
      },
      "body": {
        "raw": {
          "value": JSON.stringify(content),
          "representation": "raw"
        }
      }
    };
    const container = {id: await this._page.getPageId(), type: await this._page.getContentType()};
    if(container.id) {
      bodyData.container = container;
    }

    const response = await this._requestFn({
      url: '/rest/api/content',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(bodyData)
    });
    return this.parseCustomContentResponse(response);
  }

  async createCustomContentV2(content: Diagram): Promise<ICustomContentResponseBodyV2> {
    const type = this.getCustomContentType();
    const data: any = {
      "type": type,
      "pageId": await this._getCurrentPageId(),
      "title": content.title || `Untitled ${new Date().toISOString()}`,
      "body": {
        "value": JSON.stringify(content),
        "representation": "raw"
      }
    };

    const response = await this._requestFn({
      url: '/api/v2/custom-content',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data)
    });
    return this.parseCustomContentResponseV2(response);
  }

  async updateCustomContent(contentObj: ICustomContent, newBody: Diagram) {
    let newVersionNumber = 1;

    if (contentObj.version?.number) {
      newVersionNumber += contentObj.version?.number
    }
    const bodyData = {
      "type": contentObj.type,
      "title": newBody.title || contentObj.title,
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

  async updateCustomContentV2(content: ICustomContentV2, newBody: Diagram): Promise<ICustomContentResponseBodyV2> {
    let newVersionNumber = 1;

    if (content.version?.number) {
      newVersionNumber += content.version?.number
    }
    const data = {
      "id": content.id,
      "type": content.type,
      "status": content.status,
      "spaceId": content.spaceId,
      "pageId": content.pageId,
      "title": newBody.title || content.title,
      "body": {
        "value": JSON.stringify(newBody),
        "representation": "raw"
      },
      "version": {
        "number": newVersionNumber
      }
    };

    const response = await this._requestFn({
      url: `/api/v2/custom-content/${content.id}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(data)
    });
    return this.parseCustomContentResponseV2(response);
  }

  async getCustomContentById(id: string): Promise<ICustomContent | undefined> {
    const customContent = await this.getCustomContentRaw(id);
    if (!customContent) {
      throw Error(`Failed to load custom content by id ${id}`);
    }
    let diagram = JSON.parse(customContent.body.raw.value);
    diagram.source = DataSource.CustomContent;
    const count = (await this._page.countMacros((m) => {
      //TODO: filter by macro type
      return m?.customContentId?.value === id;
    }));
    console.debug(`Found ${count} macros on page`);

    const pageId = await this._page.getPageId();
    let isCrossPageCopy = pageId && String(pageId) !== String(customContent?.container?.id);
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

  async getCustomContentByIdV2(id: string): Promise<ICustomContentV2 | undefined> {
    const customContent = await this.getCustomContentRawV2(id);
    if (!customContent) {
      throw Error(`Failed to load custom content by id ${id}`);
    }
    let diagram = JSON.parse(customContent.body.raw.value);
    diagram.source = DataSource.CustomContent;
    const count = (await this._page.countMacros((m) => {
      //TODO: filter by macro type
      return m?.customContentId?.value === id;
    }));
    console.debug(`Found ${count} macros on page`);

    const pageId = await this._page.getPageId();
    let isCrossPageCopy = pageId && pageId !== String(customContent?.pageId);
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
    return <ICustomContentV2>assign;
  }

  private async getCustomContentRaw(id: string): Promise<ICustomContentResponseBody | undefined> {
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

  private async getCustomContentRawV2(id: string): Promise<ICustomContentResponseBodyV2 | undefined> {
    const url = `/api/v2/custom-content/${id}?body-format=raw`;
    try {
      const response = await this._requestFn({type: 'GET', url});
      const customContent = this.parseCustomContentResponseV2(response);
      console.debug(`Loaded custom content by id ${id}.`);
      return customContent;
    } catch (e) {
      trackEvent(JSON.stringify(e), 'load_custom_content', 'error');
      // TODO: return a NullCustomContentObject
      return undefined;
    }
  }

   async searchNextPage(): Promise<Array<ICustomContent>> {
    if(this.nextPageUrl=='')return [] as Array<ICustomContent>;
    const nextPage = async (): Promise<Array<ICustomContent>> => {
      let results: Array<ICustomContent> = [],data;
      data = await this.searchOnce(this.nextPageUrl);
      this.nextPageUrl=data?._links?.next || '';
      results=results.concat(data?.results);
      return results;
    };
    try {
      return await time(nextPage, (duration, results) => {
        trackEvent(`found ${results.length} content, took ${duration} ms`, 'searchNextPage', 'info');
      });
    } catch (e) {
      console.error('searchNextPage', e);
      trackEvent(JSON.stringify(e), 'searchNextPage', 'error');
      return [] as Array<ICustomContent>;
    }
   }
  async searchCustomContent(maxItems?: number,pageSize: number=25,docType: string='',keyword: string='',onlyMine: boolean=false): Promise<Array<ICustomContent>> {
    const spaceKey = (await this._getCurrentSpace()).key;
    const customContentType = (t: string) => `${this.getCustomContentTypePrefix()}:${t}`;
    const typeClause = (t: string) => `type="${customContentType(t)}"`;
    const typesClause = (a: Array<string>) => a.map(typeClause).join(' or ');
    let maxItemsHasValue=maxItems!=undefined;
    let keywordFilter='',onlyMineFilter='',docTypeFilter='',limitFilter='';
    if(keyword!='')keywordFilter=` and (title ~ "${keyword}*" or title ~ "${keyword}")`;
    if(onlyMine)onlyMineFilter=` and contributor = "${this.currentUser?.atlassianAccountId}"`;
    if(docType!='')docTypeFilter=``;
    if(!maxItemsHasValue)limitFilter=`&limit=${pageSize}`;
    const searchUrl = `/rest/api/content/search?cql=space="${spaceKey}" and (${typesClause(CUSTOM_CONTENT_TYPES)}) ${keywordFilter} ${onlyMineFilter} ${docTypeFilter}order by lastmodified desc${limitFilter}&expand=body.raw,version.number,container,space,body.storage,history.contributors.publishers.users`;
    
    let maxItemsCount=SEARCH_CUSTOM_CONTENT_LIMIT;
    const searchAll = async (): Promise<Array<ICustomContent>> => {
      let url = searchUrl, data;
      let results: Array<ICustomContent> = [];
      do {
        data = await this.searchOnce(url);
        results = results.concat(data?.results);
        url = data?._links?.next || '';
      } while(url && results.length < maxItemsCount);
      return results;
    };

    const searchPage = async (): Promise<Array<ICustomContent>> => {
      let url = searchUrl, data;
      let results: Array<ICustomContent> = [];
      data = await this.searchOnce(url);
      console.debug({action:'searchPage searchOnce',data:data});
      this.nextPageUrl=data?._links?.next || '';
      results=results.concat(data?.results);
      console.debug({action:'searchOnce concat',results:results});
      return results;
    };

    try {
      if(maxItemsHasValue){
        maxItemsCount=maxItems||1;
        return await time(searchAll, (duration, results) => {
          trackEvent(`found ${results.length} content, took ${duration} ms`, 'searchAll', 'info');
        });
      }
      else
      {
        return await time(searchPage, (duration, results) => {
          trackEvent(`found ${results.length} content, took ${duration} ms`, 'searchPage', 'info');
        });
      }
    } catch (e) {
      console.error('searchCustomContent', e);
      trackEvent(JSON.stringify(e), 'searchCustomContent', 'error');
      return [] as Array<ICustomContent>;
    }
  }

  searchOnce = async (url: string): Promise<SearchResults> => {
    console.debug(`Searching content with ${url}`);
    const data = await this.request(url);
    console.debug(`${data?.size} results returned, has next? ${data?._links?.next != null}`);
    data.results = data?.results.map(this.parseCustomContent).filter((c: ICustomContent) => c.value);
    console.debug({action:'searchOnce',data:data});
    return data;
  };

  buildUrl=(sourceUrl: string,newPath: string): string =>{
    if (newPath && newPath.startsWith("/")) {
      newPath = newPath.substring(1);
    }
    return `${this.extractDomainFromURL(sourceUrl)}/${newPath}`;
  }

  extractDomainFromURL=(url: string): string =>{
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.origin;
    } catch (error) {
      console.error("Invalid URL:", error);
      return '';
    }
  }

  parseCustomContentAuthor = (customContent: ICustomContentResponseBody): any => {
    let accountId=customContent?.history?.createdBy?.accountId||'';
    let selfLink=customContent?.history?.createdBy?._links?.self||'';
    let author: { id: string, name: string, avatar: string, link: string } = {
      id: accountId,
      name: customContent?.history?.createdBy?.displayName||'',
      avatar:  this.buildUrl(selfLink,customContent?.history?.createdBy?.profilePicture?.path||''),
      link: this.buildUrl(selfLink,'wiki/display/~'+accountId),
    };
    return author;
  };

  parseCustomContent = (customContent: ICustomContentResponseBody): ICustomContent => {
    const result = <unknown>Object.assign({}, customContent, {
      value: this.parseCustomContentDiagram(customContent),
      container:  Object.assign({}, customContent.container, this.parseCustomContentContainer(customContent)),
      author:  this.parseCustomContentAuthor(customContent)
    });
    console.debug(`converted result: `, result);
    return result as ICustomContent;
  };

  parseCustomContentContainer = (customContent: ICustomContentResponseBody): any => {
    let container: { link: string | undefined } = { link: undefined };
    try {
      let webui = customContent?.container?._links?.webui||'';
      let selfUrl = customContent?.container?._links?.self||'';
      container.link = this.buildUrl(selfUrl,'wiki'+webui);
    } catch (e) {
      console.error('parseCustomContentContainer error: ', e);
      trackEvent(JSON.stringify(e), 'parseCustomContentContainer', 'error');
    }
    return container;
  };

  parseCustomContentDiagram = (customContent: ICustomContentResponseBody): any => {
    let diagram: any;
    const rawValue = customContent?.body?.raw?.value;
    if(rawValue) {
      try {
        diagram = JSON.parse(rawValue);
        diagram.source = DataSource.CustomContent;
      } catch(e) {
        console.error(`parseCustomContentDiagram error: `, e, `raw value: ${rawValue}`);
        trackEvent(JSON.stringify(e), 'parseCustomContentDiagram', 'error');
      }
    }
    return diagram;
  };


  async saveCustomContent(customContentId: string, value: Diagram) {
    let result;
    // TODO: Do we really need to check whether it exists?
    const existing = await this.getCustomContentById(customContentId);
    const pageId = await this._page.getPageId();
    const count = (await this._page.countMacros((m) => {
      return m?.customContentId?.value === customContentId;
    }));

    // pageId is absent when editing in custom content list page;
    // Make sure we don't update custom content on a different page
    // and there is only one macro linked to the custom content on the current page.
    if (existing && (!pageId || (String(pageId) === String(existing?.container?.id) && count === 1))) {
      result = await this.updateCustomContent(existing, value);
    } else {
      if(count > 1) {
        console.warn(`Detected copied macro on the same page ${pageId}.`);
      }
      if (String(pageId) !== String(existing?.container?.id)) {
        console.warn(`Detected copied macro on page ${pageId} (current) and ${existing?.container?.id}.`);
      }
      result = await this.createCustomContent(value);
    }
    return result
  }

  async saveCustomContentV2(customContentId: string, value: Diagram): Promise<ICustomContentResponseBodyV2> {
    let result;
    // TODO: Do we really need to check whether it exists?
    const existing = await this.getCustomContentByIdV2(customContentId);
    const pageId = await this._getCurrentPageId();
    const count = (await this._page.countMacros((m) => {
      return m?.customContentId?.value === customContentId;
    }));

    // pageId is absent when editing in custom content list page;
    // Make sure we don't update custom content on a different page
    // and there is only one macro linked to the custom content on the current page.
    if (existing && (!pageId || (String(pageId) === String(existing?.pageId) && count === 1))) {
      result = await this.updateCustomContentV2(existing, value);
    } else {
      if(count > 1) {
        console.warn(`Detected copied macro on the same page ${pageId}.`);
      }
      if (String(pageId) !== String(existing?.pageId)) {
        console.warn(`Detected copied macro on page ${pageId} (current) and ${existing?.pageId}.`);
      }
      result = await this.createCustomContentV2(value);
    }
    return result;
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

  async getAttachmentsV2(pageId?: string, queryParameters?: any): Promise<Array<Attachment>> {
    pageId = pageId || await this._getCurrentPageId();
    queryParameters = queryParameters || {};
    const param = Object.keys(queryParameters).reduce((acc, i) => `${acc}${acc ? '&' : ''}${i}=${queryParameters[i]}`, '');
    const response = await this.request(`/api/v2/pages/${pageId}/attachments${param ? `?${param}` : ''}`);
    return response?.results || [];
  }

  async getAttachments(pageId?: string, queryParameters?: any): Promise<Array<Attachment>> {
    pageId = pageId || await this._getCurrentPageId();
    queryParameters = queryParameters || {};
    const param = Object.keys(queryParameters).reduce((acc, i) => `${acc}${acc ? '&' : ''}${i}=${queryParameters[i]}`, '');
    const response = await this.request(`/rest/api/content/${pageId}/child/attachment${param ? `?expand=version&${param}` : ''}`);
    console.debug(`found attachments in page ${pageId} with params ${queryParameters}:`, response);
    const baseLinks = {base: response._links.base, context: response._links.context};
    //set 'comment' as top level field to be consistent with V2 API response
    return response?.results.map((a: any) => Object.assign(a, {comment: a.metadata?.comment, _links: Object.assign(a._links, baseLinks)})) || [];
  }

  _getCurrentUser(): Promise<IUser> {
    return new Promise(resolv => this._user.getCurrentUser((user: IUser) => resolv(user)));
  }

  async _getCurrentSpace(): Promise<ISpace> {
    return this.currentSpace
            || (this.currentSpace = await this._page.getSpace())
      || (this.currentSpace = {key: await this._page.getSpaceKey()});
  }

  async _getCurrentPageId(): Promise<string> {
    return this.currentPageId || (this.currentPageId = await this._page.getPageId());
  }

  async _getCurrentPageUrl(): Promise<string> {
    return this.currentPageUrl || (this.currentPageUrl = await this._page.getHref());
  }

  async _getLocationTarget(): Promise<LocationTarget> {
    return this.locationTarget || (this.locationTarget = await this._page.getLocationTarget());
  }

  async isInContentEditOrContentCreate(): Promise<boolean> {
    const target = await this._getLocationTarget();
    return target === LocationTarget.ContentEdit || target === LocationTarget.ContentCreate;
  }

  async canUserEdit(): Promise<boolean> {
    const pageId = await this._page.getPageId();
    return await CheckPermission(pageId, this.currentUser?.atlassianAccountId || '', this._requestFn as PermissionCheckRequestFunc)
  }

  isLite(): boolean {
    // @ts-ignore
    return getUrlParam('addonKey')?.includes('lite');
  }

  async request(url: string, method: string = 'GET'): Promise<any> {
    const response = await this._requestFn({type: method, url});
    return Object.assign({}, response && response.body && JSON.parse(response.body), {xhr: response.xhr});
  }
}

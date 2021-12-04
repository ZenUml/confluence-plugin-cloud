import {IAp} from "@/model/IAp";
import {ILocationContext} from "@/model/ILocationContext";

export class AtlasPage {
  private _requestFn?: (req: IApRequest) => any;
  private _locationContext: any;
  private _navigator: any;
  constructor(ap?: IAp) {
    console.log("Page.constructor");
    // Assigning _ap causes DOMException: Blocked a frame with origin "xxx" from accessing a cross-origin frame.
    // this._ap = ap;
    this._requestFn = ap?.request;
    this._navigator = ap?.navigator;
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

  async getPageId() {
    const locationContext = await this.getLocationContext();
    return locationContext.contentId;
  }

  // This API may return stale data. The most recent macro may not be returned.
  // This is caused by the REST API we are calling.
  // It seems reliable enough for us to use, as we only need to know the macros
  // when we edit the newly added macro.
  async macros(matcher: (e: AtlasDocElement) => boolean): Promise<AtlasDocElement[]> {
    if (!this._requestFn) {
      return [];
    }
    const pageId = await this.getPageId();
    const response = await this._requestFn({
      url: `/rest/api/content/${pageId}?expand=body.atlas_doc_format&status=draft`,
      type: 'GET',
      contentType: 'application/json'
    });
    console.debug("Page.macros", response);
    if (!response || !response.body) {
      return [];
    }
    const {body: {atlas_doc_format: {value}}} = JSON.parse(response.body);
    const {content: contentList} = JSON.parse(value);
    console.debug("Page.macros", contentList);
    return contentList.filter(({type}: any) => type === AtlasDocElementType.Extension)
      .filter(matcher);
  }
  }
enum AtlasDocElementType {
  Extension = 'extension',
}

interface AtlasDocElement {
  type: AtlasDocElementType;
  attrs: {
    parameters: {
      macroParams: {
        customContentId?: {
          value: string;
        }
      }
    }
  };
}
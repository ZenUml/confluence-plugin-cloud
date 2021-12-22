import {IAp} from "@/model/IAp";
import {ILocationContext} from "@/model/ILocationContext";
import {trackEvent} from "@/utils/window";

export class AtlasPage {
  _requestFn?: (req: IApRequest) => any;
  private _locationContext?: ILocationContext;
  private readonly _navigator: any;
  constructor(ap?: IAp) {
    // TODO: why? Assigning _ap causes DOMException:
    // Blocked a frame with origin "xxx" from accessing a cross-origin frame.
    // this._ap = ap;
    this._requestFn = ap?.request;
    this._navigator = ap?.navigator;
  }

  // This method cannot be private or protected because it needs to be overwritten in test.
  async _getLocationContext(): Promise<ILocationContext> {
    if(this._locationContext) {
      return this._locationContext;
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
    return (await this._getLocationContext()).contentId;
  }

  async getSpaceKey() {
    return (await this._getLocationContext()).spaceKey;
  }

  async getContentType() {
    return (await this._getLocationContext()).contentType;
  }

  // This API may return stale data. The most recent macro may not be returned.
  // This is caused by the REST API we are calling.
  // It seems reliable enough for us to use, as we only need to know the macros
  // when we edit the newly added macro.
  private async macros(): Promise<AtlasDocElement[]> {
    if (!this._requestFn) {
      return [];
    }
    const pageId = await this.getPageId();
    const response = await this._requestFn({
      url: `/rest/api/content/${pageId}?expand=body.atlas_doc_format&status=draft`,
      type: 'GET',
      contentType: 'application/json'
    });
    if (!response || !response.body) {
      return [];
    }
    try {
      const {body: {atlas_doc_format: {value}}} = JSON.parse(response.body);
      const {content: contentList} = JSON.parse(value);
      return contentList.filter(({type}: any) => type === AtlasDocElementType.Extension);
    } catch (e) {
      trackEvent(response?.xhr?.status, 'query_macro_atlas_doc_format', 'error');
      trackEvent(e.message, 'query_macro_atlas_doc_format', 'error');
      console.trace('Failed to query all macros on the page. Assume there is no macros on this page.')
      console.error('This message will be very helpful for the vendor to improve their product.');
      console.error('Please consider share it with the vendor so that they can fix the issue.');
      console.error('Please remove all sensitive data before sharing.');
      console.error('==========');
      console.error(response?.body);
      console.error('==========');
      return [];
    }
  }

  async countMacros(matcher: (mps: MacroParams) => boolean) {
    return (await this.macros())
      .map(c => c.attrs.parameters.macroParams)
      .filter(matcher)
      .length;
  }
}
enum AtlasDocElementType {
  Extension = 'extension',
}

interface AtlasDocElement {
  type: AtlasDocElementType;
  attrs: {
    parameters: {
      macroParams: MacroParams;
    }
  };
}

interface MacroParams {
  customContentId?: {
    value: string;
  }
}
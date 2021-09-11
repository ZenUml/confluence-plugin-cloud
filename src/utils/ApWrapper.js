import { getUrlParam } from './window';

// Each iFrame provides context for only one macro.
// getMacroData returns the macro data for the CURRENT macro.
// ApWrapper converts callback to Promise and also encapsulates
// custom content APIs.
export default class ApWrapper {
  _confluence;
  _request;
  _navigator;
  _dialog;
  _macroIdentifier;
  _locationContext;
  _user;

  constructor(ap, macroIdentifier) {
    this._macroIdentifier = macroIdentifier;
    this._confluence = ap.confluence;
    this._request = ap.request;
    this._navigator = ap.navigator;
    this._dialog = ap.dialog;
    this._user = ap.user;
  }

  getMacroData() {
    return new Promise(((resolve) => {
      try {
        this._confluence.getMacroData((data) => {
          resolve(data)
        })
      } catch (e) {
        // eslint-disable-next-line
        console.error('Failed to retrieve macro data.', e)
        resolve(null)
      }
    }))
  }

  //FIXME: this method throws error in custom content viewer
  getMacroBody() {
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

  propertyKey(uuid) {
    const macroKey = `zenuml-${this._macroIdentifier}-macro`;
    return `${macroKey}-${uuid}-body`;
  }

  getContentProperty(key) {
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

  async setContentProperty(content) {
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

  saveMacro(params, body) {
    this._confluence.saveMacro(params, body)
  }

  getLocationContext() {
    if(this._locationContext) {
      return Promise.resolve(this._locationContext);
    }

    const self = this;
    return new Promise((resolve) => {
      self._navigator.getLocation((data) => {
        self._locationContext = data.context;
        resolve(data.context);
      });
    });
  }

  async getSpaceKey() {
    return (await this.getLocationContext().spaceKey);
  }

  async getPageId() {
    return (await this.getLocationContext().contentId);
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

  parseCustomContentResponse(response) {
    return response && response.body && JSON.parse(response.body);
  }

  async createCustomContent(uuid, content) {
    const context = await this.getLocationContext();
    const type = this.getCustomContentType();
    const container = {id: context.contentId, type: context.contentType};
    const bodyData = {
      "type": type,
      "title": uuid,
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

    const response = await this._request({
      url: '/rest/api/content',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(bodyData)
    });
    return this.parseCustomContentResponse(response);
  }

  async updateCustomContent(contentObj, newBody) {
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

  async getCustomContentById(id) {
    const url = `/rest/api/content/${id}?expand=body.raw,version.number,container,space`;
    const response = await this._request({type: 'GET', url});
    const customContent = this.parseCustomContentResponse(response);
    return Object.assign({}, customContent, {value: JSON.parse(customContent.body.raw.value)});
  }

  async saveCustomContent(customContentId, uuid, value) {
    if(customContentId) {
      const existing = await this.getCustomContentById(customContentId);
      return await this.updateCustomContent(existing, value);
    } else {
      return await this.createCustomContent(uuid, value);
    }
  }

  isDisplayMode() {
    return getUrlParam('outputType') === 'display';
  }

  getCurrentUser() {
    return new Promise(resolv => this._user.getCurrentUser(user => resolv(user)));
  }

  canUserEdit() {
    return new Promise(resolv =>
      Promise.all([
        this.getPageId(),
        this.getCurrentUser()
      ]).then((pageId, user) => 
        this._request({
          type: 'GET',
          url: `/rest/api/content/${pageId}/restriction/byOperation/update/user?accountId=${user.atlassianAccountId}`,
          contentType: 'application/json;charset=UTF-8',
          success: () => resolv(true),
          error: () => resolv(false)
        })
      )
    );
  }
}

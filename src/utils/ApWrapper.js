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

  constructor(ap, macroIdentifier) {
    this._macroIdentifier = macroIdentifier;
    this._confluence = ap.confluence;
    this._request = ap.request;
    this._navigator = ap.navigator;
    this._dialog = ap.dialog;
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

  getSpaceKey() { //TODO: cacheable
    const navigator = this._navigator;
    return new Promise((resolv) => {
      navigator.getLocation((data) => {
        resolv(data.context.spaceKey);
      });
    });
  }

  getPageId() { //TODO: cacheable
    const navigator = this._navigator;
    return new Promise((resolve) => {
      navigator.getLocation((data) => {
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

  parseCustomContentResponse(response) {
    return response && response.body && JSON.parse(response.body);
  }

  async createCustomContent(uuid, content) {
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

  async updateCustomContent(contentObj, newBody) {
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

  async getCustomContentByTitle(type, title) {
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

  async getCustomContentById(id) {
    const url = `/rest/api/content/${id}?expand=body.raw,version.number`;
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
}

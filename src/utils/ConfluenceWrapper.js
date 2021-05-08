// Each iFrame provides context for only one macro.
// getMacroData returns the macro data for the CURRENT macro.
export default class ConfluenceWrapper {
  _confluence;
  _request;
  _navigator;

  constructor(ap) {
    this._confluence = ap.confluence;
    this._request = ap.request;
    this._navigator = ap.navigator;
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

  async createCustomContent(uuid, type, content) {
    const spaceKey = await this.getSpaceKey(); //TODO: cacheable
    const bodyData = `{
      "type": "${type}",
      "title": "${uuid}",
      "space": {
        "key": "${spaceKey}"
      },
      "body": {
        "raw": {
          "value": "${JSON.stringify(content).replaceAll('"', '\\"')}",
          "representation": "raw"
        }
      }
    }`;

    return await this._request({
      url: '/rest/api/content',
      type: 'POST',
      contentType: 'application/json',
      data: bodyData
    });
  }

  async updateCustomContent(contentObj, newBody) {
    const spaceKey = await this.getSpaceKey();
    const bodyData = `{
      "type": "${contentObj.type}",
      "title": "${contentObj.title}",
      "space": {
        "key": "${spaceKey}"
      },
      "body": {
        "raw": {
          "value": "${JSON.stringify(newBody).replaceAll('"', '\\"')}",
          "representation": "raw"
        }
      },
      "version": {
        "number": ${contentObj.version.number + 1}
      }
    }`;

    return await this._request({
      url: `/rest/api/content/${contentObj.id}`,
      type: 'PUT',
      contentType: 'application/json',
      data: bodyData
    });
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

  async saveCustomContent(uuid, type, content) {
    const existing = await this.getCustomContentByTitle(type, uuid);
    if(existing) {
      await this.updateCustomContent(existing, content);
    } else {
      await this.createCustomContent(uuid, type, content);
    }
  }
}

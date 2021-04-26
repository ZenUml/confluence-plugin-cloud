// Each iFrame provides context for only one macro.
// getMacroData returns the macro data for the CURRENT macro.
export default class ConfluenceWrapper {
  _confluence;
  _request;

  constructor(ap) {
    this._confluence = ap.confluence;
    this._request = ap.request;
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
}

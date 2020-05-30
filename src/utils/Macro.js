import uuidv4 from './uuid'

class Macro {
  EXAMPLE = `// Sample! Declare the participants (optional)
BookService BookRepository Receipt Notification
@Starter(User)
"{id, dueDate, ...}" = BookService.Borrow(id) {
  BookRepository.Update(id, onLoan)

  // Send Event with "Source->Target:Event". "Source->" is optional
  Notification:BOOK_ON_LOAN event with id, due date, etc. 
  new Receipt(id, dueDate)
}
`
  _confluence;
  _key;
  _versionNumber;
  _loaded = false;

  // eslint-disable-next-line
  constructor(confluence = AP.confluence) {
    this._confluence = confluence;
  }

  propertyKey(uuid) {
    const macroKey = 'zenuml-sequence-macro';
    return `${macroKey}-${uuid}-body`;
  }

  getMacroBody = () => {
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

  getMacroData = () => {
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

  getUrlParam (param) {
    const matches = (new RegExp(param + '=([^&]*)')).exec(window.location.search);
    return matches && matches[1] && decodeURIComponent(matches[1]);
  }

  getContentProperty = async () => {
    const macroData = await this.getMacroData();

    // When the macro is edited for the first time, macro data is not available in the preview mode
    // Fall back to the uuid parameter in the URL. This is defined in the descriptor and is only available for view.html.
    const key = macroData?.uuid || this.getUrlParam('uuid')
    return new Promise(resolve => {
      if (!key) {
        resolve(null)
      } else {
        this._key = key
        try {
          this._confluence.getContentProperty(this.propertyKey(key), (cp) => {
            this._versionNumber = cp?.version?.number
            resolve(cp)
          })
        } catch (e) {
          // eslint-disable-next-line
          console.error('Failed to retrieve content property.', e)
          resolve(null)
        }
      }
    })
  }

  setContentProperty = async (content) => {
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

  async load() {
    this._loaded = true
    const contentProp = await this.getContentProperty();
    let code;
    let styles;
    if(typeof contentProp?.value === 'string') {
      code = contentProp?.value
    } else {
      code = contentProp?.value?.code
      styles = contentProp?.value?.styles
    }
    code = code || await this.getMacroBody() || this.EXAMPLE
    styles = styles || {}
    return {code: code, styles}
  }

  // Warning! Do not call getXXX in save. Do retest if you want to call getXXX.
  // It does not work as of 17th May 2020. That is why we have stored key and version
  async save(code, styles) {
    if (!this._loaded) {
      throw new Error('You have to call load before calling save()')
    }
    const key = this._key || uuidv4()
    this._confluence.saveMacro({uuid: key, updatedAt: new Date()}, code)
    const versionNumber = this._versionNumber
    const contentProperty = {
      key: this.propertyKey(key),
      value: {code: code, styles: styles},
      version: {
        number: versionNumber ? versionNumber + 1 : 1
      }
    }
    await this.setContentProperty(contentProperty)
  }
}
export default Macro
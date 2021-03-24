import uuidv4 from './uuid';
import LZUTF8 from 'lzutf8';

const COMPRESS_ENCODING = 'Base64';

class Macro {
  EXAMPLE = `@Lambda OrderController
<<BFF>> OrderService
group BusinessService {
  PurchaseService
  InvoiceService
}
//\`POST /orders\`
OrderController.create(payload) {
  OrderService.create(payload) {
    order = new Order(payload)
    par {
      PurchaseService.createPO(order)
      InvoiceService.createInvoice(order)      
    }
  }
}`
  _confluence;
  _key;
  _versionNumber;
  _loaded = false;
  _macroIdentifier;

  // eslint-disable-next-line
  constructor(confluence = AP.confluence, macroIdentifier = 'sequence') {
    this._confluence = confluence;
    this._macroIdentifier = macroIdentifier;
  }

  propertyKey(uuid) {
    const macroKey = `zenuml-${this._macroIdentifier}-macro`;
    return `${macroKey}-${uuid}-body`;
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

  // Each iFrame provides context for only one macro.
  // getMacroData returns the macro data for the CURRENT macro.
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

  getUrlParam (param) {
    const matches = (new RegExp(param + '=([^&]*)')).exec(window.location.search);
    return matches && matches[1] && decodeURIComponent(matches[1]);
  }

  async getContentProperty() {
    const macroData = await this.getMacroData();

    // When the macro is edited for the first time, macro data is not available in the preview mode
    // Fall back to the uuid parameter in the URL.
    // This is defined in the descriptor and is only available for view.html.
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

  async load() {
    this._loaded = true
    const contentProp = await this.getContentProperty();
    let code;
    let styles;
    let mermaidCode;
    let diagramType;
    let graphXml;
    let compressed;
    if(typeof contentProp?.value === 'string') {
      code = contentProp?.value
    } else {
      code = contentProp?.value?.code
      styles = contentProp?.value?.styles
      mermaidCode = contentProp?.value?.mermaidCode
      diagramType = contentProp?.value?.diagramType
      graphXml = contentProp?.value?.graphXml
      compressed = contentProp?.value?.compressed
    }
    code = code || await this.getMacroBody();

    if(!mermaidCode && !code) {
      code = this.EXAMPLE;
    }

    styles = styles || {}

    if(compressed) {
      graphXml = LZUTF8.decompress(graphXml, {inputEncoding: COMPRESS_ENCODING});
    }
    return {code, styles, mermaidCode, diagramType, graphXml};
  }

  // Warning! Do not call getXXX in save. Do retest if you want to call getXXX.
  // It does not work as of 17th May 2020. That is why we have stored key and version
  async save(code, styles, mermaidCode, diagramType) {
    if (!this._loaded) {
      throw new Error('You have to call load before calling save()')
    }
    const key = this._key || uuidv4()
    this._confluence.saveMacro({uuid: key, updatedAt: new Date()}, code);
    const versionNumber = this._versionNumber;

    const compressedCode = LZUTF8.compress(code, {outputEncoding: COMPRESS_ENCODING});

    const value = this._macroIdentifier === 'graph' ?
      {graphXml: compressedCode, compressed: true} : {code, styles, mermaidCode, diagramType};

    const contentProperty = {
      key: this.propertyKey(key),
      value: value,
      version: {
        number: versionNumber ? versionNumber + 1 : 1
      }
    }
    await this.setContentProperty(contentProperty)
  }
}

export default Macro
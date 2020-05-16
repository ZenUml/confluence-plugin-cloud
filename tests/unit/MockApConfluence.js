class MockApConfluence {
  macroParams
  macroBody
  key
  contentProperty

  saveMacro(params, body) {
    this.macroParams = params
    this.macroBody = body
  }

  getMacroData(cb) {
    cb(this.macroParams)
  }

  getMacroBody(cb) {
    cb(this.macroBody)
  }

  setContentProperty(content) {
    this.key = content.key
    this.contentProperty = content
  }

  getContentProperty(key, cb) {
    if (this.key === key) {
      cb(this.contentProperty)
    } else {
      cb(null)
    }
  }
}

export default MockApConfluence
export interface IDescriptor {
  key: string
  name: string
  description: string
  enableLicensing: boolean
  links: {
    self: string
  }
  modules: {
    dynamicContentMacros: Array<IDynamicContentMacro>
    generalPages: Array<IGeneralPage>
    customContent: Array<ICustomContentModule>
  }
}

export interface IDynamicContentMacro {
  key: string
  name: { value: string }
  url: string
  editor?: {
    url: string
  }
  renderModes?: {
    default: {
      url: string
    }
  }
}

interface ICustomContentModule {
  key: string
  name: { value: string }
}

export interface IGeneralPage {
  key: string
  url: string
}

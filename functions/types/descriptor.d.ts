declare module descriptorNs {

  export interface Authentication {
    type: string;
  }

  export interface Lifecycle {
    installed: string;
    uninstalled: string;
  }

  export interface Links {
    self: string;
    homepage: string;
  }

  export interface Name {
    value: string;
  }

  export interface Default {
    url: string;
  }

  export interface RenderModes {
    default: Default;
  }

  export interface Description {
    value: string;
  }

  export interface EditTitle {
    value: string;
  }

  export interface InsertTitle {
    value: string;
  }

  export interface Editor {
    url: string;
    width: string;
    height: string;
    cacheable: boolean;
    editTitle: EditTitle;
    insertTitle: InsertTitle;
  }

  export interface Icon {
    width: number;
    height: number;
    url: string;
  }

  export interface Documentation {
    url: string;
  }

  export interface Name2 {
    value: string;
    i18n: string;
  }

  export interface Parameter {
    identifier: string;
    name: Name2;
    type: string;
    required: boolean;
    multiple: boolean;
    defaultValue: string;
  }

  export interface DynamicContentMacro {
    key: string;
    name: Name;
    renderModes: RenderModes;
    url: string;
    description: Description;
    outputType: string;
    bodyType: string;
    editor: Editor;
    icon: Icon;
    documentation: Documentation;
    categories: string[];
    featured: boolean;
    parameters: Parameter[];
  }

  export interface ContentViewComponent {
    moduleKey: string;
  }

  export interface Item {
    width: number;
    height: number;
    url: string;
  }

  export interface Icons {
    item: Item;
  }

  export interface UiSupport {
    contentViewComponent: ContentViewComponent;
    icons: Icons;
  }

  export interface Indexing {
    enabled: boolean;
  }

  export interface ApiSupport {
    bodyType: string;
    supportedContainerTypes: string[];
    supportedChildTypes: string[];
    indexing: Indexing;
  }

  export interface Name3 {
    value: string;
  }

  export interface CustomContent {
    uiSupport: UiSupport;
    apiSupport: ApiSupport;
    name: Name3;
    key: string;
  }

  export interface Name4 {
    value: string;
  }

  export interface GeneralPage {
    key: string;
    location: string;
    url: string;
    name: Name4;
  }

  export interface Name5 {
    value: string;
  }

  export interface PostInstallPage {
    key: string;
    name: Name5;
    url: string;
  }

  export interface Layout {
    width: string;
    height: string;
  }

  export interface Name6 {
    value: string;
  }

  export interface Params {
    permission: string;
  }

  export interface Condition {
    condition: string;
    params: Params;
  }

  export interface WebPanel {
    url: string;
    location: string;
    layout: Layout;
    weight: number;
    supportsNative: boolean;
    name: Name6;
    key: string;
    conditions: Condition[];
  }

  export interface Modules {
    dynamicContentMacros: DynamicContentMacro[];
    customContent: CustomContent[];
    generalPages: GeneralPage[];
    postInstallPage: PostInstallPage;
    webPanels: WebPanel[];
  }

  export interface ApiMigrations {
    gdpr: boolean;
  }

  export interface Vendor {
    name: string;
    url: string;
  }

  export interface Descriptor {
    key: string;
    name: string;
    description: string;
    baseUrl: string;
    authentication: Authentication;
    lifecycle: Lifecycle;
    enableLicensing: boolean;
    links: Links;
    scopes: string[];
    modules: Modules;
    apiMigrations: ApiMigrations;
    vendor: Vendor;
  }

}
export default descriptorNs;

export interface ILicense {
  key?: string;
  version?: string;
  state?: string;
  host?: IHost;
  license?: {
    active?: boolean;
    type?: string;
    evaluation?: boolean;
    supportEntitlementNumber?: string;
  };
  links?: {
    marketplace?: { href?: string }[];
    self?: { href?: string }[];
  };
}

export interface IContact {
  name?: string;
  email?: string;
}
  
export interface IHost {
  product?: string;
  contacts?: IContact[];
}
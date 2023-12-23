export interface ICustomContentResponseBody {
  id: string;
  body: {
    raw: {
      value: string
    }
  };
  history?:{
    createdBy?: AccountUser,
    contributors?:{
      publishers?:{
        users?:Array<AccountUser>
      }
    }
  };
  container?: { 
    id: string,
    type: string, 
    title: string,
    _links?: {
      self: string,
      webui: string
    }
  };
}

export interface AccountUser {
  accountId: string,
  displayName: string,
  profilePicture?:{
    path: string
  },
  _links?:{
    self: string
  }
}

export interface ICustomContentResponseBodyV2 {
  id: number | string;
  title: string;
  status: string;
  type: string;
  body: {
    raw: {
      value: string;
    }
  },
  pageId: number | string;
  spaceId: number | string;
  authorId: string;
  createdAt: string;
  version: {number: number, createdAt: string, authorId: string};
}
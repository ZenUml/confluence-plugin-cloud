export interface ICustomContentResponseBody {
  id: string;
  body: {
    raw: {
      value: string
    }
  };
  history?:{
    createdBy?: {
      accountId: string,
      displayName: string,
      profilePicture?:{
        path: string
      },
      _links?:{
        self: string
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
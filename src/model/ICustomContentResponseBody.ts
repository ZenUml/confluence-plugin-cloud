export interface ICustomContentResponseBody {
  id: string;
  body: {
    raw: {
      value: string;
    }
  },
  container?: { id: string, type: string };
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
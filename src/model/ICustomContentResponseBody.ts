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
  id: number;
  idString: string;
  title: string;
  status: string;
  type: string;
  body: {
    raw: {
      value: string;
    }
  },
  pageId: number;
  pageIdString: string;
  spaceId: number;
  spaceIdString: string;
  authorId: string;
  createdAt: string;
  version: {number: number, createdAt: string, authorId: string};
}
export interface ICustomContentResponseBody {
  id: string;
  body: {
    raw: {
      value: string;
    }
  },
  container?: { id: string, type: string };
}
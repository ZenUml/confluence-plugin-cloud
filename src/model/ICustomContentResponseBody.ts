export interface ICustomContentResponseBody {
  body: {
    raw: {
      value: string;
    }
  },
  container?: { id: string, type: string };
}
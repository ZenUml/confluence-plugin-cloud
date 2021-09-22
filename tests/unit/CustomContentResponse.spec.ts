// This response is used for both POST (for creating) and GET
interface ICustomContentResponse {
  id: string
}

class CustomContentResponse implements ICustomContentResponse {
  public id: string;
  constructor(id: string) {
    this.id = id;
  }
}

describe('CustomContentResponse', () => {
  it('should return an ID', () => {
    const customContentResponse = new CustomContentResponse('1234');
    expect(customContentResponse.id).toBe('1234');
  })
})
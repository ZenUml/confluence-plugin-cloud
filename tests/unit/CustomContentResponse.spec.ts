// This response is used for both POST (for creating) and GET
interface ICustomContentResponseBody {
  id: string
  raw: { value: string }
}


class CustomContentResponse implements ICustomContentResponseBody {
  public id: string;
  public raw: {value: string} = {value: ''};
  constructor(id: string) {
    this.id = id;
  }

  withValue(value: string) {
    this.raw.value = value;
  }
}

describe('CustomContentResponse', () => {
  it('should have an ID', () => {
    const customContentResponse = new CustomContentResponse('1234');
    expect(customContentResponse.id).toBe('1234');
  })

  it('can have an value', () => {
    const customContentResponse = new CustomContentResponse('1234');
    customContentResponse.withValue('content')
    expect(customContentResponse.raw.value).toBe('content');
  })
})
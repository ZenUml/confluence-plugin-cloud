// This response is used for both POST (for creating) and GET
interface ICustomContentRequest {
  body: {
    raw: {
      representation: string,
      value: string
    }
  }
  container?: {
    id: string,
    type: string
  }
  space?: {
    key: string
  }
  title?: string
  type?: string
}


class CustomContentRequest implements ICustomContentRequest {
  body: {
    raw: {
      representation: string,
      value: string
    }
  };
  container?: { id: string; type: string };
  space?: { key: string };
  title?: string;
  type?: string;

  constructor() {
    this.body = {
      raw: {
        representation: 'raw',
        value: ''
      }
    }
  }
  withValue(value: string): CustomContentRequest {
    this.body.raw.value = value;
    return this;
  }

  inContainer(id: string, type: string): CustomContentRequest {
    this.container = {
      id: id,
      type: type
    };
    return this;
  }

  inSpace(key: string): CustomContentRequest {
    this.space = {
      key: key
    };
    return this;
  }

  withTitle(title: string): CustomContentRequest {
    this.title = title;
    return this;
  }

  asType(type: string): CustomContentRequest {
    this.type = type;
    return this;
  }
}

describe('CustomContentRequest', () => {
  it('value', () => {
    const customContentRequest = new CustomContentRequest();
    customContentRequest
      .withTitle('title')
      .withValue('content')
      .asType('ac:com.zenuml.confluence-addon-lite:zenuml-content-sequence')
      .inContainer('12345', 'page')
      .inSpace('ZS');
    expect(customContentRequest.title).toBe('title');
    expect(customContentRequest.body?.raw.value).toBe('content');
    expect(customContentRequest.container?.id).toBe('12345');
    expect(customContentRequest.container?.type).toBe('page');
    expect(customContentRequest.space?.key).toBe('ZS');
  })
})
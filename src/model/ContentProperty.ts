export class ContentProperty {
  key: string
  value: string | object
  version: {
    number: number
  }

  constructor(key: string, value: string | object, version: { number: number }) {
    this.key = key;
    this.value = value;
    this.version = version;
  }
}
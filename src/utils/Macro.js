import uuidv4 from './uuid'

class Macro {
  EXAMPLE = `// Sample! Declare the participants (optional)
BookService BookRepository Receipt Notification
@Starter(User)
"{id, dueDate, ...}" = BookService.Borrow(id) {
  BookRepository.Update(id, onLoan)

  // Send Event with "Source->Target:Event". "Source->" is optional
  Notification:BOOK_ON_LOAN event with id, due date, etc. 
  new Receipt(id, dueDate)
}
`
  _confluence;
  _key
  constructor(confluence) {
    this._confluence = confluence;
  }

  getMacroBody = () => {
    return new Promise((resolve) => {
      this._confluence.getMacroBody((body) => {
        resolve(body)
      })
    })
  }

  getMacroData = () => {
    return new Promise((resolve => {
      this._confluence.getMacroData((data) => {
        resolve(data)
      })
    }))
  }

  getContentProperty = async () => {
    const macroData = await this.getMacroData();

    const key = macroData?.uuid
    return new Promise((resolve => {
      this._confluence.getContentProperty(key, (cp) => {
        resolve(cp?.value)
      })
    }))
  }

  async load() {
    return await this.getContentProperty() || await this.getMacroBody() || this.EXAMPLE
  }

  onSubmit(code) {
    this._key = this._key || uuidv4()
    this._confluence.saveMacro({uuid: this._key})
    const contentProperty = {
      key: this._key,
      value: code
    }
    this._confluence.setContentProperty(contentProperty)
  }
}
export default Macro
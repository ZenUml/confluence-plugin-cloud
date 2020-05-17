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
      if (!key) {
        resolve(null)
      } else {
        this._confluence.getContentProperty(key, (cp) => {
          resolve(cp)
        })
      }
    }))
  }

  async load() {
    return (await this.getContentProperty())?.value || await this.getMacroBody() || this.EXAMPLE
  }

  async onSubmit(code) {
    const contentProp = await this.getContentProperty();
    const key = contentProp?.key || uuidv4()
    this._confluence.saveMacro({uuid: key, updatedAt: new Date()}, code)
    const versionNumber = contentProp?.version?.number;
    const contentProperty = {
      key: key,
      value: code,
      version: {
        number: versionNumber ? versionNumber + 1 : 1
      }
    }
    this._confluence.setContentProperty(contentProperty)
  }
}
export default Macro
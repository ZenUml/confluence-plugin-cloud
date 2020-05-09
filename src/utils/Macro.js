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
  _store;
  _key
  constructor(confluence, store) {
    this._confluence = confluence;
    this._store = store;
  }

  initialize(data) {
    if (!data) {
      this._store.state.code = this.EXAMPLE
    }
  }

  onSubmit(code) {
    this._key = this._key || uuidv4()
    this._confluence.saveMacro({uuid: this._key})
  }
}
export default Macro
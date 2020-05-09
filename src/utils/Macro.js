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
  _store;
  constructor(store) {
    this._store = store;
  }

  initialize(data) {
    if (!data) {
      this._store.state.code = this.EXAMPLE
    }
  }

  onSubmit() {

  }
}
export default Macro
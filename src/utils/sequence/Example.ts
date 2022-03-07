export default `title Order Service (Demonstration only)
@Actor Client
@Boundary OrderController
@EC2 <<BFF>> OrderService
group BusinessService {
  @Lambda PurchaseService
  @AzureFunction InvoiceService
}
@Entity "order:Order"

@Starter(Client)
//\`POST /orders\`
OrderController.post(payload) {
  OrderService.create(payload) {
    order = new Order(payload)
    if(order != null) {
      par {
        PurchaseService.createPO(order)
        InvoiceService.createInvoice(order)      
      }      
    }
  }
}`
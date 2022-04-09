export default `title Order Service (Demonstration only)
// Styling participants with background colors is an experimental feature.
// This feature is available for users to test and provide feedback.
@Actor Client #FF0000
@Boundary OrderController
@EC2 <<BFF>> OrderService
group BusinessService {
  @Lambda PurchaseService
  @AzureFunction InvoiceService
}

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
import { trackEvent } from './window';
import BaseMacro from './BaseMacro';

class Macro extends BaseMacro {
  EXAMPLE = `@Lambda OrderController
<<BFF>> OrderService
group BusinessService {
  PurchaseService
  InvoiceService
}
//\`POST /orders\`
OrderController.create(payload) {
  OrderService.create(payload) {
    order = new Order(payload)
    par {
      PurchaseService.createPO(order)
      InvoiceService.createInvoice(order)      
    }
  }
}`;

  // eslint-disable-next-line
  constructor(ap = AP) {
    super(ap, 'sequence', 'zenuml-content-sequence');
  }

  async load() {
    const result = await super.load();

    if(!result.mermaidCode && !result.code) {
      trackEvent(this._pageId, 'load_macro', 'default_example');
      result.code = this.EXAMPLE;
    }

    return result;
  }

  async save(code, styles, mermaidCode, diagramType) {
    return await super.save({code, styles, mermaidCode, diagramType});
  }
}

export default Macro
export interface CartItem {
  name: string;
  quantity: string;
}

export class CartItemComponent {
  constructor(private readonly root: WebdriverIO.Element) {}

  private get nameElement() {
    return this.root.$('[data-test="inventory-item-name"]');
  }

  private get quantityElement() {
    return this.root.$('[data-test="item-quantity"]');
  }

  async getDetails(): Promise<CartItem> {
    return {
      name: await this.nameElement.getText(),
      quantity: await this.quantityElement.getText(),
    };
  }
}

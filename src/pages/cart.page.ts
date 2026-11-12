import { $, $$ } from '@wdio/globals';
import { BasePage } from './base.page.js';
import { CartItemComponent, type CartItem } from './components/cart-item.component.js';

export class CartPage extends BasePage {
  protected get pageReadySelector(): string {
    return '[data-test="title"]';
  }

  private get checkoutButton() {
    return $('[data-test="checkout"]');
  }

  private get cartItems() {
    return $$('[data-test="inventory-item"]');
  }

  async getItems(): Promise<CartItem[]> {
    return this.cartItems.map((item) => new CartItemComponent(item).getDetails());
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}

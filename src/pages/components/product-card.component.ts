import type { ChainablePromiseElement } from 'webdriverio';

export class ProductCard {
  constructor(private readonly root: ChainablePromiseElement) {}

  private get nameElement() {
    return this.root.$('[data-test="inventory-item-name"]');
  }

  private get addToCartButton() {
    return this.root.$('[data-test*="add-to-cart"]');
  }

  async getName(): Promise<string> {
    return this.nameElement.getText();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}

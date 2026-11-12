import { $, $$ } from '@wdio/globals';
import { BasePage } from './base.page.js';
import { ProductCard } from './components/product-card.component.js';

export class ProductsPage extends BasePage {
  protected get pageReadySelector(): string {
    return '[data-test="title"]';
  }

  private get productCards() {
    return $$('[data-test="inventory-item"]');
  }

  private get productsHeader() {
    return $('[data-test="title"]');
  }

  private get cartBadge() {
    return $('[data-test="shopping-cart-badge"]');
  }

  private get shoppingCartLink() {
    return $('[data-test="shopping-cart-link"]');
  }

  async isProductsHeaderDisplayed() {
    return await this.productsHeader.isDisplayed();
  }

  async addRandomProduct(excludedNames: readonly string[] = []): Promise<string> {
    const cards = this.productCards;
    const cardCount = await cards.length;
    const candidates: Array<{ card: ProductCard; name: string }> = [];

    for (let index = 0; index < cardCount; index += 1) {
      const card = new ProductCard(cards[index]);
      const name = await card.getName();
      if (!excludedNames.includes(name)) {
        candidates.push({ card, name });
      }
    }

    if (candidates.length === 0) {
      throw new Error('No products are available to add after applying the exclusions.');
    }

    const selectedProduct = candidates[Math.floor(Math.random() * candidates.length)];
    await selectedProduct.card.addToCart();
    return selectedProduct.name;
  }

  async getCartItemCount(): Promise<number> {
    await this.cartBadge.waitForDisplayed();
    const count = Number(await this.cartBadge.getText());
    if (!Number.isInteger(count)) {
      throw new Error(`Expected a numeric cart count, but found "${count}".`);
    }
    return count;
  }

  async openCart() {
    await this.shoppingCartLink.click();
  }
}

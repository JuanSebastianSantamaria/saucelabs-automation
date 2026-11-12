import { $, $$ } from '@wdio/globals';
import { BasePage } from './base.page.js';

export class CheckoutOverviewPage extends BasePage {
  protected get pageReadySelector(): string {
    return '[data-test="title"]';
  }

  private get itemNames() {
    return $$('[data-test="inventory-item-name"]');
  }

  private get finishButton() {
    return $('[data-test="finish"]');
  }

  async getItems(): Promise<string[]> {
    return this.itemNames.map((item) => item.getText());
  }

  async finishPurchase(): Promise<void> {
    await this.finishButton.click();
  }
}

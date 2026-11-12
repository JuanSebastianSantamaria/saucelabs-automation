import { $ } from '@wdio/globals';
import { BasePage } from './base.page.js';

export class CompletePage extends BasePage {
  protected get pageReadySelector(): string {
    return '[data-test="complete-header"]';
  }

  private get confirmationMessage() {
    return $('[data-test="complete-header"]');
  }

  async getConfirmationMessage(): Promise<string> {
    return this.confirmationMessage.getText();
  }
}

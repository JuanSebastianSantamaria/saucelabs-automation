import { $ } from '@wdio/globals';
import { BasePage } from './base.page.js';

export class CheckoutInformationPage extends BasePage {
  protected get pageReadySelector(): string {
    return '[data-test="firstName"]';
  }

  private get firstNameInput() {
    return $('[data-test="firstName"]');
  }

  private get lastNameInput() {
    return $('[data-test="lastName"]');
  }

  private get postalCodeInput() {
    return $('[data-test="postalCode"]');
  }

  private get continueButton() {
    return $('[data-test="continue"]');
  }

  async completeInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.setValue(firstName);
    await this.lastNameInput.setValue(lastName);
    await this.postalCodeInput.setValue(postalCode);
    await this.continueButton.click();
  }
}

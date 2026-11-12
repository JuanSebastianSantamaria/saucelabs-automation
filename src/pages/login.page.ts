import { $ } from '@wdio/globals';
import { BasePage } from './base.page.js';

export class LoginPage extends BasePage {
  protected get pageReadySelector(): string {
    return '[data-test="username"]';
  }

  private get usernameField() {
    return $('[data-test="username"]');
  }

  private get passwordField() {
    return $('[data-test="password"]');
  }

  private get loginButton() {
    return $('[data-test="login-button"]');
  }

  async openLogin(): Promise<void> {
    await this.open('');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameField.setValue(username);
    await this.passwordField.setValue(password);
    await this.loginButton.click();
  }
}

import { $, browser } from '@wdio/globals';

export abstract class BasePage {
  protected abstract get pageReadySelector(): string;

  private get pageReadyElement() {
    return $(this.pageReadySelector);
  }

  async waitUntilLoaded(): Promise<void> {
    await this.pageReadyElement.waitForDisplayed();
  }

  protected async open(path = ''): Promise<void> {
    await browser.url(path);
    await this.waitUntilLoaded();
  }
}

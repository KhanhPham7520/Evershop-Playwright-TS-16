import { expect, Page } from '@playwright/test';
import { CommonPage } from './common-page';

export class NewCategoryPage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  async onPage() {
    const headerXpath = "//h1[contains(concat('', @class, ''), 'page-heading-title')]";
    await expect(this.page.locator(headerXpath)).toBeVisible();
  }
}

import { expect, Page } from '@playwright/test';
import { CommonPage } from './common-page';

/**
 * Example Page Object representing a feature module.
 * Extends CommonPage and provides high-level user actions.
 */
export class SampleFeaturePage extends CommonPage {
  // 1. Cache recurring selectors as class properties
  readonly searchInputSelector = '#field-search';
  readonly tableRowSelector = 'table.item-list tr';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Verifies the user has landed on this page.
   */
  async onPage(expectedTitle?: string): Promise<void> {
    const heading = this.page.locator('h1.page-title');
    await expect(heading).toBeVisible();
    if (expectedTitle) {
      await expect(heading).toContainText(expectedTitle);
    }
  }

  /**
   * High-level business action: Search for an item and submit.
   */
  async searchItem(keyword: string): Promise<void> {
    const searchInput = this.page.locator(this.searchInputSelector);
    await searchInput.fill(keyword);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Selects an item from a table or list by its visible name.
   */
  async selectItemByName(itemName: string): Promise<void> {
    const itemLink = this.page.locator(`//a[normalize-space()='${itemName}']`);
    await itemLink.click();
  }

  /**
   * Uploads an asset (e.g. image, document) via file input.
   */
  async uploadAttachment(relativeFilePath: string): Promise<void> {
    const fileInput = this.page.locator('#file-uploader input[type="file"]');
    await fileInput.setInputFiles(relativeFilePath);
  }

  /**
   * Extracts an entity ID from the current page URL.
   */
  getIdFromUrl(): string {
    const url = this.page.url();
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
}

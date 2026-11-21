import { expect, Page, request } from '@playwright/test';
import { API_URL } from '../utils/constants-utils';
import * as allure from 'allure-js-commons';

/**
 * Base Page Object representing common behaviors, selectors, and API helpers.
 * All feature page objects must extend this class.
 */
export class CommonPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Fills an input textbox or textarea located by name, id, or label.
   */
  async inputTextboxByLabel(label: string, input: string) {
    await allure.step(`Input "${input}" into field "${label}"`, async () => {
      const xpathTextbox = `//input[@name='${label}']`;
      const xpathTextarea = `//textarea[@id='${label}']`;
      const inputLocator = this.page.locator(`${xpathTextbox} | ${xpathTextarea}`).first();

      await this.page.waitForTimeout(100);
      await inputLocator.click();
      await this.page.waitForTimeout(100);
      await inputLocator.clear();
      await this.page.waitForTimeout(100);
      await inputLocator.fill(input);
    });
  }

  /**
   * Clicks a button by its visible text or value attribute.
   */
  async clickButtonByLabel(label: string) {
    await allure.step(`Click button "${label}"`, async () => {
      const xpath = `//*[(@role='button' or self::button or self::input) and (normalize-space()='${label}' or @value='${label}')]`;
      await this.page.locator(xpath).click();
    });
  }

  /**
   * Verifies an inline error message associated with a field label.
   */
  async verifyFieldErrorMessageByLabel(label: string, message: string, page: Page = this.page) {
    const xpath = `//label[normalize-space()='${label}']/following::div[contains(concat(' ', @class, ' '), ' field-error ') and normalize-space()='${message}']`;
    await expect(page.locator(xpath)).toBeVisible();
  }

  /**
   * Clicks a navigation menu item by label.
   */
  async clickMenuItemByLabel(label: string) {
    const xpath = `//nav//a[normalize-space()='${label}'] | //div[contains(@class, 'nav')]//a[normalize-space()='${label}']`;
    await this.page.locator(xpath).click();
  }

  /**
   * Selects an item from a custom dropdown.
   */
  async selectDropdownItemByLabel(label: string, item: string) {
    await this.page.getByLabel(label).click();
    await this.page.getByRole('option', { name: item }).click();
  }

  /**
   * Selects a radio button matching a specific label and option name.
   */
  async selectRadioButtonByLabel(label: string, item: string) {
    const xpath = `//label[contains(normalize-space(), '${label}')]//following::label[normalize-space()='${item}']`;
    await this.page.locator(xpath).click();
  }

  /**
   * Verifies an alert / toast notification message.
   */
  async verifyNotificationMessage(message: string) {
    await expect(this.page.getByRole('alert')).toContainText(message);
  }

  /**
   * Retrieves the current string value of a textbox or textarea by label.
   */
  async getTextboxValueByLabel(label: string): Promise<string> {
    const xpathTextbox = `//input[@name='${label}']`;
    const xpathTextarea = `//textarea[@id='${label}']`;
    const inputLocator = this.page.locator(`${xpathTextarea} | ${xpathTextbox}`).first();
    return inputLocator.inputValue();
  }

  /**
   * Extracts authentication cookies from the current browser context.
   */
  async getCookie(): Promise<string> {
    const cookies = await this.page.context().cookies();
    return cookies.map((c) => `${c.name}=${c.value}`).join('; ');
  }

  /**
   * Example API Helper: Deletes an entity by ID directly via REST API.
   */
  async deleteEntityById(cookie: string, endpoint: string, id: string): Promise<void> {
    const apiContext = await request.newContext();
    await apiContext.delete(`${API_URL}${endpoint}/${id}`, {
      headers: {
        Cookie: cookie,
      },
    });
  }

  /**
   * Example API Helper: Creates an entity directly via REST API.
   */
  async createEntity(cookie: string, endpoint: string, body: any): Promise<any> {
    const apiContext = await request.newContext();
    const response = await apiContext.post(`${API_URL}${endpoint}`, {
      headers: {
        Cookie: cookie,
        'Content-Type': 'application/json',
      },
      data: body,
    });
    return response.json();
  }
}

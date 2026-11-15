import { expect, Page } from "@playwright/test";
import { CommonPage } from "./common-page";

export class LoginPage extends CommonPage {

    constructor(page: Page) {
        super(page);
    }

    async login(username: string, password: string) {
        await this.inputTextboxByLabel("email", username);
        await this.inputTextboxByLabel("password", password);
        await this.clickButtonByLabel("Sign In");
    }

    async verifyFieldErrorMessageByLabel(label: string, message: string) {
        let xpath = `//label[normalize-space()='${label}']/following::div[contains(concat(' ', @class, ' '),'field-error') and (normalize-space()='${message}')]`;
        await expect(this.page.locator(xpath)).toBeVisible();
    }
}

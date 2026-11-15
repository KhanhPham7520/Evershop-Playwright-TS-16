import { expect, Page, request } from "@playwright/test";
import { API_URL } from "../utils/constants-utils";

export class CommonPage {

    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async inputTextboxByLabel(label: string, input: string) {
        let xpathTextbox = `//input[@name='${label}']`;
        let xpathTextarea = `//textarea[@id='${label}']`;
        let inputLocator = this.page
            .locator(`${xpathTextbox} | ${xpathTextarea}`)
            .first();

        await inputLocator.click();
        await inputLocator.clear();
        await inputLocator.fill(input);
    }

    async clickButtonByLabel(label: string) {
        let xpath = `//*[(@role='button' or self::button or self::input) and (normalize-space()='${label}' or @value='${label}')]`;
        await this.page.locator(xpath).click();
    }

    async verifyFieldErrorMessageByLabel(
        label: string,
        message: string,
        page: Page,
    ) {
        let xpath = `//label[normalize-space()='${label}']/following::div[contains(concat(' ', @class, ' '),'field-error') and (normalize-space()='${message}')]`;
        await expect(page.locator(xpath)).toBeVisible();
    }

    async clickMenuItemByLabel(label: string) {
        let xpath = `//div[contains(concat('',@class,''), 'admin-nav')]//a[normalize-space()='${label}']`;
        await this.page.locator(xpath).click();
    }

    async selectDropdownItemByLabel(label: string, item: string) {
        await this.page.getByLabel(`${label}`).click();
        await this.page.getByRole('option', { name: `${item}` }).click();
    }

    async selectCategory(category: string) {
        await this.page.getByRole("link", { name: "Select category" }).click();
        let searchCategoryInput = await this.page.getByPlaceholder("Search categories");
        await searchCategoryInput.clear();
        await searchCategoryInput.click();
        await searchCategoryInput.fill(category);
        let selectButtonXpath = `(//h3[normalize-space()='${category}']//following::div[normalize-space()='Select'])[1]`;
        await this.page.locator(selectButtonXpath).click();
    }

    async verifyNotificationMessage(message: string) {
        await expect(this.page.getByRole("alert", { name: message }));
    }

    async selectRadioButtonByLabel(label: string, item: string) {
        let xpath = `//label[contains(normalize-space(),'${label}')]//following::div//child::label[normalize-space()='${item}']`;
        await this.page.locator(xpath).click();
    }

    async getTextboxValueByLabel(label: string) {
        let xpathTextbox = `//input[@name=${label}]`;
        let xpathTextarea = `//textarea[@id=${label}]`;
        let inputLocator = this.page.locator(`${xpathTextarea} | ${xpathTextbox}`).first();
        return inputLocator.inputValue();
    }

    async getCookie() {
        const cookies = await this.page.context().cookies();
        return cookies.map((c) => `${c.name}=${c.value}`).join('; ');
    }

    async deleteProductById(cookie: string, productId: string) {
        const req = await request.newContext();
        const res = await req.delete(`${API_URL}/api/products/${productId}`, {
            headers: { Cookie: cookie },
        });
        console.log(res.status(), await res.json());
        await req.dispose();
        return res;
    }

    async createNewProduct(cookie: string, requestBody: any) {
        let req = await request.newContext();
        let response = await req.post(`${API_URL}/api/products`, {
            headers: {
                cookies: cookie,
            },
            data: requestBody
        });

        return response;
    }
}

import { expect, test } from "@playwright/test";
import { ADMIN_PASSWORD, ADMIN_USERNAME, URL } from "../../../src/utils/constants-utils";
import createProductBody from "../../../data/product/create-product-request-body.json"
import { UIManager } from "../../../src/pages/ui-manager";

let ui: UIManager;
let productIds: string[] = [];
let cookie: string
test.beforeEach(async ({ page }) => {
    ui = new UIManager(page);
    await page.goto(URL);
    await ui.loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
    cookie = await ui.loginPage.getCookie();
});

test.afterAll(() => {
    for (let id of productIds) {
        ui.editProductPage.deleteProductById(cookie, id);
    }
})

test("Verify edit product successful", async ({page}) => {
    await ui.dashboardPage.onPage();

    let createProductRequestBody = ui.dashboardPage.buildCreateProductBody(createProductBody);

    const productName = createProductBody.name;
    await ui.dashboardPage.createNewProduct(cookie, createProductRequestBody);

    await ui.newProductPage.clickMenuItemByLabel('Products');
    await ui.productPage.onPage();
    await ui.productPage.searchProduct(productName);
    await ui.productPage.selectProductByName(productName);
    await ui.editProductPage.onPage(productName);

    let productId = ui.editProductPage.getProductIdFromUrl();
    const newProductName = `IPhone ${new Date().getTime()}`;
    await ui.editProductPage.inputTextboxByLabel('Name', newProductName);
    await ui.editProductPage.clickButtonByLabel('Save');
    await ui.newProductPage.verifyNotificationMessage('Product saved successfully!');
    await ui.page.reload();
    expect(await ui.editProductPage.getTextboxValueByLabel('Name')).toEqual(newProductName);
    productIds.push(productId);
});

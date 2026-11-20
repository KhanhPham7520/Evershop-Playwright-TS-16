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

    // let createProductRequestBody = dashboardPage.buildCreateProductBody();

    const random = new Date().getTime();
    const productName = `Iphone ${random}`;
    const sku = `SKU-${random}`;
    const urlKey = `iphone-18-pro-max-${random}`;

    createProductBody.name = productName;
    createProductBody.sku = sku;
    createProductBody.url_key = urlKey;

    let response = await ui.dashboardPage.createNewProduct(cookie, createProductBody);
    expect(response.ok()).toBeTruthy();

    await ui.newProductPage.clickMenuItemByLabel('Products');
    await ui.productPage.onPage();
    await ui.productPage.searchProduct(random.toString());
    await ui.productPage.selectProductByName(productName);
    await ui.editProductPage.onPage(productName);

    let productId = ui.editProductPage.getProductIdFromUrl();
    const newProductName = `IPhone ${new Date().getTime()}`;
    await ui.editProductPage.inputTextboxByLabel('Name', newProductName);
    await ui.editProductPage.clickButtonByLabel('Save');
    await ui.newProductPage.verifyNotificationMessage('Product saved successfully!');
    await page.reload();
    expect(await ui.editProductPage.getTextboxValueByLabel('Name')).toEqual(newProductName);

    productIds.push(productId);
});

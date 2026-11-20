import { adminTest } from "../../../src/fixtures/admin-fixtures";
import { UIManager } from "../../../src/pages/ui-manager";

let localUi: UIManager;
let productIds: string[] = [];
let localCookie: string;

adminTest.beforeEach(async ({ cookie, ui }) => {
    localUi = ui;
    localCookie = cookie;
});


adminTest.afterAll(() => {
    for (let id of productIds) {
      localUi.editProductPage.deleteProductById(localCookie, id);
    }
})

adminTest("Verify error when server return error", async ({page}) => {
    await localUi.dashboardPage.onPage();
    await localUi.dashboardPage.clickMenuItemByLabel("New Product");
    await localUi.dashboardPage.onPage();
    const random = new Date().getTime();
    const productName = `Iphone ${random}`;
    const sku = `SKU-${random}`;

    await localUi.newProductPage.inputTextboxByLabel("name", productName);
    await localUi.newProductPage.inputTextboxByLabel("sku", sku);
    await localUi.newProductPage.inputTextboxByLabel("price", "1500");
    await localUi.newProductPage.inputTextboxByLabel("weight", "0.05");

    await localUi.newProductPage.selectDropdownItemByLabel("Tax Class", "Taxable Goods");

    await localUi.newProductPage.uploadProductImage("data/upload/iphone-17-pro-max-cam.jpg");
    await localUi.newProductPage.selectRadioButtonByLabel("Status", "Disabled");
    await localUi.newProductPage.selectRadioButtonByLabel("Visibility", "Not visible individually");
    await localUi.newProductPage.selectRadioButtonByLabel("Manage Stock", "In Stock");
    await localUi.newProductPage.selectRadioButtonByLabel("Stock Availability", "In Stock");
    await localUi.newProductPage.inputTextboxByLabel("qty", "100");

    await localUi.newProductPage.inputTextboxByLabel("url_key", `iphone-17-pro-max-${random}`);
    await localUi.newProductPage.inputTextboxByLabel("meta_title", "Iphone 17 Pro Max");
    await localUi.newProductPage.inputTextboxByLabel("field-meta_description", "Iphone 17 pro max description");

    page.route('**/api/products', async route => {
        await route.fulfill({
            status: 500,
            contentType: 'application/json',
            json: {
                error: {
                    status: 500,
                    message : "Detailed error message describing what went wrong"
                }
            }
        });
    })
    
    await localUi.newProductPage.clickButtonByLabel("Save");
    await localUi.newProductPage.verifyNotificationMessage('Detailed error message describing what went wrong')
});

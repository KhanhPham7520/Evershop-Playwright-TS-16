import { expect, test } from "@playwright/test";
import { UIManager } from "../../../src/pages/ui-manager";
import { adminTest } from "../../../src/fixtures/admin-fixtures";

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

adminTest("Verify create a new product successful", async ({ui, page,request,context, cookie}) => {
    await ui.dashboardPage.onPage();
    await ui.dashboardPage.clickMenuItemByLabel("New Product");
    await ui.dashboardPage.onPage();
    const random = new Date().getTime();
    const productName = `Iphone ${random}`;
    const sku = `SKU-${random}`;

    await ui.newProductPage.inputTextboxByLabel("name", productName);
    await ui.newProductPage.inputTextboxByLabel("sku", sku);
    await ui.newProductPage.inputTextboxByLabel("price", "1500");
    await ui.newProductPage.inputTextboxByLabel("weight", "0.05");

    await ui.newProductPage.selectDropdownItemByLabel("Tax Class", "Taxable Goods");

    await ui.newProductPage.uploadProductImage("data/upload/iphone-17-pro-max-cam.jpg");
    await ui.newProductPage.selectRadioButtonByLabel("Status", "Disabled");
    await ui.newProductPage.selectRadioButtonByLabel("Visibility", "Not visible individually");
    await ui.newProductPage.selectRadioButtonByLabel("Manage Stock", "In Stock");
    await ui.newProductPage.selectRadioButtonByLabel("Stock Availability", "In Stock");
    await ui.newProductPage.inputTextboxByLabel("qty", "100");

    await ui.newProductPage.inputTextboxByLabel("url_key", `iphone-17-pro-max-${random}`);
    await ui.newProductPage.inputTextboxByLabel("meta_title", "Iphone 17 Pro Max");
    await ui.newProductPage.inputTextboxByLabel("field-meta_description", "Iphone 17 pro max description");

    await ui.newProductPage.clickButtonByLabel("Save");
    await ui.newProductPage.verifyNotificationMessage("Product saved successfully!");
    await ui.newProductPage.clickMenuItemByLabel("Products");
    await ui.productPage.onPage();

    await ui.productPage.searchProduct(productName);
    await ui.productPage.selectProductByName(productName);
    await ui.editProductPage.onPage(productName);

    let productId = ui.editProductPage.getProductIdFromUrl();

    expect(await ui.editProductPage.getTextboxValueByLabel("name")).toEqual(productName);
    expect(await ui.editProductPage.getTextboxValueByLabel("sku")).toEqual(sku);
    expect(await ui.editProductPage.getTextboxValueByLabel("price")).toEqual("1500");
    expect(await ui.editProductPage.getTextboxValueByLabel("weight")).toEqual("0.05");

    productIds.push(productId);
});

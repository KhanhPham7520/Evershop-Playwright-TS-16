import { expect, test } from "@playwright/test";
import { ADMIN_PASSWORD, ADMIN_USERNAME, URL } from "../../../src/utils/constants-utils";
import { ProductPage } from "../../../src/pages/products-page";
import { EditProductPage } from "../../../src/pages/edit-product-page";
import { LoginPage } from "../../../src/pages/login-page";
import { NewProductPage } from "../../../src/pages/new-product-page";
import { DashboardPage } from "../../../src/pages/dashboard-page";

let newProductPage: NewProductPage;
let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let productPage: ProductPage;
let editProductPage: EditProductPage;
let productIds: string[] = [];
let cookie: string;

test.beforeEach(async ({ page }) => {
    newProductPage = new NewProductPage(page);
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    dashboardPage = new DashboardPage(page);
    editProductPage = new EditProductPage(page);
    await page.goto(URL);
    await loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
    cookie = await loginPage.getCookie();
});

test.afterAll(() => {
    for (let id of productIds) {
      editProductPage.deleteProductById(cookie, id);
    }
})


test("Verify create a new product successful", async () => {
    await dashboardPage.onPage();
    await dashboardPage.clickMenuItemByLabel("New Product");
    await dashboardPage.onPage();
    const random = new Date().getTime();
    const productName = `Iphone ${random}`;
    const sku = `SKU-${random}`;

    await newProductPage.inputTextboxByLabel("name", productName);
    await newProductPage.inputTextboxByLabel("sku", sku);
    await newProductPage.inputTextboxByLabel("price", "1500");
    await newProductPage.inputTextboxByLabel("weight", "0.05");

    await newProductPage.selectDropdownItemByLabel("Tax Class", "Taxable Goods");

    await newProductPage.uploadProductImage("data/upload/iphone-17-pro-max-cam.jpg");
    await newProductPage.selectRadioButtonByLabel("Status", "Disabled");
    await newProductPage.selectRadioButtonByLabel("Visibility", "Not visible individually");
    await newProductPage.selectRadioButtonByLabel("Manage Stock", "In Stock");
    await newProductPage.selectRadioButtonByLabel("Stock Availability", "In Stock");
    await newProductPage.inputTextboxByLabel("qty", "100");

    await newProductPage.inputTextboxByLabel("url_key", `iphone-17-pro-max-${random}`);
    await newProductPage.inputTextboxByLabel("meta_title", "Iphone 17 Pro Max");
    await newProductPage.inputTextboxByLabel("field-meta_description", "Iphone 17 pro max description");

    await newProductPage.clickButtonByLabel("Save");
    await newProductPage.verifyNotificationMessage("Product saved successfully!");
    await newProductPage.clickMenuItemByLabel("Products");
    await productPage.onPage();

    await productPage.searchProduct(productName);
    await productPage.selectProductByName(productName);
    await editProductPage.onPage(productName);

    let productId = editProductPage.getProductIdFromUrl();

    expect(await editProductPage.getTextboxValueByLabel("name")).toEqual(productName);
    expect(await editProductPage.getTextboxValueByLabel("sku")).toEqual(sku);
    expect(await editProductPage.getTextboxValueByLabel("price")).toEqual("1500");
    expect(await editProductPage.getTextboxValueByLabel("weight")).toEqual("0.05");

    productIds.push(productId);

});

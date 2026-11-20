import { expect, test } from "@playwright/test";
import { ADMIN_PASSWORD, ADMIN_USERNAME, URL } from "../../../src/utils/constants-utils";
import { ProductPage } from "../../../src/pages/products-page";
import { EditProductPage } from "../../../src/pages/edit-product-page";
import { LoginPage } from "../../../src/pages/login-page";
import { NewProductPage } from "../../../src/pages/new-product-page";
import { DashboardPage } from "../../../src/pages/dashboard-page";
import createProductBody from "../../../data/product/create-product-request-body.json"

let newProductPage: NewProductPage;
let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let productPage: ProductPage;
let editProductPage: EditProductPage;
let productIds: string[] = [];
let cookie: string
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

test("Verify edit product successful", async ({page}) => {
    await dashboardPage.onPage();

    const random = new Date().getTime();
    const productName = `Iphone ${random}`;
    const sku = `SKU-${random}`;
    const urlKey = `iphone-18-pro-max-${random}`;

    createProductBody.name = productName;
    createProductBody.sku = sku;
    createProductBody.url_key = urlKey;

    console.log();

    let response = await dashboardPage.createNewProduct(cookie, createProductBody);
    expect(response.ok()).toBeTruthy();

    await newProductPage.clickMenuItemByLabel('Products');
    await productPage.onPage();
    await productPage.searchProduct(random.toString());
    await productPage.selectProductByName(productName);
    await editProductPage.onPage(productName);

    let productId = editProductPage.getProductIdFromUrl();
    const newProductName = `IPhone ${new Date().getTime()}`;
    await editProductPage.inputTextboxByLabel('Name', newProductName);
    await editProductPage.clickButtonByLabel('Save');
    await newProductPage.verifyNotificationMessage('Product saved successfully!');
    await page.reload();
    expect(await editProductPage.getTextboxValueByLabel('Name')).toEqual(newProductName);

    productIds.push(productId);
});

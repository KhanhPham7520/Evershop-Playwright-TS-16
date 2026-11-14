import { expect, test } from "@playwright/test";
import {ADMIN_PASSWORD,ADMIN_USERNAME, URL } from "../../../src/utils/constants-utils";
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
let cookie:string;

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
    for(let id of productIds){
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

    await newProductPage.inputTextboxByLabel("Name", productName);
    await newProductPage.inputTextboxByLabel("SKU", sku);
    await newProductPage.inputTextboxByLabel("Price", "1500");
    await newProductPage.inputTextboxByLabel("Weight", "0.05");
    await newProductPage.selectDropdownItemByLabel("Tax class", "Taxable Goods");
    await newProductPage.uploadProductImage("/data/upload/iPhone-16-pro.webp");
    await newProductPage.selectRadioButtonByLabel("Status", "Disabled");
    await newProductPage.selectRadioButtonByLabel("Visibility", "Not visible");
    await newProductPage.selectRadioButtonByLabel("Manage stock?", "No");
    await newProductPage.selectRadioButtonByLabel("Stock availability", "No");
    await newProductPage.inputTextboxByLabel("Quantity", "100");
    await newProductPage.selectDropdownItemByLabel("Attribute group", "Default");
    await newProductPage.selectDropdownItemByLabel("Color", "Black");
    await newProductPage.selectDropdownItemByLabel("Size", "XXL");

    await newProductPage.inputTextboxByLabel("Url key",`iphone-18-pro-max-${random}`);
    await newProductPage.inputTextboxByLabel("Meta title", "Iphone 18 Pro Max");
    await newProductPage.inputTextboxByLabel("Meta keywords", "Iphone 18 pro max");
    await newProductPage.inputTextboxByLabel("Meta description","Iphone 18 pro max description");

    await newProductPage.clickButtonByLabel("Save");
    await newProductPage.verifyNotificationMessage("Product saved successfully!");
    await newProductPage.clickMenuItemByLabel("Products");
    await productPage.onPage();
    await productPage.searchProduct(productName);
    await productPage.selectProductByName(productName);
    await editProductPage.onPage(productName);

    let productId = editProductPage.getProductIdFromUrl();

    expect(await editProductPage.getTextboxValueByLabel("Name")).toEqual(productName);
    expect(await editProductPage.getTextboxValueByLabel("SKU")).toEqual(sku);
    expect(await editProductPage.getTextboxValueByLabel("Price")).toEqual("1500");
    expect(await editProductPage.getTextboxValueByLabel("Weight")).toEqual("0.05");
    
   productIds.push(productId);

});

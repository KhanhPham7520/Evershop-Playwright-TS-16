import { Page } from "@playwright/test";
import { LoginPage } from "./login-page";
import { EditProductPage } from "./edit-product-page";
import { DashboardPage } from "./dashboard-page";
import { NewProductPage } from "./new-product-page";
import { ProductPage } from "./products-page";

export class UIManager {
    
    page: Page;
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    newProductPage: NewProductPage;
    editProductPage: EditProductPage;
    productPage: ProductPage;
    
    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.dashboardPage = new DashboardPage(page);
        this.newProductPage = new NewProductPage(page);
        this.editProductPage = new EditProductPage(page);
        this.productPage = new ProductPage(page);
    }
}

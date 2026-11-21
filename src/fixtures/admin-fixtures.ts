import { test } from "@playwright/test";
import { UIManager } from "../pages/ui-manager";
import { ADMIN_PASSWORD, ADMIN_USERNAME, URL } from "../utils/constants-utils";

type AdminFixture = {
    ui: UIManager;
    cookie: string
}

export const adminTest = test.extend<AdminFixture>({
    page: async ({page}, use, testInfo){
        await use(page);
        if(testInfo.status !== 'passed'){
            await testInfo.attach('screenshot', {
                body: (await page.screenshot({fullPage: true})),
                contentType: 'image/png'
            });
        }
    },
    ui: async({page}, use) => {
        let ui = new UIManager(page);
        await page.goto(URL);
        await ui.loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
        await use(ui);
    },
    cookie: async ({ui}, use) => {
        let cookie = await ui.loginPage.getCookie();
        await use(cookie);
    }
});
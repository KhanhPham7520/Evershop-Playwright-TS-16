import { test as baseTest } from '@playwright/test';
import { UIManager } from '../pages/ui-manager';
import { APP_URL, ADMIN_USERNAME, ADMIN_PASSWORD } from '../utils/constants-utils';

/**
 * Fixture type definition.
 */
type AppFixtures = {
  ui: UIManager;
  cookie: string;
};

/**
 * Custom test fixture extending base Playwright test.
 * Provides pre-authenticated UI facade, session tokens, and automatic failure screenshots.
 */
export const appTest = baseTest.extend<AppFixtures>({
  // 1. Auto-attach full-page screenshot on test failure
  page: async ({ page }, use, testInfo) => {
    await use(page);
    if (testInfo.status !== 'passed') {
      await testInfo.attach('failure-screenshot', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    }
  },

  // 2. Pre-authenticate user and inject UIManager facade
  ui: async ({ page }, use) => {
    const ui = new UIManager(page);
    await page.goto(APP_URL);
    // Perform authentication step
    await ui.commonPage.inputTextboxByLabel('email', ADMIN_USERNAME);
    await ui.commonPage.inputTextboxByLabel('password', ADMIN_PASSWORD);
    await ui.commonPage.clickButtonByLabel('Sign In');
    await use(ui);
  },

  // 3. Extract and expose session cookies / tokens for API calls
  cookie: async ({ ui }, use) => {
    const cookieString = await ui.commonPage.getCookie();
    await use(cookieString);
  },
});

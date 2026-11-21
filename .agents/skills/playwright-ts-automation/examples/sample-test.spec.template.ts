import { appTest } from '../../../src/fixtures/app-fixtures';
import { UIManager } from '../../../src/pages/ui-manager';
import samplePayload from '../../../data/sample/sample-payload.json';

/**
 * Suite-level references to enable cleanup in afterAll.
 */
let localUi: UIManager;
let localCookie: string;
const createdEntityIds: string[] = [];

appTest.beforeEach(async ({ ui, cookie }) => {
  localUi = ui;
  localCookie = cookie;
});

appTest.afterAll(async () => {
  // Always clean up resources created during tests
  for (const id of createdEntityIds) {
    try {
      await localUi.commonPage.deleteEntityById(localCookie, '/api/entities', id);
    } catch (err) {
      console.warn(`Failed to cleanup entity ${id}:`, err);
    }
  }
});

appTest('Verify create and verify entity successfully', async ({ ui }) => {
  // 1. Generate unique test data using timestamps to prevent collisions
  const random = Date.now();
  const entityName = `Item-${random}`;
  const entityCode = `CODE-${random}`;

  // 2. Perform user journey actions using Page Object methods
  await ui.sampleFeaturePage.clickMenuItemByLabel('Inventory');
  await ui.sampleFeaturePage.clickButtonByLabel('New Item');

  await ui.sampleFeaturePage.inputTextboxByLabel('name', entityName);
  await ui.sampleFeaturePage.inputTextboxByLabel('code', entityCode);
  await ui.sampleFeaturePage.clickButtonByLabel('Save');

  // 3. Verify success notification and state
  await ui.sampleFeaturePage.verifyNotificationMessage('Item saved successfully');

  // 4. Capture created ID for teardown
  const createdId = ui.sampleFeaturePage.getIdFromUrl();
  createdEntityIds.push(createdId);
});

appTest('Verify edit entity flow using hybrid API setup + UI edit', async ({ ui, cookie }) => {
  // 1. Fast API setup
  const random = Date.now();
  const initialName = `PreCreated-${random}`;
  const response = await ui.commonPage.createEntity(cookie, '/api/entities', {
    ...samplePayload,
    name: initialName,
  });
  createdEntityIds.push(response.id);

  // 2. UI interaction & assertion
  await ui.sampleFeaturePage.clickMenuItemByLabel('Inventory');
  await ui.sampleFeaturePage.searchItem(initialName);
  await ui.sampleFeaturePage.selectItemByName(initialName);

  const updatedName = `Updated-${random}`;
  await ui.sampleFeaturePage.inputTextboxByLabel('name', updatedName);
  await ui.sampleFeaturePage.clickButtonByLabel('Save');

  await ui.sampleFeaturePage.verifyNotificationMessage('Item updated successfully');
});

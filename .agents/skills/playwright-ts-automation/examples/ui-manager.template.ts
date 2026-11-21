import { Page } from '@playwright/test';
import { CommonPage } from './common-page';
import { SampleFeaturePage } from './sample-feature-page';

/**
 * UIManager Facade
 * Instantiates and aggregates all Page Objects under a single facade.
 * Injected into test specs via custom fixtures.
 */
export class UIManager {
  readonly page: Page;
  readonly commonPage: CommonPage;
  readonly sampleFeaturePage: SampleFeaturePage;

  constructor(page: Page) {
    this.page = page;
    this.commonPage = new CommonPage(page);
    this.sampleFeaturePage = new SampleFeaturePage(page);
  }
}

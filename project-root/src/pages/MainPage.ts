import { Page, Locator } from '@playwright/test';
import { AppSettings, ApiService } from '../config/app-settings';
import { JsonFileReader } from '../utils/data-reader';

export class MainPage {


    private readonly fileReader = new JsonFileReader();

    constructor(private readonly page: Page) {}

  get mainPageText(): Locator {
    return this.page.locator('//span[@data-test="title"]');	
  }

  get resetAppButton(): Locator {
    return this.page.locator('//a[@data-test="reset-sidebar-link"]');	
  }

  get logOutButton(): Locator {
    return this.page.locator('//a[@data-test="logout-sidebar-link"]');	
  }

  get hamburgerMenuButton(): Locator {
    return this.page.locator('//button[@id="react-burger-menu-btn"]');	
  }

  get addCartButton(): Locator {
    return this.page.locator('//button[text()="Add to cart"]');
  }

  get removeCartButton(): Locator {
    return this.page.locator('//button[text()="Remove"]');
  }

  get shopCartIndicator(): Locator {
    return this.page.locator('[data-test="shopping-cart-badge"]');
  }

  async getMainPageText(): Promise<string> {
    await this.mainPageText.waitFor({ state: 'visible' });
    return await this.mainPageText.textContent() ?? '';	
  }

  async getShopCartIndicatorText(): Promise<string> {
    await this.shopCartIndicator.waitFor({ state: 'visible' });
    return await this.shopCartIndicator.textContent() ?? '';	
  }

  async resetAppState(): Promise<void> {
    await this.hamburgerMenuButton.waitFor({ state: 'visible' });
    await this.hamburgerMenuButton.click();
    await this.resetAppButton.waitFor({ state: 'visible' });
    await this.resetAppButton.click();
  }

  async logOut(): Promise<void> {
    await this.hamburgerMenuButton.waitFor({ state: 'visible' });
    await this.hamburgerMenuButton.click();
    await this.logOutButton.waitFor({ state: 'visible' });
    await this.logOutButton.click();
  }
  
 async clickAllButtons(locator:Locator): Promise<void> {
    await locator.first().waitFor({ state: 'visible' });
   
    while (await locator.count() > 0) {
    await locator.first().click();
    }
  }
}
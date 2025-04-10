import { Page, Locator } from '@playwright/test';
import { AppSettings, ApiService } from '../config/app-settings';
import { JsonFileReader } from '../utils/data-reader';
import path from 'path';

export class LoginPage {

    private static readonly SETTINGS_FILE = path.resolve(__dirname, '../../../appSettings.json');
    private readonly baseUiUrl: string;
    private readonly fileReader = new JsonFileReader();




    constructor(private readonly page: Page) {
    const settings = this.fileReader.readFile(LoginPage.SETTINGS_FILE) as AppSettings;
    this.baseUiUrl = settings.baseUrls[ApiService.BaseUiUrl];
  }

  get usernameInput(): Locator {
    return this.page.locator('[data-test="username"]');
  }

  get passwordInput(): Locator {
    return this.page.locator('[data-test="password"]');
  }

  get loginButton(): Locator {
    return this.page.locator('//input[@data-test="login-button"]');
  }

  get loginErrorMessage(): Locator {
    return this.page.locator('[data-test="error"]');
  }

  async goToLoginPage(): Promise<void> {
    await this.page.goto(this.baseUiUrl);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessagetext(): Promise<string> {
    await this.loginErrorMessage.waitFor({ state: 'visible' });
    return await this.loginErrorMessage.textContent() ?? '';
  }
}
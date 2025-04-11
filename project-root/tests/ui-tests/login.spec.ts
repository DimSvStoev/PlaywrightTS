import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/loginPage';
import { MainPage } from '../../src/pages/MainPage';
import path from 'path';
import { JsonFileReader } from '../../src/utils/data-reader';

const dataFile = path.resolve(__dirname, '../../src/test-data/UI-testData.json');
const fileReader = new JsonFileReader();

interface TestUser {
  username: string;
  password: string;
  shouldLogin?: boolean;
  message?: string;
}

interface TypeOfTestData {
  users: TestUser[];
}

const testData = fileReader.readFile(dataFile) as TypeOfTestData;

test.describe('🔐 Data-Driven Login Form Tests', () => {
  testData.users.forEach((user, index) => {
    test(`Login #${index + 1}: "${user.username ?? '<empty>'}" should ${user.shouldLogin ? 'succeed' : 'fail'}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const mainPage = new MainPage(page);
      await loginPage.goToLoginPage();
      await loginPage.login(user.username, user.password);

      if (user.shouldLogin == false) {
        expect(await loginPage.getErrorMessagetext()).toBe(user.message);
      } else {
        expect(await mainPage.getMainPageText()).toBe('Products');
      }
    });
  });

    test('logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const mainPage = new MainPage(page);
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await mainPage.logOut();

  });
});


test.describe('addElementToCart', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Add all elements to cart', async ({ page }) => {
    const mainPage = new MainPage(page);
    const addCartButtonCounter:number = await mainPage.addCartButton.count();
    await mainPage.clickAllButtons(mainPage.addCartButton);
    expect(await mainPage.removeCartButton.count()).toBe(addCartButtonCounter);
    expect(parseInt( await mainPage.getShopCartIndicatorText())).toBe(addCartButtonCounter);
  });

  test('Remove all cart items from remove button', async ({ page }) => {
    const mainPage = new MainPage(page);
    const addCartButtonCounter:number = await mainPage.addCartButton.count();
    await mainPage.clickAllButtons(mainPage.addCartButton);
    await mainPage.clickAllButtons(mainPage.removeCartButton);

    expect(await mainPage.addCartButton.count()).toBe(addCartButtonCounter);
    //expect(await mainPage.shopCartIndicator).toBeHidden();
  });

  test('Remove all cart items from reset app state funcitonality', async ({ page }) => {
    const mainPage = new MainPage(page);
    const addCartButtonCounter:number = await mainPage.addCartButton.count();
    await mainPage.clickAllButtons(mainPage.addCartButton);
    await mainPage.resetAppState();

    //expect(await mainPage.addCartButton.count()).toBe(addCartButtonCounter);
    //expect(await mainPage.shopCartIndicator).toBeHidden();
  });
});
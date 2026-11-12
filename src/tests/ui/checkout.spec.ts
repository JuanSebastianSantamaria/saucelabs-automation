import assert from 'node:assert/strict';
import { credentials } from '../../config/environment.js';
import { checkoutTestData } from '../../data/ui-test-data.js';
import { CartPage } from '../../pages/cart.page.js';
import { CheckoutInformationPage } from '../../pages/checkout-information.page.js';
import { CheckoutOverviewPage } from '../../pages/checkout-overview.page.js';
import { CompletePage } from '../../pages/complete.page.js';
import { LoginPage } from '../../pages/login.page.js';
import { ProductsPage } from '../../pages/products.page.js';

describe('Sauce Demo checkout', () => {
  const loginPage = new LoginPage();
  const productsPage = new ProductsPage();
  const cartPage = new CartPage();
  const checkoutInformationPage = new CheckoutInformationPage();
  const checkoutOverviewPage = new CheckoutOverviewPage();
  const completePage = new CompletePage();
  const selectedProducts: string[] = [];

  it('logs in and verifies the products page', async () => {
    await loginPage.openLogin();
    await loginPage.login(credentials.username, credentials.password);
    await productsPage.waitUntilLoaded();

    assert.equal(await productsPage.isProductsHeaderDisplayed(), true, 'successful login should display the products page');
  });

  it('adds two random products to the cart', async () => {
    selectedProducts.push(await productsPage.addRandomProduct());
    selectedProducts.push(await productsPage.addRandomProduct(selectedProducts));

    assert.equal(new Set(selectedProducts).size, checkoutTestData.expectedProductCount, 'two distinct products should be selected');
    assert.equal(await productsPage.getCartItemCount(), checkoutTestData.expectedProductCount, 'cart badge should show two products');
  });

  it('verifies the cart items and quantities', async () => {
    await productsPage.openCart();
    await cartPage.waitUntilLoaded();

    const cartItems = await cartPage.getItems();
    assert.equal(cartItems.length, checkoutTestData.expectedProductCount, 'cart should contain exactly two products');
    assert.deepEqual(
      cartItems.map((item) => item.name).sort(),
      [...selectedProducts].sort(),
      'cart should contain the selected distinct products',
    );
  });

  it('completes checkout information and verifies the order overview', async () => {
    await cartPage.proceedToCheckout();
    await checkoutInformationPage.waitUntilLoaded();
    await checkoutInformationPage.completeInformation(
      checkoutTestData.customer.firstName,
      checkoutTestData.customer.lastName,
      checkoutTestData.customer.postalCode,
    );
    await checkoutOverviewPage.waitUntilLoaded();
    const overviewProducts = await checkoutOverviewPage.getItems();
    assert.deepEqual(overviewProducts.sort(), [...selectedProducts].sort(), 'checkout overview should contain the selected products');
  });

  it('completes the purchase and verifies the confirmation', async () => {
    await checkoutOverviewPage.finishPurchase();
    await completePage.waitUntilLoaded();
    assert.equal(await completePage.getConfirmationMessage(), checkoutTestData.expectedConfirmationMessage, 'purchase should display the confirmation message');
  });
});

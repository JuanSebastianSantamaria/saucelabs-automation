# saucelabs-automation

TypeScript test automation for the Sauce Demo UI and the Restful Booker API.
The UI suite uses WebdriverIO and the API suite uses Mocha with Node.js `fetch`.

- UI: https://www.saucedemo.com/
- API: https://restful-booker.herokuapp.com (API documentation:
  https://restful-booker.herokuapp.com/apidoc/index.html)

## Prerequisites

- Node.js 20 or later and npm
- Firefox, Chrome, or Microsoft Edge installed for UI tests

WebdriverIO 9 manages the local WebDriver driver automatically. No separate
WebDriver URL or driver service is configured.

## Installation and configuration

```bash
npm install
```

Optionally create a local environment file from the example:

```powershell
Copy-Item .env.example .env
```

On macOS/Linux, use `cp .env.example .env`. The project defaults to the `prod`
environment and Sauce Demo's `standard_user` credentials. Adjust `.env` if
needed. `API_BASE_URL` and `UI_BASE_URL` can override the configured URLs.

Only `prod` is currently configured. `TEST_ENV` selects the environment;
`BROWSER` and `HEADLESS` configure UI test execution.

## Running tests

Run both suites, or run either layer independently:

```bash
npm test
npm run test:api
npm run test:ui
```

Choose the environment, browser, and headless mode on the command line with
`cross-env`:

```bash
npx cross-env TEST_ENV=prod npm run test:api
npx cross-env TEST_ENV=prod BROWSER=firefox HEADLESS=true npm run test:ui
```

Supported `BROWSER` values are `firefox`, `chrome`, and `edge`. `HEADLESS`
defaults to `false`; set it to `true` for headless execution. For example, to
run the UI suite in a visible Chrome browser:

```bash
npx cross-env TEST_ENV=prod BROWSER=chrome HEADLESS=false npm run test:ui
```

`BROWSER` and `HEADLESS` apply to the UI suite; the API suite does not launch a
browser.

### Test coverage

The API suite runs an ordered booking lifecycle:

1. Generate an auth token and validate the response.
2. Create a booking and validate its response and ID.
3. Read the booking and compare it with the test data.
4. Update the checkout date and validate the updated response.
5. Delete the booking, validate the status, and confirm a subsequent GET
   returns 404.

The UI suite runs an ordered checkout flow:

1. Log in and verify the products page.
2. Add two distinct randomly selected products.
3. Verify the cart contents.
4. Complete checkout information and verify the order overview.
5. Complete the purchase and verify the confirmation message.

Both suites consist of ordered tests that share lifecycle state within their
specification.

## Reports

- **API:** Mocha prints a Spec-style summary in the terminal and Mochawesome
  generates `reports/api/api-report.html`.
- **UI:** WebdriverIO prints a Spec summary and writes Allure results to
  `allure-results/`. After a UI run, generate and open the Allure report with:

  ```bash
  npm run report
  ```

## Architecture

```text
src/
  api/                 Restful Booker client and request/response DTOs
  config/              Environment URLs and Sauce Demo credentials
  data/                API request data and UI test fixtures
  pages/               UI page objects and shared BasePage
    components/        Reusable product-card and cart-item components
  tests/
    api/               Booking lifecycle spec and API-specific helpers
    ui/                Checkout spec
  utils/               Shared utilities, including date handling
```

- **Page Object Model:** Each page object owns its selectors and user interactions.
  The checkout flow has separate page objects for login, products,
  cart, checkout information, checkout overview, and completion. Reusable
  product-card and cart-item components encapsulate element-level behavior.
- **Loadable Component pattern:** `BasePage` defines a page-specific
  `pageReadySelector` and a shared `waitUntilLoaded()` method. Each page object
  must have its readiness anchor. The shared `open()` method navigates and waits
  for that anchor, and the UI flow also waits after page transitions before
  interacting with the next page. WDIO's `waitforTimeout` configures the
  maximum wait duration.
- **API layer and DTOs:** `RestfulBookerClient` encapsulates HTTP requests and
  returns response status and body. DTOs describe API payloads.
  `src/data/api-test-data.ts` supplies authentication and booking data;
  lifecycle prerequisite helpers and reusable date utilities are kept outside
  the spec.
- **Test data:** `src/data/ui-test-data.ts` supplies checkout details and
  expected UI results. Sauce Demo credentials and endpoint configuration are
  resolved in `src/config/environment.ts`.
- **Execution and configuration:** Mocha runs the API suite without a browser;
  WDIO runs the UI suite using the selected local browser. `TEST_ENV` currently
  supports `prod`, and optional URL overrides can be set with `API_BASE_URL`
  and `UI_BASE_URL`.
- **Reporting:** API and UI suites use separate reporters and output
  directories, as described above.



## Manual QA bug report structure

- **Title:** Removing a product from the Products page does not remove it from
  the cart for `problem_user`
- **Description:** When logged in as `problem_user`, adding a product to the
  cart and then selecting **Remove** on the Products page does not remove the
  product from the cart.
- **Steps to reproduce:**
  1. Open https://www.saucedemo.com/.
  2. Log in with username `problem_user` and password `secret_sauce`.
  3. On the Products page, select **Add to cart** for any product.
  4. Select **Remove** for that same product.
  5. Check the cart badge or open the cart.
- **Expected result:** The product is removed from the cart and the cart count
  decreases accordingly.
- **Actual result:** The product remains in the cart after selecting
  **Remove**.
- **Severity:** Medium.
const puppeteer = require("puppeteer");

suite("UI", function () {
  let baseUrl = `http://localhost:9000`;
  let browser;
  let page;

  suiteSetup(async function () {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  setup(async function () {
    page = await browser.newPage();
  });

  teardown(async function () {
    await page.close();
  });

  suiteTeardown(async function () {
    await browser.close();
  });

  test("it should register a user", async function () {
    await page.goto(baseUrl);
    console.log(page);
  });
});

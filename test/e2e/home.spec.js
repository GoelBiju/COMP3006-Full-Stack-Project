const puppeteer = require("puppeteer");

suite("e2e - home", function () {
  let baseUrl = `http://localhost:9000`;
  let browser;
  let page;

  suiteSetup(async function () {
    browser = await puppeteer.launch();
    page = await browser.newPage();

    await page.goto(baseUrl + "/register");
    await page.type("#username", "test");
    await page.type("#password", "test");
    await page.type("#confirmPassword", "test");

    await page.click("#register-btn");

    await page.goto(baseUrl + "/register");
    await page.type("#username", "test2");
    await page.type("#password", "test2");
    await page.type("#confirmPassword", "test2");

    await page.goto(baseUrl + "/login");
    await page.type("#username", "test");
    await page.type("#password", "test");

    await Promise.all([
      page.click("#login-btn"),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);
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

  test("it should create a game", async function () {
    await page.goto(baseUrl + "/");

    await Promise.all([
      page.click("#createGameBtn"),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);
  });

  test("it should join a created game", async function () {
    await page.goto(baseUrl + "/login");
    await page.type("#username", "test2");
    await page.type("#password", "test2");

    await Promise.all([
      page.click("#login-btn"),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    await Promise.all([
      page.click("#play-btn-1"),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);
  });
});

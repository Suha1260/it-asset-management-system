const { Builder, By, until } = require("selenium-webdriver");
const assert = require("node:assert/strict");

describe("IT Asset Management UI", function () {
    this.timeout(30000);

    let driver;

    before(async function () {
        driver = await new Builder().forBrowser("chrome").build();

        const baseUrl = process.env.BASE_URL || "http://localhost:3000";
        await driver.get(baseUrl);

        await driver.wait(
            until.elementLocated(By.id("assetForm")),
            10000
        );
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    it("shows the application heading", async function () {
        const heading = await driver.findElement(By.css("h1")).getText();
        assert.equal(heading, "IT Asset Management System");
    });

    it("registers an asset", async function () {
        const unique = `AUTO-${Date.now()}`;

        await driver.findElement(By.id("name")).sendKeys("Selenium Test Laptop");
        await driver.findElement(By.id("type")).sendKeys("Laptop");
        await driver.findElement(By.id("serialNumber")).sendKeys(unique);
        await driver.findElement(By.id("assignedTo")).sendKeys("QA Team");
        await driver.findElement(By.id("saveButton")).click();

        await driver.wait(
            until.elementTextContains(
                await driver.findElement(By.id("message")),
                "registered successfully"
            ),
            5000
        );

        const body = await driver.findElement(By.tagName("body")).getText();
        assert.ok(body.includes(unique));
    });

    it("shows an asset count", async function () {
        const count = await driver.findElement(By.id("count")).getText();
        assert.match(count, /^\d+ asset\(s\) registered$/i);
    });
});
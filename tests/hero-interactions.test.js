import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

test("hero interactions", { timeout: 120_000 }, async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
    args: ["--no-sandbox"],
  });
  const url = process.env.HERO_URL || "http://127.0.0.1:3000/";

  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    await page.goto(url, { waitUntil: "networkidle" });

    const button = page.getByRole("button", {
      name: "Mian Hamid Ur Rehman",
      exact: true,
    });

    await button.waitFor({ timeout: 2000 });
    await page.keyboard.press("Tab");
    await button.focus();
    await page.locator("#profile-card").waitFor();
    await button.press("Escape");
    await page.locator("#profile-card").waitFor({ state: "hidden" });
    assert.equal(
      await button.evaluate((el) => el === document.activeElement),
      true,
    );

    await button.press("Enter");
    await page.locator("#profile-card").waitFor();
    await button.press("Space");
    await page.locator("#profile-card").waitFor({ state: "hidden" });

    const touch = await browser.newPage({
      hasTouch: true,
      isMobile: true,
      viewport: { width: 375, height: 812 },
    });
    await touch.goto(url, { waitUntil: "networkidle" });
    assert.equal(
      await touch
        .getByRole("button", {
          name: "Mian Hamid Ur Rehman",
          exact: true,
        })
        .isVisible(),
      false,
    );

    const touchButton = touch.getByRole("button", {
      name: "Show Profile Card",
      exact: true,
    });
    await touchButton.tap();
    await touch.locator("#profile-card").waitFor();
    await touchButton.tap();
    await touch.locator("#profile-card").waitFor({ state: "hidden" });
    await touchButton.tap();
    await touch.locator("#profile-card").waitFor();
    await touch.locator("#top h1:visible").tap();
    await touch.locator("#profile-card").waitFor({ state: "hidden" });
    await touch.locator("#top h1:visible").tap();
    assert.equal(await touchButton.getAttribute("aria-expanded"), "false");

    await page.setViewportSize({ width: 768, height: 900 });

    const profileButton = page.getByRole("button", {
      name: "Show Profile Card",
    });
    await profileButton.click();
    await page.locator("#profile-card").waitFor();
    await profileButton.click();
    await page.locator("#profile-card").waitFor({ state: "hidden" });
    await profileButton.focus();
    await profileButton.press("Enter");
    await page.locator("#profile-card").waitFor();
    await profileButton.press("Escape");
    await page.locator("#profile-card").waitFor({ state: "hidden" });

    console.log(
      "PASS desktop name interactions and mobile profile button touch, mouse, keyboard, and outside dismissal",
    );
  } finally {
    await browser.close();
  }
});

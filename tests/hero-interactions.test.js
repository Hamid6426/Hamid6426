import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

test(
  "profile button toggles the responsive card without name hover",
  { timeout: 120_000 },
  async () => {
    const browser = await chromium.launch({
      executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
      args: ["--no-sandbox"],
    });
    const url = process.env.HERO_URL || "http://127.0.0.1:3000/";

    try {
      const page = await browser.newPage({ reducedMotion: "reduce" });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(url, { waitUntil: "networkidle" });

      for (const [width, cardId, direction] of [
        [1440, "profile-card-desktop", "row"],
        [1280, "profile-card-desktop", "row"],
        [1279, "profile-card", "column"],
        [768, "profile-card", "column"],
        [375, "profile-card", "column"],
      ]) {
        await page.setViewportSize({ width, height: 900 });
        const button = page.getByRole("button", {
          name: "Show Profile Card",
          exact: true,
        });
        const heading = page.locator("#top h1:visible");
        const card = page.locator(`#${cardId}`);
        assert.equal(
          await button.isVisible(),
          true,
          `Profile button at ${width}px`,
        );
        assert.equal(await page.locator("#top h1:visible").count(), 1);
        await heading.hover();
        await page.waitForTimeout(250);
        assert.equal(
          await page.getByRole("tooltip").count(),
          0,
          "Name hover must not open the card",
        );
        await heading.click();
        assert.equal(await button.getAttribute("aria-expanded"), "false");
        await button.focus();
        assert.equal(
          await button.getAttribute("aria-expanded"),
          "false",
          "Focus alone must not open the card",
        );

        await button.click();
        await card.waitFor({ state: "visible" });
        assert.equal(await button.getAttribute("aria-expanded"), "true");
        assert.equal(
          await card.evaluate((el) => getComputedStyle(el).flexDirection),
          direction,
        );
        const navDirection = await page
          .getByRole("navigation", { name: "Resume and contact links" })
          .evaluate((el) => getComputedStyle(el).flexDirection);
        assert.equal(navDirection, width >= 1280 ? "column" : "row");
        const bounds = await card.boundingBox();
        assert.ok(
          bounds.x >= 0 && bounds.x + bounds.width <= width,
          "Card stays within viewport",
        );
        await heading.hover();
        assert.equal(
          await card.isVisible(),
          true,
          "Moving the pointer must not dismiss the card",
        );
        await button.click();
        await card.waitFor({ state: "hidden" });
        assert.deepEqual(
          errors,
          [],
          "Profile interactions must not encounter browser errors",
        );

        await button.press("Enter");
        await card.waitFor({ state: "visible" });
        await button.press("Escape");
        await card.waitFor({ state: "hidden" });
        assert.equal(
          await button.evaluate((el) => el === document.activeElement),
          true,
        );
        await button.press("Space");
        await card.waitFor({ state: "visible" });
        await button.press("Space");
        await card.waitFor({ state: "hidden" });
        await button.click();
        await card.waitFor({ state: "visible" });
        await heading.click();
        await card.waitFor({ state: "hidden" });
        await button.click();
        await card.waitFor({ state: "visible" });
        await button.press("Tab");
        await card.waitFor({ state: "hidden" });
      }

      const touch = await browser.newPage({
        hasTouch: true,
        isMobile: true,
        viewport: { width: 375, height: 812 },
      });
      await touch.goto(url, { waitUntil: "networkidle" });
      const button = touch.getByRole("button", {
        name: "Show Profile Card",
        exact: true,
      });
      const card = touch.locator("#profile-card");
      await button.tap();
      await card.waitFor({ state: "visible" });
      await button.tap();
      await card.waitFor({ state: "hidden" });
      await button.tap();
      await card.waitFor({ state: "visible" });
      await touch.locator("#top h1").tap();
      await card.waitFor({ state: "hidden" });
      console.log(
        "PASS responsive profile button, no name hover, mouse, keyboard, touch, and dismissal",
      );
    } finally {
      await browser.close();
    }
  },
);

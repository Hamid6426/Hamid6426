import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
const axePath = import.meta.resolve("axe-core/axe.min.js");

test(
  "accessibility and responsive behavior",
  { timeout: 120_000 },
  async () => {
    const browser = await chromium.launch({
      executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const url = process.env.A11Y_URL || "http://127.0.0.1:3000/";

    try {
      await page.goto(url, { waitUntil: "networkidle" });
      await page.addScriptTag({ path: fileURLToPath(axePath) });
      assert.match(await page.title(), /Mian Hamid Ur Rehman/);
      assert.equal(await page.locator("h1").count(), 1);
      assert.deepEqual(
        await page.evaluate(() => {
          const body = getComputedStyle(document.body);
          const heading = getComputedStyle(document.querySelector("h1"));
          const mono = getComputedStyle(document.querySelector("header a"));
          return {
            background: body.backgroundColor,
            color: body.color,
            weight: heading.fontWeight,
            casing: mono.textTransform,
          };
        }),
        {
          background: "rgb(220, 211, 189)",
          color: "rgb(17, 17, 16)",
          weight: "800",
          casing: "uppercase",
        },
      );
      assert.equal(await page.locator("#work h3").count(), 5);
      assert.equal(await page.locator("#experience dl > div").count(), 5);

      for (const section of [
        "#top",
        "#work",
        "#about",
        "#experience",
        "#contact",
      ]) {
        await page.locator(section).scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
      }
      await page.evaluate(() => window.scrollTo(0, 0));

      for (const width of [1440, 1024, 900, 768, 600, 375, 320]) {
        await page.setViewportSize({ width, height: 900 });
        const violations = await page.evaluate(async () =>
          (
            await window.axe.run(document, {
              runOnly: {
                type: "tag",
                values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
              },
            })
          ).violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
        );
        assert.deepEqual(violations, [], `Accessibility at ${width}px`);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
          `Overflow at ${width}px`,
        );
        console.log(`PASS accessibility and responsive layout at ${width}px`);
      }

      await page.setViewportSize({ width: 375, height: 812 });
      await page.reload({ waitUntil: "networkidle" });
      await page.keyboard.press("Tab");
      assert.equal(
        await page.locator(":focus").getAttribute("href"),
        "#main-content",
      );
      await page.keyboard.press("Enter");
      assert.equal(
        await page.locator(":focus").getAttribute("id"),
        "main-content",
      );
      await page.getByRole("button", { name: "Menu", exact: true }).click();
      assert.equal(
        await page.locator("#menu-toggle").getAttribute("aria-expanded"),
        "true",
      );
      assert.equal(await page.locator(":focus").getAttribute("href"), "#work");
      assert.equal(await page.locator("main").evaluate((el) => el.inert), true);
      await page.keyboard.press("Escape");
      assert.equal(
        await page.locator("#menu-toggle").getAttribute("aria-expanded"),
        "false",
      );
      assert.equal(
        await page.locator(":focus").getAttribute("id"),
        "menu-toggle",
      );
      await page.getByRole("button", { name: "Menu", exact: true }).click();
      await page.locator('#mobile-menu a[href="#experience"]').click();
      assert.equal(await page.locator("#mobile-menu").isVisible(), false);
      assert.equal(new URL(page.url()).hash, "#experience");
      await page.getByRole("button", { name: "Menu", exact: true }).click();
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForTimeout(100);
      assert.equal(
        await page.locator("#menu-toggle").getAttribute("aria-expanded"),
        "false",
      );
      console.log(
        "PASS keyboard navigation, mobile menu, Escape, anchor links, and resize",
      );

      await page
        .getByRole("button", { name: "Show Profile Card", exact: true })
        .focus();
      await page.keyboard.press("Enter");
      await page.locator("#profile-card-desktop img").waitFor();
      await page.waitForFunction(() => {
        const image = document.querySelector("#profile-card-desktop img");
        return image?.complete && image.naturalWidth > 0;
      });
      await page.keyboard.press("Escape");
      await page.locator("#profile-card-desktop").waitFor({ state: "hidden" });
      const icon = await page.request.get(
        new URL(
          await page.locator('link[rel="icon"]').getAttribute("href"),
          url,
        ).href,
      );
      assert.equal(icon.status(), 200);
      assert.match(icon.headers()["content-type"], /image\/png/);
      const ogUrl = new URL(
        await page.locator('meta[property="og:image"]').getAttribute("content"),
      );
      const og = await page.request.get(
        new URL(ogUrl.pathname + ogUrl.search, url).href,
      );
      assert.equal(og.status(), 200);
      assert.match(og.headers()["content-type"], /image\/png/);
      const resume = await page.request.get(new URL("/api/resume", url).href);
      assert.equal(resume.status(), 200);
      assert.match(resume.headers()["content-disposition"], /attachment/);
      assert.match(await resume.text(), /Mian Hamid Ur Rehman/);
      assert.equal(
        await page
          .locator("html")
          .evaluate((el) => getComputedStyle(el).scrollBehavior),
        "auto",
      );
      assert.equal(
        await page
          .locator("button[type=submit]")
          .first()
          .evaluate((el) => getComputedStyle(el).transitionDuration),
        "0s",
      );
      console.log(
        "PASS portrait, favicon, Open Graph image, resume, and reduced motion",
      );

      await page.locator("#contact").scrollIntoViewIfNeeded();
      await page.getByLabel("Name", { exact: true }).fill("Visitor");
      await page
        .getByLabel("Email", { exact: true })
        .fill("visitor@example.com");
      await page
        .getByLabel("Message", { exact: true })
        .fill("Please discuss this project with me.");
      let requests = 0;
      await page.route("**/api/contact-submission", async (route) => {
        requests++;
        assert.deepEqual(route.request().postDataJSON(), {
          name: "Visitor",
          email: "visitor@example.com",
          message: "Please discuss this project with me.",
        });
        await route.fulfill({
          status: 503,
          json: { success: false, message: "Email unavailable." },
        });
      });
      await page.getByRole("button", { name: "Send message" }).click();
      await page
        .getByRole("alert")
        .filter({ hasText: "Email unavailable." })
        .waitFor();
      assert.equal(requests, 1);
      assert.equal(
        await page.getByLabel("Message", { exact: true }).inputValue(),
        "Please discuss this project with me.",
      );
      assert.equal(await page.getByRole("status").count(), 0);
      await page.unroute("**/api/contact-submission");

      let release;
      const delivery = new Promise((resolve) => {
        release = resolve;
      });
      await page.route("**/api/contact-submission", async (route) => {
        await delivery;
        await route.fulfill({
          status: 200,
          json: { success: true, message: "Sent." },
        });
      });
      await page.getByRole("button", { name: "Send message" }).click();
      assert.equal(
        await page.getByRole("button", { name: "Sending" }).isDisabled(),
        true,
      );
      assert.equal(
        await page.getByLabel("Name", { exact: true }).isDisabled(),
        true,
      );
      assert.equal(
        await page.getByLabel("Email", { exact: true }).isDisabled(),
        true,
      );
      assert.equal(
        await page.getByLabel("Message", { exact: true }).isDisabled(),
        true,
      );
      release();
      await page.getByRole("status").waitFor();
      assert.equal(
        await page.getByLabel("Message", { exact: true }).inputValue(),
        "",
      );
      await page.getByRole("button", { name: "Dismiss" }).click();
      await page.getByRole("status").waitFor({ state: "hidden" });
      await page.unroute("**/api/contact-submission");
      await page.route("**/api/contact-submission", (route) => route.abort());
      await page.getByLabel("Name", { exact: true }).fill("Visitor");
      await page
        .getByLabel("Email", { exact: true })
        .fill("visitor@example.com");
      await page
        .getByLabel("Message", { exact: true })
        .fill("Please discuss this project with me.");
      await page.getByRole("button", { name: "Send message" }).click();
      await page
        .getByRole("alert")
        .filter({ hasText: "Unable to send" })
        .waitFor();
      assert.equal(
        await page.getByLabel("Name", { exact: true }).inputValue(),
        "Visitor",
      );
      console.log(
        "PASS contact delivery, pending state, server errors, and network errors",
      );
      await page.goto(url, { waitUntil: "networkidle" });
      await page.screenshot({
        path: "/tmp/portfolio-desktop.png",
        fullPage: true,
      });

      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({
        path: "/tmp/portfolio-mobile.png",
        fullPage: true,
      });
      await page.setViewportSize({ width: 320, height: 640 });
      await page.addStyleTag({
        content:
          "* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }",
      });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        "Text spacing overflow",
      );

      const noJS = await browser.newPage({
        javaScriptEnabled: false,
        viewport: { width: 320, height: 640 },
      });
      await noJS.goto(url, { waitUntil: "networkidle" });
      assert.equal(await noJS.locator(".no-js-links").isVisible(), true);
      assert.equal(
        await noJS
          .locator("#work .motion-reveal")
          .first()
          .evaluate((el) => getComputedStyle(el).opacity),
        "1",
      );
      assert.equal(
        await noJS.getByRole("button", { name: "Send message" }).isVisible(),
        false,
      );
      await noJS.close();

      const touch = await browser.newPage({
        hasTouch: true,
        isMobile: true,
        viewport: { width: 375, height: 812 },
      });
      await touch.goto(url, { waitUntil: "networkidle" });
      await touch
        .getByRole("button", { name: "Show Profile Card", exact: true })
        .tap();
      await touch.locator("#profile-card").waitFor();
      await touch
        .getByRole("button", { name: "Show Profile Card", exact: true })
        .tap();
      await touch.locator("#profile-card").waitFor({ state: "hidden" });
      await touch.close();
      console.log(
        "PASS touchscreen profile card opens on first tap and closes on second tap",
      );
      assert.deepEqual(errors, []);
      console.log(
        "PASS text spacing, JavaScript-disabled navigation, and no browser runtime errors",
      );
    } finally {
      await browser.close();
    }
  },
);

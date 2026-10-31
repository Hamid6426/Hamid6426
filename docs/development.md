# Development and testing

## Setup

Use Node.js 22.18 or newer. Install dependencies with `npm install`, then start the development server with `npm run dev`. Copy `.env.example` to `.env` and configure the SMTP values to enable contact form delivery. Never commit real credentials.

Set `NEXT_PUBLIC_BASE_URL` to the deployed site's origin without a trailing slash to generate absolute Open Graph URLs. The local default is `http://localhost:3000`. The committed `.env.test` contains placeholder values for tests.

## Project structure

- `src/app/` contains the App Router pages, metadata, styles, and contact API.
- `src/components/` contains reusable interface components; `src/data/` contains portfolio content.
- `public/` contains static assets, including the PDF linked by `aboutData.resume` in `src/data/about.data.ts`.
- `src/fonts/` contains locally served fonts and their licenses. The favicon uses `public/profile.jpg`.
- `tsconfig.json` configures the Next.js build; `tsconfig.app.json` and `tsconfig.test.json` are used by the typecheck command.

The contact form submits to `/api/contact-submission`. Failed submissions preserve the visitor's message for retry; successful delivery clears the form and displays confirmation.

## Checks

### Dependency security

Next.js and `eslint-config-next` are pinned to 16.4.3. A scoped npm override updates TypeScript ESLint's minimatch dependency to 11.0.3; remove it when the upstream dependency supports a patched version directly.

The remaining lint dependencies use minimatch 3, which is still flagged by [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249). Its CommonJS API differs from minimatch 11, so a global override would break callers. Recheck `npm audit` when updating the lint dependencies. Avoid `npm audit fix --force`: its proposed ESLint downgrade is incompatible with this project's configuration. Use `npm audit --omit=dev` to check production dependencies separately.

### Project validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run start
```

The contact API tests mock email delivery. The browser scripts in `tests/` require Playwright and a running site. For the JavaScript-disabled CSS checks, run the accessibility script against a production server:

```bash
node --test tests/accessibility.test.js
```

Set `A11Y_URL` to test another URL or `CHROME_PATH` to use another Chrome executable. The accessibility script checks responsive layouts, keyboard navigation, reduced motion, contact form states, and other behavior; it saves screenshots to `/tmp/portfolio-desktop.png` and `/tmp/portfolio-mobile.png`.

The other browser checks can be run with:

```bash
node --test tests/hero-interactions.test.js
node --test tests/navbar.test.js
```

The hero script accepts `HERO_URL` and `CHROME_PATH`; the navbar script accepts `PORTFOLIO_URL` and uses `/usr/bin/google-chrome`.

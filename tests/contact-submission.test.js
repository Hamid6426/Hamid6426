import assert from "node:assert/strict";
import { after, beforeEach, mock, test } from "node:test";
import nodemailer from "nodemailer";

const sendMail = mock.fn(async () => ({ accepted: ["owner@example.com"] }));
const createTransport = mock.method(nodemailer, "createTransport", () => ({
  sendMail,
}));

const smtpKeys = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
  "SMTP_TO",
];

const originalEnv = Object.fromEntries(
  smtpKeys.map((key) => [key, process.env[key]]),
);

const submission = {
  name: " Hamid ",
  email: " visitor@example.com ",
  message: " Let's discuss a project. ",
};

beforeEach(() => {
  Object.assign(process.env, {
    SMTP_HOST: "smtp.gmail.com",
    SMTP_PORT: "587",
    SMTP_SECURE: "false",
    SMTP_USER: "owner@example.com",
    SMTP_PASS: "test-password",
    SMTP_FROM: "owner@example.com",
    SMTP_TO: "owner@example.com",
  });
  createTransport.mock.resetCalls();
  sendMail.mock.resetCalls();
  sendMail.mock.mockImplementation(async () => ({
    accepted: ["owner@example.com"],
  }));
});

after(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  mock.restoreAll();
});

async function submit(body, raw = false) {
  const { POST } = await import("../src/app/api/contact-submission/route.ts");
  return POST(
    new Request("http://localhost/api/contact-submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw ? body : JSON.stringify(body),
    }),
  );
}

test("sends trimmed contact details to the configured owner with the visitor as reply-to", async () => {
  const response = await submit(submission);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    success: true,
    message: "Message sent successfully.",
  });
  assert.partialDeepStrictEqual(createTransport.mock.calls[0].arguments[0], {
    port: 587,
    secure: false,
    requireTLS: true,
  });
  assert.partialDeepStrictEqual(sendMail.mock.calls[0].arguments[0], {
    from: "owner@example.com",
    to: "owner@example.com",
    replyTo: "visitor@example.com",
    subject: "Portfolio inquiry",
    text: "Let's discuss a project.\n\nFrom: Hamid\nEmail: visitor@example.com",
  });
});

test("rejects malformed JSON without attempting delivery", async () => {
  assert.equal((await submit("{", true)).status, 400);
  assert.equal(sendMail.mock.callCount(), 0);
});

test("rejects invalid fields and oversized messages without attempting delivery", async () => {
  for (const body of [
    null,
    [],
    {},
    { ...submission, name: 42 },
    { ...submission, email: "invalid" },
    { ...submission, email: "x@example.com\r\nBcc: other@example.com" },
    { ...submission, name: " " },
    { ...submission, message: "short" },
    { ...submission, message: "x".repeat(5001) },
  ]) {
    assert.equal((await submit(body)).status, 400);
  }
  assert.equal(sendMail.mock.callCount(), 0);
});

test("reports missing or invalid SMTP configuration without delivery", async () => {
  delete process.env.SMTP_PASS;
  assert.equal((await submit(submission)).status, 503);
  process.env.SMTP_PASS = "test-password";
  process.env.SMTP_PORT = "invalid";
  assert.equal((await submit(submission)).status, 503);
  assert.equal(sendMail.mock.callCount(), 0);
});

test("returns a generic error when SMTP delivery fails", async () => {
  sendMail.mock.mockImplementationOnce(async () => {
    throw new Error("private SMTP details");
  });
  const response = await submit(submission);
  assert.equal(response.status, 502);
  const body = await response.json();
  assert.equal(body.success, false);
  assert.doesNotMatch(JSON.stringify(body), /private SMTP details/);
});

test("reports failed delivery when the SMTP server accepts no recipients", async () => {
  sendMail.mock.mockImplementationOnce(async () => ({
    accepted: [],
    rejected: ["owner@example.com"],
  }));
  const response = await submit(submission);
  assert.equal(response.status, 502);
  assert.equal((await response.json()).success, false);
});

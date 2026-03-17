import { createHash, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

export const inquiryAccessCookieName = "wall_art_inquiry_access";

function getInquiryPassword() {
  return process.env.INQUIRY_ACCESS_PASSWORD || "";
}

function getInquiryCookieSecret() {
  return process.env.INQUIRY_ACCESS_COOKIE_SECRET || "";
}

function hasInquiryAuthConfig() {
  return Boolean(getInquiryPassword() && getInquiryCookieSecret());
}

function buildInquiryAccessToken() {
  return createHash("sha256")
    .update(`${getInquiryPassword()}::${getInquiryCookieSecret()}`)
    .digest("hex");
}

export function isInquiryAuthConfigured() {
  return hasInquiryAuthConfig();
}

export async function verifyInquiryPassword(input: string) {
  if (!hasInquiryAuthConfig()) {
    return false;
  }

  const actual = Buffer.from(input);
  const expected = Buffer.from(getInquiryPassword());

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

export async function isInquiryAuthorized() {
  if (!hasInquiryAuthConfig()) {
    return false;
  }

  const store = await cookies();
  const cookieValue = store.get(inquiryAccessCookieName)?.value;

  if (!cookieValue) {
    return false;
  }

  const actual = Buffer.from(cookieValue);
  const expected = Buffer.from(buildInquiryAccessToken());

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

export function getInquiryAccessCookieValue() {
  return buildInquiryAccessToken();
}

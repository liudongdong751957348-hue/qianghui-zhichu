import { NextResponse } from "next/server";

import {
  getInquiryAccessCookieValue,
  inquiryAccessCookieName,
  isInquiryAuthConfigured,
  verifyInquiryPassword,
} from "@/lib/inquiry-auth";

type SessionPayload = {
  password?: string;
};

export async function POST(request: Request) {
  if (!isInquiryAuthConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "AUTH_NOT_CONFIGURED",
          message: "内部访问口令尚未配置，请先补充环境变量。",
        },
      },
      { status: 503 },
    );
  }

  const payload = (await request.json()) as SessionPayload;
  const verified = await verifyInquiryPassword(payload.password || "");

  if (!verified) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INVALID_PASSWORD",
          message: "访问口令不正确，请重新输入。",
        },
      },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: inquiryAccessCookieName,
    value: getInquiryAccessCookieValue(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: inquiryAccessCookieName,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}

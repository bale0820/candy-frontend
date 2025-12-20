
import { API_BASE_URL_SC } from "@/shared/constants/serverEnv";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

async function proxy(request, context, method) {
  // ✅ Next 16
  const { path = [] } = await context.params;
  const requestPath = path.join("/");

  // ✅ query string 포함 (이게 제일 중요)
  const url = new URL(request.url);
  const backendUrl = `${API_BASE_URL_SC}/${requestPath}${url.search}`;

  const headers = new Headers();

  // ✅ 레시피 "조회(GET)"만 공개
  const isPublicRecipeGet =
    method === "GET" && requestPath.startsWith("recipe/");

  // ===============================
  // 🔐 인증 헤더 (공개 API 제외)
  // ===============================
  if (!isPublicRecipeGet) {
    const auth = request.headers.get("authorization");
    if (auth) headers.set("authorization", auth);

    const xsrf = request.headers.get("x-xsrf-token");
    if (xsrf) headers.set("X-XSRF-TOKEN", xsrf);

    const cookie = request.headers.get("cookie");
    if (cookie) headers.set("cookie", cookie);
  }

  // Content-Type 항상 전달
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  // Origin은 refresh / CORS 검증용 (항상 필요)
  const origin = request.headers.get("origin");
  if (origin) headers.set("origin", origin);

  const res = await fetch(backendUrl, {
    method,
    headers,
    body:
      method === "GET" || method === "HEAD"
        ? null
        : await request.text(),
    credentials: "include",
  });

  return new NextResponse(res.body, {
    status: res.status,
    headers: res.headers,
  });
}

export const GET = (req, ctx) => proxy(req, ctx, "GET");
export const POST = (req, ctx) => proxy(req, ctx, "POST");
export const PUT = (req, ctx) => proxy(req, ctx, "PUT");
export const DELETE = (req, ctx) => proxy(req, ctx, "DELETE");

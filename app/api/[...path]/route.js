import { API_BASE_URL } from "@/shared/constants/apiBaseUrl";
import { NextResponse } from "next/server";

const BACKEND_BASE_URL = `${API_BASE_URL}`;

async function proxy(request, { params }, method) {
  const { path } = params; // ["admin","reviews","analysis","1"]
  const backendUrl = `${BACKEND_BASE_URL}/${path.join("/")}`;

  const headers = new Headers(request.headers);
  headers.delete("host"); // 중요: 그대로 두면 에러 나는 경우 있음

  const res = await fetch(backendUrl, {
    method,
    headers,
    body: method === "GET" || method === "HEAD" ? null : await request.text(),
    credentials: "include",
  });

  return new NextResponse(res.body, {
    status: res.status,
    headers: res.headers,
  });
}

export async function GET(request, context) {
  return proxy(request, context, "GET");
}

export async function POST(request, context) {
  return proxy(request, context, "POST");
}

export async function PUT(request, context) {
  return proxy(request, context, "PUT");
}

export async function DELETE(request, context) {
  return proxy(request, context, "DELETE");
}

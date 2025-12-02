import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_URL || "http://3.38.141.170:8000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, "PUT");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, "PATCH");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, "DELETE");
}

async function handleRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string,
) {
  try {
    const path = params.path.join("/");
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${API_BASE_URL}/${path}${searchParams ? `?${searchParams}` : ""}`;

    // 요청 헤더 복사 (필요한 것만)
    const headers: HeadersInit = {};
    const forwardedHeaders = ["content-type", "x-user-email", "authorization"];

    request.headers.forEach((value, key) => {
      if (forwardedHeaders.includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });

    // 요청 본문 가져오기
    let body: BodyInit | undefined;
    const contentType = request.headers.get("content-type");

    if (method !== "GET" && method !== "DELETE") {
      if (contentType?.includes("multipart/form-data")) {
        body = await request.formData();
      } else {
        body = await request.text();
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    // 응답 본문 가져오기
    const responseText = await response.text();
    let responseData: unknown;

    try {
      responseData = responseText ? JSON.parse(responseText) : undefined;
    } catch {
      responseData = responseText;
    }

    // 응답 헤더 복사
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // CORS 관련 헤더는 제외
      if (
        !key.toLowerCase().startsWith("access-control") &&
        key.toLowerCase() !== "content-encoding"
      ) {
        responseHeaders.set(key, value);
      }
    });

    return NextResponse.json(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        error: "Proxy request failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

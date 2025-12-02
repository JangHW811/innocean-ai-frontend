// src/apis/common.ts
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestConfig<TBody = unknown> = Omit<RequestInit, "body" | "headers"> & {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
};

// 프로덕션에서는 Next.js 프록시를 사용, 개발 환경에서는 직접 API 서버 사용
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api/proxy"
    : process.env.NEXT_PUBLIC_API_URL ?? "";

const serializeParams = (params?: RequestConfig["params"]) =>
  params
    ? `?${new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString()}`
    : "";

function buildBody(body: unknown) {
  if (
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof ArrayBuffer
  ) {
    return body;
  }
  return body ? JSON.stringify(body) : undefined;
}

async function request<TResponse, TBody = unknown>(
  url: string,
  { method = "GET", body, params, headers, ...rest }: RequestConfig<TBody> = {}
): Promise<TResponse> {
  const finalUrl = `${BASE_URL}${url}${serializeParams(params)}`;
  const finalBody = buildBody(body);
  const isForm = finalBody instanceof FormData;
  const finalHeaders = {
    ...(isForm ? {} : { "Content-Type": "application/json" }),
    ...headers,
  };

  console.log("finalHeaders", finalHeaders);
  const res = await fetch(finalUrl, {
    method,
    body: finalBody,
    headers: finalHeaders,
    ...rest,
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`[${res.status}] ${errorBody}`);
  }

  if (res.status === 204) return undefined as TResponse;
  return (await res.json()) as TResponse;
}

export const http = {
  get: <T>(url: string, config?: RequestConfig) =>
    request<T>(url, { ...config, method: "GET" }),
  post: <T, B = unknown>(url: string, body?: B, config?: RequestConfig<B>) =>
    request<T, B>(url, { ...config, method: "POST", body }),
  put: <T, B = unknown>(url: string, body?: B, config?: RequestConfig<B>) =>
    request<T, B>(url, { ...config, method: "PUT", body }),
  patch: <T, B = unknown>(url: string, body?: B, config?: RequestConfig<B>) =>
    request<T, B>(url, { ...config, method: "PATCH", body }),
  delete: <T>(url: string, config?: RequestConfig) =>
    request<T>(url, { ...config, method: "DELETE" }),
  multipart: <T>(
    url: string,
    body: FormData,
    config?: RequestConfig<FormData>
  ) =>
    request<T, FormData>(url, {
      ...config,
      method: "POST",
      body,
    }),
};

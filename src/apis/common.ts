// src/apis/common.ts
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestConfig<TBody = unknown> = Omit<RequestInit, "body" | "headers"> & {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  skipErrorHandling?: boolean; // 에러 처리를 건너뛸지 여부
};

// HTTP 에러 클래스
export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public message: string,
    public data?: unknown,
    public url?: string
  ) {
    super(message);
    this.name = "HttpError";
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  // 상태 코드별 에러 타입 확인 메서드
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  isServerError(): boolean {
    return this.status >= 500 && this.status < 600;
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }

  isForbidden(): boolean {
    return this.status === 403;
  }

  isNotFound(): boolean {
    return this.status === 404;
  }
}

// 상태 코드별 기본 에러 메시지
const getDefaultErrorMessage = (status: number): string => {
  const errorMessages: Record<number, string> = {
    400: "잘못된 요청입니다.",
    401: "인증이 필요합니다. 다시 로그인해주세요.",
    403: "접근 권한이 없습니다.",
    404: "요청하신 리소스를 찾을 수 없습니다.",
    405: "지원하지 않는 메서드입니다.",
    408: "요청 시간이 초과되었습니다.",
    409: "요청과 충돌이 발생했습니다.",
    422: "입력한 데이터를 확인해주세요.",
    429: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
    500: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
    502: "게이트웨이 오류가 발생했습니다.",
    503: "서비스를 일시적으로 사용할 수 없습니다.",
    504: "게이트웨이 타임아웃이 발생했습니다.",
  };

  return (
    errorMessages[status] || `요청 처리 중 오류가 발생했습니다. (${status})`
  );
};

// 에러 응답 파싱
async function parseErrorResponse(
  response: Response
): Promise<{ message: string; data?: unknown }> {
  const contentType = response.headers.get("content-type");
  let message = getDefaultErrorMessage(response.status);
  let data: unknown;

  try {
    if (contentType?.includes("application/json")) {
      data = await response.json();
      // JSON 응답에서 에러 메시지 추출 시도
      if (data && typeof data === "object") {
        const errorData = data as Record<string, unknown>;
        if (errorData.message && typeof errorData.message === "string") {
          message = errorData.message;
        } else if (errorData.error && typeof errorData.error === "string") {
          message = errorData.error;
        } else if (errorData.detail && typeof errorData.detail === "string") {
          message = errorData.detail;
        }
      }
    } else {
      const text = await response.text();
      if (text) {
        message = text.length > 200 ? `${text.substring(0, 200)}...` : text;
      }
    }
  } catch (parseError) {
    // 에러 응답 파싱 실패 시 기본 메시지 사용
    console.warn("Failed to parse error response:", parseError);
  }

  return { message, data };
}

// 네트워크 에러 처리
function handleNetworkError(error: unknown, url: string): HttpError {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return new HttpError(
      0,
      "NetworkError",
      "네트워크 연결을 확인해주세요.",
      { originalError: error.message },
      url
    );
  }
  throw error;
}

// 프로덕션에서는 Next.js 프록시를 사용, 개발 환경에서는 직접 API 서버 사용
// 프록시를 통해 HTTPS 프론트엔드에서 HTTP 백엔드로 안전하게 요청 가능
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
  {
    method = "GET",
    body,
    params,
    headers,
    skipErrorHandling = false,
    ...rest
  }: RequestConfig<TBody> = {}
): Promise<TResponse> {
  const finalUrl = `${BASE_URL}${url}${serializeParams(params)}`;
  const finalBody = buildBody(body);
  const isForm = finalBody instanceof FormData;
  const finalHeaders = {
    ...(isForm ? {} : { "Content-Type": "application/json" }),
    ...headers,
  };

  let res: Response;

  try {
    res = await fetch(finalUrl, {
      method,
      body: finalBody,
      headers: finalHeaders,
      ...rest,
    });
  } catch (error) {
    const networkError = handleNetworkError(error, finalUrl);
    if (skipErrorHandling) {
      throw networkError;
    }
    throw networkError;
  }

  if (!res.ok) {
    const { message, data } = await parseErrorResponse(res);
    const httpError = new HttpError(
      res.status,
      res.statusText,
      message,
      data,
      finalUrl
    );

    if (skipErrorHandling) {
      throw httpError;
    }

    // 공통 에러 처리 (로그, 리다이렉션 등)
    handleError(httpError);
    throw httpError;
  }

  if (res.status === 204) return undefined as TResponse;

  try {
    return (await res.json()) as TResponse;
  } catch (parseError) {
    // JSON 파싱 에러 처리
    const parseHttpError = new HttpError(
      500,
      "ParseError",
      "응답 데이터를 파싱할 수 없습니다.",
      {
        originalError:
          parseError instanceof Error ? parseError.message : String(parseError),
      },
      finalUrl
    );
    if (skipErrorHandling) {
      throw parseHttpError;
    }
    handleError(parseHttpError);
    throw parseHttpError;
  }
}

async function requestText(
  url: string,
  {
    method = "GET",
    body,
    params,
    headers,
    skipErrorHandling = false,
    ...rest
  }: RequestConfig = {}
): Promise<string> {
  const finalUrl = `${BASE_URL}${url}${serializeParams(params)}`;
  const finalBody = buildBody(body);
  const isForm = finalBody instanceof FormData;
  const finalHeaders = {
    ...(isForm ? {} : { "Content-Type": "application/json" }),
    ...headers,
  };

  let res: Response;

  try {
    res = await fetch(finalUrl, {
      method,
      body: finalBody,
      headers: finalHeaders,
      ...rest,
    });
  } catch (error) {
    const networkError = handleNetworkError(error, finalUrl);
    if (skipErrorHandling) {
      throw networkError;
    }
    throw networkError;
  }

  if (!res.ok) {
    const { message, data } = await parseErrorResponse(res);
    const httpError = new HttpError(
      res.status,
      res.statusText,
      message,
      data,
      finalUrl
    );

    if (skipErrorHandling) {
      throw httpError;
    }

    handleError(httpError);
    throw httpError;
  }

  if (res.status === 204) return "";
  return await res.text();
}

// 공통 에러 핸들러
function handleError(error: HttpError): void {
  // 에러 로깅
  console.error("[HTTP Error]", {
    status: error.status,
    statusText: error.statusText,
    message: error.message,
    url: error.url,
    data: error.data,
  });

  // 401 에러 시 로그인 페이지로 리다이렉션 (필요시)
  if (error.isUnauthorized() && typeof window !== "undefined") {
    // 인증 에러 처리 로직을 여기에 추가할 수 있습니다
    // 예: localStorage.clear(), router.push('/login') 등
  }

  // 필요시 다른 공통 처리 로직 추가
  // 예: 에러 리포팅, 토스트 메시지 등
}

export const http = {
  get: <T>(url: string, config?: RequestConfig) =>
    request<T>(url, { ...config, method: "GET" }),
  getText: (url: string, config?: RequestConfig) =>
    requestText(url, { ...config, method: "GET" }),
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

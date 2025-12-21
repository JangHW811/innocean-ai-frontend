"use client";

import { http } from "@/apis/common";
import {
  QueryClient,
  QueryClientProvider,
  type QueryFunctionContext,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

const TanstackQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            retryOnMount: false,
            queryFn: (params: QueryFunctionContext) => {
              const [urlPattern, queryParams] = params.queryKey as [
                string,
                Record<string, string | number | boolean> | undefined
              ];

              // URL 패턴에서 :paramName 형식의 파라미터를 치환
              let finalUrl = urlPattern;
              const remainingParams: Record<string, string | number | boolean> =
                {};

              if (queryParams) {
                // URL 패턴에서 :paramName 찾기
                const paramMatches = urlPattern.matchAll(/:(\w+)/g);
                const pathParams = new Set<string>();

                for (const match of paramMatches) {
                  const paramName = match[1];
                  pathParams.add(paramName);

                  if (queryParams[paramName] !== undefined) {
                    // URL 경로에 파라미터 값 치환
                    finalUrl = finalUrl.replace(
                      `:${paramName}`,
                      String(queryParams[paramName])
                    );
                  }
                }

                // 경로 파라미터가 아닌 것들만 query params로 남김
                Object.entries(queryParams).forEach(([key, value]) => {
                  if (!pathParams.has(key)) {
                    remainingParams[key] = value;
                  }
                });
              }

              return http.get(finalUrl, {
                params:
                  Object.keys(remainingParams).length > 0
                    ? remainingParams
                    : undefined,
              });
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default TanstackQueryProvider;

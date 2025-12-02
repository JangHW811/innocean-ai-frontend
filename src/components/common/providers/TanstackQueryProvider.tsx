"use client";

import {
  type DefaultedQueryObserverOptions,
  QueryClient,
  QueryClientProvider,
  type QueryFunctionContext,
} from "@tanstack/react-query";
import { http } from "@/apis/common";

const TanstackQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  queryClient.defaultQueryOptions({
    queryFn: (params: QueryFunctionContext) => {
      const [url, queryParams] = params.queryKey as [
        string,
        Record<string, string | number | boolean>
      ];
      return http.get(url, { params: queryParams });
    },
  } as DefaultedQueryObserverOptions<unknown, Error, unknown, unknown, readonly unknown[]>);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanstackQueryProvider;

import { Suspense } from "react";
import { AlertRoot } from "./AlertProvider";
import TanstackQueryProvider from "./TanstackQueryProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TanstackQueryProvider>
        {children}
        <AlertRoot />
      </TanstackQueryProvider>
    </Suspense>
  );
};

export default Providers;

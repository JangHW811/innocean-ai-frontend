import { Suspense } from "react";
import { Toaster } from "sonner";
import { AlertRoot } from "./AlertProvider";
import TanstackQueryProvider from "./TanstackQueryProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Toaster />
      <TanstackQueryProvider>
        {children}
        <AlertRoot />
      </TanstackQueryProvider>
    </Suspense>
  );
};

export default Providers;

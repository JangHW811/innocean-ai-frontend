import { AlertRoot } from "./AlertProvider";
import TanstackQueryProvider from "./TanstackQueryProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <TanstackQueryProvider>
      {children}
      <AlertRoot />
    </TanstackQueryProvider>
  );
};

export default Providers;

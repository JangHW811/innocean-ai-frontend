import { AlertProvider } from "@/components/common/providers/AlertProvider";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <AlertProvider>
      <Layout />
    </AlertProvider>
  );
}

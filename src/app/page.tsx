"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Providers from "@/components/common/providers";
import Layout from "@/components/Layout";
import { useAuthStore } from "@/stores/authStore";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Providers>
      <Layout />
    </Providers>
  );
}

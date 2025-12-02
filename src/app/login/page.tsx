"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import Providers from "@/components/common/providers";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <Providers>
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8 shadow-2xl">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">로그인</h1>
            <p className="text-muted-foreground text-sm">
              이메일과 비밀번호를 입력하여 로그인하세요
            </p>
          </div>
          <LoginForm />
        </div>
        <p className="absolute bottom-6 text-center text-xs text-muted-foreground">
          © 2024 INNOCEAN. All rights reserved.
        </p>
      </div>
    </Providers>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { USERS } from "@/data/users";
import { useAuthStore } from "@/stores/authStore";

interface LoginFormData {
  id: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      id: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setError(null);

    const isValid = USERS.some(
      (account) => account.id === data.id && account.password === data.password
    );

    if (isValid) {
      setAuth(data.id);
      router.push("/");
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      <div className="space-y-4">
        <Field>
          <FieldLabel htmlFor="id">아이디</FieldLabel>
          <FieldContent>
            <Input
              id="id"
              type="id"
              placeholder="아이디를 입력하세요"
              {...register("id", {
                required: "아이디를 입력해주세요",
              })}
            />
            <FieldError errors={[errors.id]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">비밀번호</FieldLabel>
          <FieldContent>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              {...register("password", {
                required: "비밀번호를 입력해주세요",
                minLength: {
                  value: 6,
                  message: "비밀번호는 최소 6자 이상이어야 합니다",
                },
              })}
            />
            <FieldError errors={[errors.password]} />
          </FieldContent>
        </Field>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full">
        로그인
      </Button>
    </form>
  );
}

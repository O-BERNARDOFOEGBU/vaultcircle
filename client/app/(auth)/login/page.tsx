"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AxiosError } from "axios";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/api/auth/login", form);
      return res.data.data;
    },
    onSuccess: (user) => {
      setUser(user);
      router.replace("/dashboard");
    },
    onError: (err: AxiosError<{ message: string; errors?: Record<string, string[]> }>) => {
      const data = err.response?.data;
      if (data?.errors) {
        const flat: Record<string, string> = {};
        Object.entries(data.errors).forEach(([k, v]) => (flat[k] = v[0]));
        setErrors(flat);
      } else {
        setErrors({ general: data?.message || "Login failed" });
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-500 mt-0.5">Sign in to your account</p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
            {errors.general}
          </div>
        )}

        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="••••••••"
        />

        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Sign in
        </Button>
      </div>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-emerald-600 font-medium hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}

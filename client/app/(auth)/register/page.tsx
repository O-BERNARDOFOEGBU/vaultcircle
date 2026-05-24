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

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/api/auth/register", form);
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
        setErrors({ general: data?.message || "Registration failed" });
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
          <h2 className="text-xl font-bold text-slate-900">Create account</h2>
          <p className="text-sm text-slate-500 mt-0.5">Start your savings journey</p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
            {errors.general}
          </div>
        )}

        <Input
          label="Full name"
          name="name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Ada Lovelace"
        />
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
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Min. 6 characters"
        />

        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Create account
        </Button>
      </div>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

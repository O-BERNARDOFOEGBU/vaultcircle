"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { queryClient as qc } from "@/lib/queryClient";
import { AxiosError } from "axios";

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const globalQc = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    bio: user?.bio ?? "",
    occupation: user?.occupation ?? "",
    savingsGoal: user?.savingsGoal?.toString() ?? "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        bio: user.bio ?? "",
        occupation: user.occupation ?? "",
        savingsGoal: user.savingsGoal?.toString() ?? "",
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name || undefined,
        bio: form.bio || undefined,
        occupation: form.occupation || undefined,
        savingsGoal: form.savingsGoal ? Number(form.savingsGoal) : undefined,
      };
      const res = await api.patch("/api/users/me", payload);
      return res.data.data;
    },
    onSuccess: (updated) => {
      setUser(updated);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      setError(err.response?.data?.message || "Update failed");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => api.post("/api/auth/logout"),
    onSuccess: () => {
      logout();
      qc.clear();
      globalQc.clear();
      router.push("/login");
    },
  });

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-slate-900">Profile</h1>

      {/* Avatar + name card */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-slate-900 truncate">{user.name}</p>
            <p className="text-sm text-slate-500 truncate">{user.email}</p>
            {user.occupation && (
              <p className="text-xs text-slate-400 mt-0.5 truncate">{user.occupation}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Success */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Profile updated successfully
        </div>
      )}

      {/* Edit form */}
      {editing ? (
        <Card>
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-slate-900">Edit Profile</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
            )}

            <Input
              label="Full name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ada Lovelace"
            />
            <Input
              label="Bio"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="Tell us about yourself"
            />
            <Input
              label="Occupation"
              value={form.occupation}
              onChange={(e) => setForm((f) => ({ ...f, occupation: e.target.value }))}
              placeholder="Software Engineer"
            />
            <Input
              label="Savings goal ₦"
              type="number"
              min="1"
              value={form.savingsGoal}
              onChange={(e) => setForm((f) => ({ ...f, savingsGoal: e.target.value }))}
              placeholder="1000000"
            />

            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => { setEditing(false); setError(""); }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => updateMutation.mutate()}
                loading={updateMutation.isPending}
              >
                Save changes
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Details</h2>
              <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
                Edit
              </Button>
            </div>

            <div className="space-y-3">
              <Detail label="Email" value={user.email} />
              <Detail label="Bio" value={user.bio || "—"} />
              <Detail label="Occupation" value={user.occupation || "—"} />
              <Detail
                label="Savings Goal"
                value={user.savingsGoal ? `₦${user.savingsGoal.toLocaleString()}` : "—"}
              />
              <Detail
                label="Member since"
                value={new Date(user.createdAt).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Sign out */}
      <Button
        variant="danger"
        className="w-full"
        onClick={() => logoutMutation.mutate()}
        loading={logoutMutation.isPending}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sign out
      </Button>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-500 font-medium shrink-0">{label}</span>
      <span className="text-sm text-slate-900 text-right">{value}</span>
    </div>
  );
}

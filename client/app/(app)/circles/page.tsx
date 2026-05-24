"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { AxiosError } from "axios";

interface Circle {
  id: string;
  name: string;
  description?: string;
  targetAmount?: number;
  createdAt: string;
  owner: { id: string; name: string; email: string };
  _count: { members: number };
}

function CreateCircleModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", description: "", targetAmount: "" });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        targetAmount: form.targetAmount ? Number(form.targetAmount) : undefined,
      };
      const res = await api.post("/api/circles", payload);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["circles"] });
      onClose();
    },
    onError: (err: AxiosError<{ message: string }>) => {
      setError(err.response?.data?.message || "Failed to create circle");
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">New Circle</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <Input
          label="Circle name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Holiday Savings"
        />
        <Input
          label="Description (optional)"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="What is this circle for?"
        />
        <Input
          label="Target amount ₦ (optional)"
          type="number"
          min="1"
          value={form.targetAmount}
          onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))}
          placeholder="500000"
        />

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
            disabled={!form.name.trim()}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CirclesPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const { data: circles, isLoading } = useQuery<Circle[]>({
    queryKey: ["circles"],
    queryFn: async () => {
      const res = await api.get("/api/circles");
      return res.data.data;
    },
  });

  const filtered = circles?.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Circles</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {circles ? `${circles.length} circle${circles.length !== 1 ? "s" : ""}` : "Loading..."}
          </p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search circles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((circle) => (
            <Card key={circle.id} onClick={() => router.push(`/circles/${circle.id}`)}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900 truncate">{circle.name}</p>
                    {circle.owner.id === user?.id && (
                      <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium shrink-0">
                        Owner
                      </span>
                    )}
                  </div>
                  {circle.description && (
                    <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{circle.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.916-3.527M9 20H4v-2a4 4 0 015.916-3.527M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {circle._count.members} member{circle._count.members !== 1 ? "s" : ""}
                    </span>
                    <span className="text-xs text-slate-400">{circle.owner.name}</span>
                  </div>
                </div>
                {circle.targetAmount && (
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-600">₦{circle.targetAmount.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">target</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.5} className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.916-3.527M9 20H4v-2a4 4 0 015.916-3.527M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm font-medium">
              {search ? "No circles match your search" : "No circles yet"}
            </p>
            {!search && (
              <Button size="sm" className="mt-4" onClick={() => setShowCreate(true)}>
                Create the first one
              </Button>
            )}
          </div>
        </Card>
      )}

      {showCreate && <CreateCircleModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}

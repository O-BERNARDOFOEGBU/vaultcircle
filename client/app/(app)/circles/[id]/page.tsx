"use client";

import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { PageSkeleton } from "@/components/ui/Skeleton";

interface Member {
  id: string;
  role: "OWNER" | "MEMBER";
  joinedAt: string;
  user: { id: string; name: string; email: string };
}

interface Circle {
  id: string;
  name: string;
  description?: string;
  targetAmount?: number;
  createdAt: string;
  owner: { id: string; name: string; email: string };
  members: Member[];
}

export default function CircleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();

  const { data: circle, isLoading, error } = useQuery<Circle>({
    queryKey: ["circle", id],
    queryFn: async () => {
      const res = await api.get(`/api/circles/${id}`);
      return res.data.data;
    },
  });

  const membership = circle?.members.find((m) => m.user.id === user?.id);
  const isOwner = membership?.role === "OWNER";
  const isMember = !!membership;

  const joinMutation = useMutation({
    mutationFn: () => api.post(`/api/circles/${id}/join`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["circle", id] });
      qc.invalidateQueries({ queryKey: ["circles"] });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => api.delete(`/api/circles/${id}/leave`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["circle", id] });
      qc.invalidateQueries({ queryKey: ["circles"] });
      router.push("/circles");
    },
  });

  if (isLoading) return <PageSkeleton />;

  if (error || !circle) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Circle not found</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.push("/circles")}>
          Back to circles
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors min-h-[44px]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header card */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-slate-900">{circle.name}</h1>
              {circle.description && (
                <p className="text-sm text-slate-500 mt-1">{circle.description}</p>
              )}
            </div>
            {isOwner && (
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium shrink-0">
                Owner
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500">Members</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{circle.members.length}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500">Target</p>
              <p className="text-xl font-bold text-emerald-600 mt-0.5">
                {circle.targetAmount ? `₦${circle.targetAmount.toLocaleString()}` : "—"}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Created by <span className="font-medium text-slate-600">{circle.owner.name}</span>
            {" · "}
            {new Date(circle.createdAt).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
          </div>

          {/* Join / Leave */}
          {!isMember && (
            <Button
              className="w-full"
              onClick={() => joinMutation.mutate()}
              loading={joinMutation.isPending}
            >
              Join circle
            </Button>
          )}
          {isMember && !isOwner && (
            <Button
              variant="danger"
              className="w-full"
              onClick={() => leaveMutation.mutate()}
              loading={leaveMutation.isPending}
            >
              Leave circle
            </Button>
          )}
        </div>
      </Card>

      {/* Members list */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          Members ({circle.members.length})
        </h2>
        <div className="space-y-2">
          {circle.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 border border-slate-100"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-emerald-700">
                  {member.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-900 truncate">{member.user.name}</p>
                  {member.user.id === user?.id && (
                    <span className="text-xs text-slate-400">(you)</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate">{member.user.email}</p>
              </div>
              {member.role === "OWNER" && (
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium shrink-0">
                  Owner
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

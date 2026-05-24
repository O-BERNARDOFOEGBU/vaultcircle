"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth";
import Card from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useRouter } from "next/navigation";

interface Circle {
  id: string;
  name: string;
  description?: string;
  targetAmount?: number;
  createdAt: string;
  owner: { id: string; name: string; email: string };
  _count: { members: number };
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const { data: circles, isLoading } = useQuery<Circle[]>({
    queryKey: ["circles"],
    queryFn: async () => {
      const res = await api.get("/api/circles");
      return res.data.data;
    },
  });

  const myCircles = circles?.filter(
    (c) => c.owner.id === user?.id || false
  ) ?? [];
  const joinedCircles = circles?.filter(
    (c) => c.owner.id !== user?.id
  ) ?? [];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-slate-500">{greeting()}</p>
        <h1 className="text-2xl font-bold text-slate-900">{user?.name?.split(" ")[0]} 👋</h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-600 rounded-2xl p-4 text-white">
          <p className="text-xs font-medium text-emerald-100">My Circles</p>
          <p className="text-3xl font-bold mt-1">
            {isLoading ? "—" : myCircles.length}
          </p>
          <p className="text-xs text-emerald-100 mt-1">created by you</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Joined</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {isLoading ? "—" : joinedCircles.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">circles joined</p>
        </div>
      </div>

      {/* Savings goal */}
      {user?.savingsGoal && (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Savings Goal</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                ₦{user.savingsGoal.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth={1.8} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </Card>
      )}

      {/* Recent circles */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-700">Recent Circles</h2>
          <Link href="/circles" className="text-xs text-emerald-600 font-medium hover:underline">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : circles && circles.length > 0 ? (
          <div className="space-y-3">
            {circles.slice(0, 3).map((circle) => (
              <Card key={circle.id} onClick={() => router.push(`/circles/${circle.id}`)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate">{circle.name}</p>
                    {circle.description && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{circle.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-400">
                        {circle._count.members} member{circle._count.members !== 1 ? "s" : ""}
                      </span>
                      {circle.owner.id === user?.id && (
                        <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                          Owner
                        </span>
                      )}
                    </div>
                  </div>
                  {circle.targetAmount && (
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-slate-900">
                        ₦{circle.targetAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400">target</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-4">
              <p className="text-slate-500 text-sm">No circles yet</p>
              <Link href="/circles" className="text-emerald-600 text-sm font-medium hover:underline mt-1 block">
                Browse or create one
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { PageSkeleton } from "@/components/ui/Skeleton";
import AppShell from "@/components/nav/AppShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoaded } = useAuthStore();

  useEffect(() => {
    if (isLoaded && !user) router.replace("/login");
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-slate-200 md:flex md:ml-64 md:items-start md:justify-center md:py-8">
        <div className="w-full max-w-[430px] bg-white md:rounded-[2rem] md:shadow-xl p-5">
          <PageSkeleton />
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}

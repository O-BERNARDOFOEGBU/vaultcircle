"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { PageSkeleton } from "@/components/ui/Skeleton";

export default function Home() {
  const router = useRouter();
  const { user, isLoaded } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) return;
    router.replace(user ? "/dashboard" : "/login");
  }, [isLoaded, user, router]);

  return <PageSkeleton />;
}

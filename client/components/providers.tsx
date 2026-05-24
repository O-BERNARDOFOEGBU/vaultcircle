"use client";

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/store/auth";
import api from "@/lib/axios";

function AuthLoader({ children }: { children: React.ReactNode }) {
  const { setUser, setLoaded } = useAuthStore();

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setLoaded());
  }, [setUser, setLoaded]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthLoader>{children}</AuthLoader>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

"use client";

import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  occupation?: string | null;
  savingsGoal?: number | null;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoaded: boolean;
  setUser: (user: User | null) => void;
  setLoaded: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoaded: false,
  setUser: (user) => set({ user }),
  setLoaded: () => set({ isLoaded: true }),
  logout: () => set({ user: null }),
}));

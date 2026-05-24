"use client";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-start">
      <div className="
        relative w-full max-w-[430px] min-h-screen
        bg-white flex flex-col
        md:min-h-screen
        md:shadow-2xl md:shadow-slate-400/40
      ">
        <div className="flex-1 px-4 py-6 pb-24">
          {children}
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
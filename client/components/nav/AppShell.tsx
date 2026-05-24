"use client";

import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    /* Desktop surface — sidebar sits on slate-200, phone frame floats over it */
    <div className="min-h-screen bg-slate-200">
      <Sidebar />

      {/* Content column — centred next to the sidebar */}
      <div className="md:ml-64 min-h-screen flex flex-col md:items-center md:justify-start md:py-8 pb-20 md:pb-8">
        {/* Phone frame: fills screen on mobile, 430px rounded card on desktop */}
        <div className="
          w-full max-w-[430px] flex-1
          bg-white
          md:rounded-[2rem] md:shadow-xl md:shadow-slate-400/30
          md:overflow-hidden md:flex-none
        ">
          <div className="px-4 py-6 md:px-5 md:py-7">
            {children}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

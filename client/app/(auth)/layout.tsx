// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/auth";
// import { PageSkeleton } from "@/components/ui/Skeleton";

// export default function AuthLayout({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const { user, isLoaded } = useAuthStore();

//   useEffect(() => {
//     if (isLoaded && user) router.replace("/dashboard");
//   }, [isLoaded, user, router]);

//   if (!isLoaded) return <PageSkeleton />;
//   if (user) return <PageSkeleton />;

//   return (
//     /* Desktop: slate surface so the phone "sits" on a table */
//     <div className="min-h-screen bg-slate-200 md:flex md:items-center md:justify-center md:py-10">
//       {/* Phone frame — fills screen on mobile, 430px card with shadow on desktop */}
//       <div className="
//         relative w-full min-h-screen
//         bg-gradient-to-b from-emerald-50 via-white to-slate-50
//         flex flex-col justify-center px-5 py-12
//         md:min-h-0 md:max-w-[430px] md:mx-auto
//         md:rounded-[2.5rem] md:shadow-2xl md:shadow-slate-400/40
//         md:py-14 md:px-8
//       ">
//         {/* Brand */}
//         <div className="text-center mb-10">
//           <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-300/50">
//             <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-9 h-9">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold text-slate-900">VaultCircle</h1>
//           <p className="text-sm text-slate-500 mt-1">Savings circles for communities</p>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { PageSkeleton } from "@/components/ui/Skeleton";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoaded } = useAuthStore();

  useEffect(() => {
    if (isLoaded && user) router.replace("/dashboard");
  }, [isLoaded, user, router]);

  if (!isLoaded) return <PageSkeleton />;
  if (user) return <PageSkeleton />;

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center py-10">
      <div className="
        relative w-full max-w-[430px] min-h-screen
        bg-gradient-to-b from-emerald-50 via-white to-slate-50
        flex flex-col justify-center px-5 py-12
        shadow-2xl shadow-slate-400/40
      ">

        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-300/50">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-9 h-9">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">VaultCircle</h1>
          <p className="text-sm text-slate-500 mt-1">Savings circles for communities</p>
        </div>
        {children}
      </div>
    </div>
  );
}

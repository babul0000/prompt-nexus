"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardIndexPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else if (status === "authenticated" && session?.user) {
      const role = session.user.role?.toLowerCase();
      if (role === "admin") {
        router.replace("/dashboard/admin/overview");
      } else if (role === "creator") {
        router.replace("/dashboard/creator");
      } else {
        router.replace("/dashboard/user/my-prompts");
      }
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030014] text-white">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
}

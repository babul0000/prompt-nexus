"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

export default function ProfileRedirectPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace('/auth/signin');
      } else {
        const role = (session.user.role || 'user').toLowerCase();
        router.replace(`/dashboard/${role}/profile`);
      }
    }
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen bg-[#030014] text-white flex items-center justify-center flex-col gap-4">
      <div className="w-12 h-12 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest animate-pulse">Redirecting to profile...</p>
    </div>
  );
}

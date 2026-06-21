"use client";

import { useSession } from "@/lib/auth-client";
import { getMyPrompts } from "@/lib/api/prompt";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Mail, FileText, CheckCircle2, Gem } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, isPending: sessionPending } = useSession();
  const user = session?.user;

  const [promptsCount, setPromptsCount] = useState(0);
  const [loadingPrompts, setLoadingPrompts] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const fetchCounts = async () => {
        try {
          const data = await getMyPrompts(user.id);
          setPromptsCount(data ? data.length : 0);
        } catch (err) {
          console.error("Failed to load prompts count:", err);
        } finally {
          setLoadingPrompts(false);
        }
      };
      fetchCounts();
    }
  }, [user]);

  if (sessionPending) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        <p className="text-sm text-zinc-400 font-medium">Loading profile details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
        <p className="text-sm text-zinc-400 font-medium">No session found. Please sign in.</p>
        <Link href="/auth/signin">
          <button className="px-4 py-2 bg-purple-600 rounded-lg text-xs font-bold text-white hover:bg-purple-500 transition">
            Sign In
          </button>
        </Link>
      </div>
    );
  }

  const avatarFallback = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative min-h-screen bg-[#030014] text-white pt-6 pb-20 px-4 sm:px-6">
      {/* Background glowing rings */}
      <div className="absolute top-[5%] left-1/4 -translate-x-1/2 w-[350px] h-[200px] bg-purple-650/5 blur-[90px] rounded-full pointer-events-none" />
      <div className="absolute top-[25%] right-1/4 translate-x-1/2 w-[350px] h-[200px] bg-blue-650/5 blur-[90px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto relative z-10 space-y-8"
      >
        {/* Header Block */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-none">
            User Account Profile
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Manage your plan, credentials, and published prompt details.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#0a0d26] border border-[#13193e] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          {/* Accent glow corner */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 relative z-10">
            {/* Avatar Circle with Custom Purple Glow */}
            <div className="relative shrink-0 flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#38BDF8] p-[3px] shadow-[0_0_20px_rgba(124,58,237,0.35)]">
              <div className="w-full h-full bg-[#040614] rounded-full flex items-center justify-center overflow-hidden">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-3xl font-black text-white tracking-wide">
                    {avatarFallback}
                  </span>
                )}
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="flex-1 text-center sm:text-left space-y-4 mt-2">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {user.name}
                </h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-zinc-400 text-sm">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  <span className="font-medium text-xs sm:text-sm">{user.email}</span>
                </div>
              </div>

              {/* Badges Container */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                <span className="bg-purple-950/40 text-purple-400 border border-purple-500/20 px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-md">
                  ROLE: {user.role || "USER"}
                </span>
                <span className="bg-amber-950/40 text-amber-400 border border-amber-500/20 px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-md">
                  PLAN: {user.plan?.toUpperCase() || "FREE"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Card 1: Prompts Published */}
          <div className="bg-[#0a0d26] border border-[#13193e] p-6 sm:p-7 rounded-2xl flex flex-col justify-between gap-4 shadow-lg min-h-[130px]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[#7C3AED]">
                <FileText className="w-4 h-4" />
                <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">
                  Prompts Published
                </span>
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">
              {loadingPrompts ? "..." : promptsCount}
            </div>
          </div>

          {/* Card 2: Account Status */}
          <div className="bg-[#0a0d26] border border-[#13193e] p-6 sm:p-7 rounded-2xl flex flex-col justify-between gap-4 shadow-lg min-h-[130px]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">
                  Account Status
                </span>
              </div>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-emerald-400">
              Verified Member
            </div>
          </div>
        </div>

        {/* Upgrade Banner Container */}
        <div className="border border-dashed border-[#1e2554] bg-[#090a16]/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden backdrop-blur-md">
          {/* Cyan Glow ring underneath banner */}
          <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-cyan-500/5 rounded-full blur-[60px] pointer-events-none" />

          {/* Left Description info */}
          <div className="flex items-start gap-4 max-w-xl">
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-zinc-300">
              <Gem className="w-5 h-5" />
            </div>
            <div className="space-y-1 mt-0.5 text-left">
              <h4 className="text-sm sm:text-base font-bold text-white">
                Upgrade to Pro Lifetime
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Unlock access to all private prompt templates, parameter sets, and community reviews for a single one-time contribution of $5.
              </p>
            </div>
          </div>

          {/* Right Action Button */}
          <Link href="/payment" className="shrink-0">
            <button className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black text-xs font-extrabold px-6 py-3.5 rounded-xl transition duration-300 cursor-pointer shadow-[0_0_18px_rgba(6,182,212,0.25)]">
              Upgrade Now ($5)
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
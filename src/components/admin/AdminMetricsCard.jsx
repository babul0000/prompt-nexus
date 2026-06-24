"use client";

import React from "react";
import { Users, FileText, Clock, DollarSign } from "lucide-react";

export default function AdminMetricsCard({ metrics }) {
  const data = metrics || { totalUsers: 0, totalPrompts: 0, pendingModerations: 0, totalRevenue: 0 };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1: Total Users */}
      <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-6 rounded-2xl flex items-center justify-between shadow-sm dark:shadow-none relative overflow-hidden min-h-[110px]">
        <div className="absolute top-0 right-0 w-[120px] h-[60px] bg-purple-500/5 blur-[30px] rounded-full pointer-events-none" />
        <div className="space-y-1 text-left relative z-10">
          <span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-500 tracking-wider uppercase block">Total Users</span>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white">{data.totalUsers}</h3>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Active registrations</p>
        </div>
        <div className="p-3.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl relative z-10">
          <Users className="w-5 h-5" />
        </div>
      </div>

      {/* Card 2: Total Prompts */}
      <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-6 rounded-2xl flex items-center justify-between shadow-sm dark:shadow-none relative overflow-hidden min-h-[110px]">
        <div className="absolute top-0 right-0 w-[120px] h-[60px] bg-blue-500/5 blur-[30px] rounded-full pointer-events-none" />
        <div className="space-y-1 text-left relative z-10">
          <span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-500 tracking-wider uppercase block">Total Prompts</span>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white">{data.totalPrompts}</h3>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Catalog submissions</p>
        </div>
        <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl relative z-10">
          <FileText className="w-5 h-5" />
        </div>
      </div>

      {/* Card 3: Pending Moderations */}
      <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-6 rounded-2xl flex items-center justify-between shadow-sm dark:shadow-none relative overflow-hidden min-h-[110px]">
        <div className="absolute top-0 right-0 w-[120px] h-[60px] bg-amber-500/5 blur-[30px] rounded-full pointer-events-none" />
        <div className="space-y-1 text-left relative z-10">
          <span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-500 tracking-wider uppercase block">Pending Approvals</span>
          <h3 className={`text-3xl font-black ${data.pendingModerations > 0 ? "text-amber-550 dark:text-amber-400" : "text-zinc-900 dark:text-white"}`}>
            {data.pendingModerations}
          </h3>
          <p className="text-[10px] text-zinc-550 dark:text-zinc-400 font-medium">Requires moderation</p>
        </div>
        <div className={`p-3.5 rounded-xl relative z-10 border ${
          data.pendingModerations > 0
            ? "bg-amber-500/15 border-amber-500/30 text-amber-505 dark:text-amber-400 animate-pulse"
            : "bg-zinc-500/10 border-zinc-500/20 text-zinc-500 dark:text-zinc-400"
        }`}>
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Card 4: Total Revenue */}
      <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-6 rounded-2xl flex items-center justify-between shadow-sm dark:shadow-none relative overflow-hidden min-h-[110px]">
        <div className="absolute top-0 right-0 w-[120px] h-[60px] bg-emerald-500/5 blur-[30px] rounded-full pointer-events-none" />
        <div className="space-y-1 text-left relative z-10">
          <span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-500 tracking-wider uppercase block">Total Revenue</span>
          <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">${data.totalRevenue}</h3>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Subscription earnings</p>
        </div>
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl relative z-10">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

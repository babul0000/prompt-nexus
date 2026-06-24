"use client";

import React from "react";
import { Users, FileCheck, Clock, DollarSign, Percent } from "lucide-react";

export default function AdminAnalyticsMetrics({ metrics }) {
  const data = metrics || { totalUsers: 0, activePrompts: 0, pendingApproval: 0, totalRevenue: 0, conversionRate: 0 };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {/* Total Users */}
      <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-5 rounded-2xl flex items-center justify-between shadow-sm dark:shadow-none relative overflow-hidden min-h-[110px]">
        <div className="absolute top-0 right-0 w-[120px] h-[60px] bg-purple-500/5 blur-[30px] rounded-full pointer-events-none" />
        <div className="space-y-1 text-left relative z-10">
          <span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-500 tracking-wider uppercase block">Total Users</span>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white">{data.totalUsers}</h3>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Registered accounts</p>
        </div>
        <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl relative z-10">
          <Users className="w-5 h-5" />
        </div>
      </div>

      {/* Active Prompts */}
      <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-5 rounded-2xl flex items-center justify-between shadow-sm dark:shadow-none relative overflow-hidden min-h-[110px]">
        <div className="absolute top-0 right-0 w-[120px] h-[60px] bg-emerald-500/5 blur-[30px] rounded-full pointer-events-none" />
        <div className="space-y-1 text-left relative z-10">
          <span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-500 tracking-wider uppercase block">Active Prompts</span>
          <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{data.activePrompts}</h3>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Approved and live</p>
        </div>
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl relative z-10">
          <FileCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Pending Approval */}
      <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-5 rounded-2xl flex items-center justify-between shadow-sm dark:shadow-none relative overflow-hidden min-h-[110px]">
        <div className="absolute top-0 right-0 w-[120px] h-[60px] bg-amber-500/5 blur-[30px] rounded-full pointer-events-none" />
        <div className="space-y-1 text-left relative z-10">
          <span className="text-[10px] font-bold text-zinc-555 dark:text-zinc-500 tracking-wider uppercase block">Pending</span>
          <h3 className={`text-3xl font-black ${data.pendingApproval > 0 ? "text-amber-550 dark:text-amber-400" : "text-zinc-900 dark:text-white"}`}>
            {data.pendingApproval}
          </h3>
          <p className="text-[10px] text-zinc-550 dark:text-zinc-400 font-medium">Requires moderation</p>
        </div>
        <div className={`p-3 rounded-xl relative z-10 border ${
          data.pendingApproval > 0
            ? "bg-amber-500/15 border-amber-500/30 text-amber-505 dark:text-amber-400 animate-pulse"
            : "bg-zinc-500/10 border-zinc-500/20 text-zinc-500 dark:text-zinc-400"
        }`}>
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Total Revenue */}
      <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-5 rounded-2xl flex items-center justify-between shadow-sm dark:shadow-none relative overflow-hidden min-h-[110px]">
        <div className="absolute top-0 right-0 w-[120px] h-[60px] bg-blue-500/5 blur-[30px] rounded-full pointer-events-none" />
        <div className="space-y-1 text-left relative z-10">
          <span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-500 tracking-wider uppercase block">Total Revenue</span>
          <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400">${data.totalRevenue}</h3>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Subscription earnings</p>
        </div>
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl relative z-10">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      {/* Subscription Conversion Rate */}
      <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-5 rounded-2xl flex flex-col justify-between shadow-sm dark:shadow-none relative overflow-hidden min-h-[110px] gap-2">
        <div className="absolute top-0 right-0 w-[120px] h-[60px] bg-indigo-500/5 blur-[30px] rounded-full pointer-events-none" />
        <div className="flex items-center justify-between relative z-10 text-left">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-500 tracking-wider uppercase block">Conversion</span>
            <h3 className="text-2xl font-black text-indigo-650 dark:text-indigo-400">{data.conversionRate}%</h3>
          </div>
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative z-10 space-y-1 text-left">
          <div className="w-full bg-zinc-100 dark:bg-zinc-950/80 rounded-full h-1.5 overflow-hidden border border-zinc-200 dark:border-white/5">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(124,58,237,0.3)]"
              style={{ width: `${Math.min(100, Math.max(0, data.conversionRate))}%` }}
            />
          </div>
          <span className="text-[9px] text-zinc-500 block font-medium">Free users upgraded to Pro</span>
        </div>
      </div>
    </div>
  );
}

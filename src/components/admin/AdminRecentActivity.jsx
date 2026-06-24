"use client";

import React from "react";
import { Users, FileText, Gem, Calendar } from "lucide-react";

export default function AdminRecentActivity({ activities }) {
  const recentUsers = activities?.recentUsers || [];
  const recentPrompts = activities?.recentPrompts || [];
  const recentPayments = activities?.recentPayments || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* New User Registrations */}
      <div className="bg-white dark:bg-[#0a0d26]/50 border border-zinc-200 dark:border-[#13193e] p-5 rounded-2xl flex flex-col gap-4 shadow-sm dark:shadow-none relative overflow-hidden min-h-[300px]">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/5 pb-3 text-left">
          <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-purple-400" /> New Users
          </span>
          <span className="text-[9px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 font-bold uppercase tracking-wider">
            Registration
          </span>
        </div>
        
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[220px] scrollbar-thin">
          {recentUsers.length === 0 ? (
            <div className="text-xs text-zinc-500 py-6 text-center">No recent user registrations.</div>
          ) : (
            recentUsers.map(u => (
              <div key={u.id} className="flex items-center justify-between text-xs p-2.5 bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/[0.02] transition">
                <div className="min-w-0 text-left">
                  <div className="font-bold text-zinc-900 dark:text-white truncate max-w-[150px]">{u.name}</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate max-w-[150px]">{u.email}</div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 shrink-0">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(u.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Prompt Submissions */}
      <div className="bg-white dark:bg-[#0a0d26]/50 border border-zinc-200 dark:border-[#13193e] p-5 rounded-2xl flex flex-col gap-4 shadow-sm dark:shadow-none relative overflow-hidden min-h-[300px]">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/5 pb-3 text-left">
          <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-400" /> Recent Prompts
          </span>
          <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase tracking-wider">
            Catalog
          </span>
        </div>
        
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[220px] scrollbar-thin">
          {recentPrompts.length === 0 ? (
            <div className="text-xs text-zinc-500 py-6 text-center">No recent prompt submissions.</div>
          ) : (
            recentPrompts.map(p => (
              <div key={p.id} className="flex items-center justify-between text-xs p-2.5 bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/[0.02] transition">
                <div className="min-w-0 text-left">
                  <div className="font-bold text-zinc-900 dark:text-white truncate max-w-[140px]">{p.title}</div>
                  <div className="text-[9px] text-blue-600 dark:text-blue-400 uppercase font-semibold mt-0.5">{p.category || "General"}</div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 shrink-0">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(p.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Payments Received */}
      <div className="bg-white dark:bg-[#0a0d26]/50 border border-zinc-200 dark:border-[#13193e] p-5 rounded-2xl flex flex-col gap-4 shadow-sm dark:shadow-none relative overflow-hidden min-h-[300px]">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/5 pb-3 text-left">
          <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Gem className="w-4 h-4 text-emerald-400" /> Recent Sales
          </span>
          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wider">
            Payments
          </span>
        </div>
        
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[220px] scrollbar-thin">
          {recentPayments.length === 0 ? (
            <div className="text-xs text-zinc-500 py-6 text-center">No recent premium subscriptions.</div>
          ) : (
            recentPayments.map(pay => (
              <div key={pay.id} className="flex items-center justify-between text-xs p-2.5 bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/[0.02] transition">
                <div className="min-w-0 text-left">
                  <div className="font-bold text-zinc-900 dark:text-white truncate max-w-[130px]">{pay.name}</div>
                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">{pay.email}</div>
                </div>
                <div className="flex flex-col items-end shrink-0 gap-1">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">+$5.00</span>
                  <div className="flex items-center gap-1 text-[9px] text-zinc-500">
                    <Calendar className="w-2.5 h-2.5" />
                    <span>{formatDate(pay.updatedAt)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

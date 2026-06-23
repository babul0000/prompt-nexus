"use client";

import React from "react";
import { DollarSign, Clock, Users, ArrowUpRight } from "lucide-react";

export default function AdminPaymentMetrics({ stats }) {
  const data = stats || { totalRevenue: 0, pendingPayouts: 0, activeSubscriptions: 0, recentTransactions: 0 };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Revenue */}
      <div className="bg-[#0a0d26] border border-[#13193e] p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden min-h-[110px]">
        <div className="absolute top-0 right-0 w-[120px] h-[60px] bg-emerald-500/5 blur-[30px] rounded-full pointer-events-none" />
        <div className="space-y-1 text-left relative z-10">
          <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block">Total Revenue</span>
          <h3 className="text-3xl font-black text-emerald-400">${data.totalRevenue}</h3>
          <p className="text-[10px] text-zinc-400 font-medium">All-time earnings</p>
        </div>
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl relative z-10">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      {/* Pending Payouts */}
      <div className="bg-[#0a0d26] border border-[#13193e] p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden min-h-[110px]">
        <div className="absolute top-0 right-0 w-[120px] h-[60px] bg-amber-500/5 blur-[30px] rounded-full pointer-events-none" />
        <div className="space-y-1 text-left relative z-10">
          <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block">Pending Payouts</span>
          <h3 className="text-3xl font-black text-amber-400">${data.pendingPayouts}</h3>
          <p className="text-[10px] text-zinc-400 font-medium">Owed to creators</p>
        </div>
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl relative z-10">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Active Subscriptions */}
      <div className="bg-[#0a0d26] border border-[#13193e] p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden min-h-[110px]">
        <div className="absolute top-0 right-0 w-[120px] h-[60px] bg-purple-500/5 blur-[30px] rounded-full pointer-events-none" />
        <div className="space-y-1 text-left relative z-10">
          <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block">Active Subs</span>
          <h3 className="text-3xl font-black text-white">{data.activeSubscriptions}</h3>
          <p className="text-[10px] text-zinc-400 font-medium">Pro plan members</p>
        </div>
        <div className="p-3.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl relative z-10">
          <Users className="w-5 h-5" />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-[#0a0d26] border border-[#13193e] p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden min-h-[110px]">
        <div className="absolute top-0 right-0 w-[120px] h-[60px] bg-blue-500/5 blur-[30px] rounded-full pointer-events-none" />
        <div className="space-y-1 text-left relative z-10">
          <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block">Recent Sales</span>
          <h3 className="text-3xl font-black text-blue-400">{data.recentTransactions}</h3>
          <p className="text-[10px] text-zinc-400 font-medium">Past 24 hours</p>
        </div>
        <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl relative z-10">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

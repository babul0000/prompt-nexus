"use client";

import React from "react";
import { Chip, Button } from "@heroui/react";
import { Undo2 } from "lucide-react";

export default function AdminPaymentTable({ transactions, onRefund }) {
  const handleRefundClick = (userId, txnId) => {
    if (window.confirm(`Are you sure you want to refund and revoke the Pro license for transaction ${txnId}?`)) {
      onRefund(userId);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
      <div className="p-5 border-b border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-[#0e1235]/40 text-left">
        <h3 className="text-base font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Transaction History</h3>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Review active customer payments and process refunds.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.01]">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Transaction ID</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">User</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Plan Name</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Amount</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Status</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Date</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-zinc-50/80 dark:hover:bg-white/[0.01] transition-colors">
                <td className="p-4 font-mono text-xs text-purple-600 dark:text-purple-400 font-bold">{txn.id}</td>
                <td className="p-4">
                  <div>
                    <div className="text-sm font-bold text-zinc-900 dark:text-white">{txn.userName}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{txn.userEmail}</div>
                  </div>
                </td>
                <td className="p-4 text-xs text-zinc-700 dark:text-zinc-300 font-semibold">{txn.planName}</td>
                <td className="p-4 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">${txn.amount.toFixed(2)}</td>
                <td className="p-4">
                  <Chip
                    size="sm"
                    variant="flat"
                    color={
                      txn.status === "Success"
                        ? "success"
                        : txn.status === "Pending"
                        ? "warning"
                        : "danger"
                    }
                    className="capitalize text-[10px] font-extrabold px-2.5 py-1"
                  >
                    {txn.status}
                  </Chip>
                </td>
                <td className="p-4 text-xs text-zinc-500 dark:text-zinc-400">{txn.date}</td>
                <td className="p-4 text-right">
                  <Button
                    size="sm"
                    variant="flat"
                    className="text-xs font-bold cursor-pointer rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1.5 ml-auto"
                    onClick={() => handleRefundClick(txn.userId, txn.id)}
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Refund</span>
                  </Button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="7" className="p-12 text-center text-zinc-500 text-sm">
                  No transaction records found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

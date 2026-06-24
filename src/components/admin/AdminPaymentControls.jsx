"use client";

import React from "react";
import { Search, Download } from "lucide-react";
import { Button } from "@heroui/react";

export default function AdminPaymentControls({ search, setSearch, onExportCSV }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-4 rounded-2xl shadow-sm dark:shadow-none">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by transaction ID, name, or email..."
          className="w-full bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Export CSV Action */}
      <Button
        size="md"
        variant="flat"
        className="font-bold rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-2 cursor-pointer w-full sm:w-auto"
        onClick={onExportCSV}
      >
        <Download className="w-4 h-4" />
        <span>Export CSV</span>
      </Button>
    </div>
  );
}

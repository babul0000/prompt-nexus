"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import modular subcomponents
import AdminPaymentMetrics from "@/components/admin/AdminPaymentMetrics";
import AdminPaymentControls from "@/components/admin/AdminPaymentControls";
import AdminPaymentTable from "@/components/admin/AdminPaymentTable";

export default function SubscriptionPaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch Payments Data on mount
  useEffect(() => {
    const fetchPaymentsData = async () => {
      try {
        const res = await fetch("/api/admin/payments");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setTransactions(data.transactions);
        } else {
          toast.error("Failed to load payment transactions");
        }
      } catch (err) {
        console.error("Error fetching payments statistics:", err);
        toast.error("An error occurred while loading payment data");
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentsData();
  }, []);

  // Filtered transactions based on search query
  const filteredTransactions = transactions.filter(txn => 
    txn.id.toLowerCase().includes(search.toLowerCase()) ||
    txn.userName.toLowerCase().includes(search.toLowerCase()) ||
    txn.userEmail.toLowerCase().includes(search.toLowerCase())
  );

  // Refund handler - downgrades the user plan to free
  const handleRefund = async (userId) => {
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId })
      });

      if (res.ok) {
        toast.success("Refund successfully processed! Plan reverted to free.");
        
        // Remove the transaction from the UI log locally
        setTransactions(prev => prev.filter(t => t.userId !== userId));
        
        // Decrement stats dynamically on success
        setStats(prev => {
          if (!prev) return null;
          const updatedActive = Math.max(0, prev.activeSubscriptions - 1);
          return {
            ...prev,
            activeSubscriptions: updatedActive,
            totalRevenue: Math.max(0, prev.totalRevenue - 5),
            pendingPayouts: Math.max(0, prev.pendingPayouts - 2)
          };
        });
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Failed to process refund");
      }
    } catch (err) {
      console.error("Refund transaction error:", err);
      toast.error("An error occurred while processing the refund");
    }
  };

  // Export CSV generator
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.info("No transaction records available to export");
      return;
    }

    const headers = ["Transaction ID", "User Name", "User Email", "Plan Name", "Amount ($)", "Status", "Date"];
    const rows = filteredTransactions.map(txn => [
      txn.id,
      `"${txn.userName.replace(/"/g, '""')}"`,
      txn.userEmail,
      txn.planName,
      txn.amount.toFixed(2),
      txn.status,
      txn.date
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `payment_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export file downloaded!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#030014]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030014] text-white pt-6 pb-20 px-4 sm:px-6 overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute top-[5%] left-1/4 -translate-x-1/2 w-[400px] h-[250px] bg-purple-650/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[25%] right-1/4 translate-x-1/2 w-[400px] h-[250px] bg-blue-650/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Header Block */}
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent">
            Subscription & Payments
          </h1>
          <p className="text-zinc-400 text-sm">
            Monitor transaction streams, search financial metrics, and manage user premium refunds.
          </p>
        </div>

        {/* 1. Payment Overview Stats Cards */}
        <AdminPaymentMetrics stats={stats} />

        {/* 2. Controls Section (Search & Export) */}
        <AdminPaymentControls 
          search={search} 
          setSearch={setSearch} 
          onExportCSV={handleExportCSV} 
        />

        {/* 3. Transaction Details Table */}
        <AdminPaymentTable 
          transactions={filteredTransactions} 
          onRefund={handleRefund} 
        />
      </div>
      <ToastContainer position="top-center" hideProgressBar newestOnTop />
    </div>
  );
}
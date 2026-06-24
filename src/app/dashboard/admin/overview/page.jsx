"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Modular Sub-components imported from components folder
import AdminMetricsCard from "@/components/admin/AdminMetricsCard";
import AdminVisualAnalytics from "@/components/admin/AdminVisualAnalytics";
import AdminRecentActivity from "@/components/admin/AdminRecentActivity";

export default function OverviewPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Fetch Admin Stats unconditionally on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/overview");
        if (res.ok) {
          const statsData = await res.json();
          setData(statsData);
        }
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#030014]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030014] text-white pt-6 pb-20 px-4 sm:px-6 overflow-hidden">
      {/* Background glowing rings */}
      <div className="absolute top-[5%] left-1/4 -translate-x-1/2 w-[400px] h-[250px] bg-purple-650/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[25%] right-1/4 translate-x-1/2 w-[400px] h-[250px] bg-blue-650/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto relative z-10 space-y-8"
      >
        {/* Header Block */}
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent">
            Admin Dashboard Overview
          </h1>
          <p className="text-zinc-400 text-sm">
            Monitor registration metrics, prompt catalog approvals, recent activity, and platform earnings.
          </p>
        </div>

        {/* 1. Status Cards Grid */}
        <AdminMetricsCard metrics={data?.metrics} />

        {/* 2. Visual Charts Row */}
        <AdminVisualAnalytics charts={data?.charts} />

        {/* 3. Recent Activity Grid */}
        <AdminRecentActivity activities={data?.activities} />
      </motion.div>
      <ToastContainer position="top-center" hideProgressBar newestOnTop />
    </div>
  );
}
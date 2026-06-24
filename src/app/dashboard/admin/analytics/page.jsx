"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import modular subcomponents
import AdminAnalyticsMetrics from "@/components/admin/AdminAnalyticsMetrics";
import AdminAnalyticsCharts from "@/components/admin/AdminAnalyticsCharts";

export default function SystemAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [charts, setCharts] = useState(null);

  // Fetch Analytics Data on mount
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/admin/analytics");
        if (res.ok) {
          const data = await res.json();
          setMetrics(data.metrics);
          setCharts(data.charts);
        } else {
          toast.error("Failed to load analytics data");
        }
      } catch (err) {
        console.error("Error fetching system analytics:", err);
        toast.error("An error occurred while loading system statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
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

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Header Block */}
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent">
            System Analytics
          </h1>
          <p className="text-zinc-400 text-sm">
            Monitor platform conversion statistics, daily registration trends, and prompt category logs.
          </p>
        </div>

        {/* 1. Analytics Cards Deck */}
        <AdminAnalyticsMetrics metrics={metrics} />

        {/* 2. Graphical Visualizations */}
        <AdminAnalyticsCharts charts={charts} />
      </div>
      <ToastContainer position="top-center" hideProgressBar newestOnTop />
    </div>
  );
}
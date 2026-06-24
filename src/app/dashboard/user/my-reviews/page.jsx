"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, Star, Calendar } from "lucide-react";

/**
 * My Reviews page – shows a list of reviews the logged‑in user has submitted.
 */
export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Guard: redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.info("Please sign in first");
      router.replace("/auth/signin");
    }
  }, [status, router]);

  // Fetch the user's reviews once we know they are authenticated
  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated" || !session?.user?.email) {
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?email=${session.user.email}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data || []);
      } catch (err) {
        console.error(err);
        toast.error("Could not load your reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [status, session?.user?.email]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-900 dark:text-white bg-transparent">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const getToolBadgeStyles = (aiTool = "") => {
    const tool = aiTool.toLowerCase();
    if (tool.includes("chatgpt")) {
      return "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/25";
    }
    if (tool.includes("claude")) {
      return "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/25";
    }
    if (tool.includes("gemini")) {
      return "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/25";
    }
    if (tool.includes("midjourney")) {
      return "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25";
    }
    return "bg-zinc-100 dark:bg-zinc-950/40 text-zinc-700 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-500/25";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-transparent text-zinc-900 dark:text-white p-4 sm:p-6 md:p-8 relative">
      {/* Background decorative glows */}
      <div className="absolute top-[5%] left-1/4 -translate-x-1/2 w-[400px] h-[250px] bg-purple-650/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        {/* Header section */}
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-950 via-zinc-900 to-purple-600 dark:from-white dark:via-white dark:to-purple-400 bg-clip-text text-transparent">
            My Product Reviews
          </h1>
          <p className="text-zinc-550 dark:text-zinc-400 text-sm">
            Feedback and ratings you've posted on the marketplace.
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl text-center space-y-4 max-w-xl mx-auto shadow-sm dark:shadow-none">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">You haven't posted any reviews yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.01]">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400">Prompt Title</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400">AI Tool</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400">Rating</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400">Comments</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400">Submitted Date</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                  {reviews.map((rev) => (
                    <tr key={rev._id || rev.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 text-sm font-bold text-zinc-900 dark:text-white max-w-[250px] truncate">
                        {rev.promptTitle || "Unknown Prompt"}
                      </td>
                      <td className="p-4">
                        <span className={`inline-block text-[10px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full uppercase border ${getToolBadgeStyles(rev.aiTool)}`}>
                          {rev.aiTool || "Other"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{(rev.rating ?? 5).toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-zinc-700 dark:text-zinc-300 max-w-[200px] truncate" title={rev.comment}>
                        "{rev.comment}"
                      </td>
                      <td className="p-4 text-xs text-zinc-500 dark:text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                          <span>{formatDate(rev.createdAt)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/all-prompts/${rev.promptId}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-800 dark:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-[#131735]/40 dark:hover:bg-[#131735]/60 border border-zinc-200 dark:border-[#1e2554] transition-all rounded-lg cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-center" hideProgressBar newestOnTop />
    </div>
  );
}

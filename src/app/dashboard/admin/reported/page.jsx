"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { deletePrompt, fetchAllReports, dismissReport } from "@/lib/actions/prompt";
import { Shield, Trash2, Check, ExternalLink } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function ReportedPromptsPage() {
    const { data: session, isPending: sessionPending } = useSession();
    const user = session?.user;

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const data = await fetchAllReports();
            setReports(data || []);
        } catch (err) {
            console.error("Failed to load reported prompts:", err);
            toast.error("Failed to load reports.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role?.toLowerCase() === "admin") {
            fetchReports();
        } else if (!sessionPending) {
            setLoading(false);
        }
    }, [user, sessionPending]);

    // Handle dismissing a report (removes report entry without deleting prompt)
    const handleDismissReport = async (reportId) => {
        if (confirm("Are you sure you want to dismiss this report? The prompt will remain public.")) {
            try {
                await dismissReport(reportId);
                toast.success("Report dismissed successfully.");
                setReports(prev => prev.filter(r => r._id !== reportId));
            } catch (err) {
                console.error("Failed to dismiss report:", err);
                toast.error("Failed to dismiss report.");
            }
        }
    };

    // Handle deleting violating prompt (deletes prompt and local report entry)
    const handleDeletePrompt = async (promptId, reportId) => {
        if (confirm("Are you sure you want to delete this prompt template from the platform? This action cannot be undone.")) {
            try {
                // Delete prompt
                await deletePrompt(promptId);
                
                // Remove report entry
                await dismissReport(reportId);

                toast.success("Violating prompt deleted from platform.");
                setReports(prev => prev.filter(r => r._id !== reportId));
            } catch (err) {
                console.error("Failed to delete violating prompt:", err);
                toast.error("Failed to delete prompt.");
            }
        }
    };

    if (sessionPending || loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 text-zinc-900 dark:text-white bg-transparent">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Loading reported content...</p>
            </div>
        );
    }

    if (!user || user.role?.toLowerCase() !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 text-zinc-900 dark:text-white bg-transparent">
                <Shield className="w-10 h-10 text-rose-500" />
                <h3 className="text-lg font-bold">Access Denied</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">This page is restricted to administrators only.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent text-zinc-900 dark:text-white p-4 sm:p-6 md:p-8 relative">
            {/* Background decorative glows */}
            <div className="absolute top-[5%] left-1/4 -translate-x-1/2 w-[400px] h-[250px] bg-rose-650/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-8">
                {/* Header section */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-rose-505 dark:text-rose-500">
                        <Shield className="w-5 h-5" />
                        <span className="text-[10px] font-bold tracking-wider uppercase">Content moderation</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                        Reported Prompts Panel
                    </h1>
                    <p className="text-sm text-zinc-550 dark:text-zinc-400 font-medium">
                        Moderate reported templates, review reports, and take disciplinary actions.
                    </p>
                </div>

                {/* Reports table container */}
                <div className="w-full border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-[#090a16]/80 backdrop-blur-md shadow-sm dark:shadow-none">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full border-collapse text-left text-sm text-zinc-700 dark:text-zinc-300">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50 dark:bg-zinc-950/50">
                                    <th className="py-4 px-6 min-w-[200px]">Prompt Title</th>
                                    <th className="py-4 px-4">Reason</th>
                                    <th className="py-4 px-4 min-w-[200px]">Details</th>
                                    <th className="py-4 px-4">Reporter ID</th>
                                    <th className="py-4 px-4">Date</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                                {reports.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-12 px-6 text-center text-zinc-500 font-medium">
                                            No reported templates in queue! All content is clean.
                                        </td>
                                    </tr>
                                ) : (
                                    reports.map((report) => (
                                        <tr key={report._id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition-colors duration-200">
                                            {/* Prompt Title */}
                                            <td className="py-4 px-6">
                                                {report.promptExists ? (
                                                    <Link 
                                                        href={`/all-prompts/${report.promptId}`}
                                                        target="_blank"
                                                        className="font-bold text-sm text-zinc-900 dark:text-white hover:text-purple-650 dark:hover:text-purple-400 flex items-center gap-1.5 transition"
                                                    >
                                                        <span>{report.promptTitle}</span>
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </Link>
                                                ) : (
                                                    <span className="font-bold text-sm text-zinc-500 line-through">
                                                        Deleted Prompt ({report.promptTitle})
                                                    </span>
                                                )}
                                            </td>

                                            {/* Reason badge */}
                                            <td className="py-4 px-4">
                                                <span className="bg-rose-500/10 text-rose-600 dark:text-rose-500 border border-rose-500/20 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                                                    {report.reason}
                                                </span>
                                            </td>

                                            {/* Description details */}
                                            <td className="py-4 px-4 text-xs text-zinc-550 dark:text-zinc-400 max-w-xs break-words">
                                                {report.description || <span className="text-zinc-500 dark:text-zinc-650 italic">No extra details</span>}
                                            </td>

                                            {/* Reporter */}
                                            <td className="py-4 px-4 text-xs text-zinc-500 dark:text-zinc-400 font-semibold truncate max-w-[120px]" title={report.userId}>
                                                {report.userId}
                                            </td>

                                            {/* Date */}
                                            <td className="py-4 px-4 text-xs text-zinc-500 dark:text-zinc-400">
                                                {new Date(report.reportedAt).toLocaleDateString()}
                                            </td>

                                            {/* Action buttons */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => handleDismissReport(report._id)}
                                                        className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-emerald-600 dark:bg-[#131735] dark:hover:bg-[#1a204d] dark:text-emerald-400 text-xs font-bold rounded-lg border border-zinc-200 dark:border-[#1e2554] transition cursor-pointer flex items-center gap-1"
                                                        title="Dismiss Report (Approve Prompt)"
                                                    >
                                                        <Check size={14} />
                                                        <span>Dismiss</span>
                                                    </button>
                                                    
                                                    {report.promptExists && (
                                                        <button
                                                            onClick={() => handleDeletePrompt(report.promptId, report._id)}
                                                            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-605 text-rose-550 hover:text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
                                                            title="Delete Violated Prompt"
                                                        >
                                                            <Trash2 size={14} />
                                                            <span>Delete</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

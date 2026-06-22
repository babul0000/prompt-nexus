import React from 'react';
import { stripe } from '@/lib/stripe';
import db from '@/lib/db';
import { ObjectId } from 'mongodb';
import Link from 'next/link';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, Gem } from 'lucide-react';

export default async function SuccessPage({ searchParams }) {
    const params = await searchParams;
    const sessionId = params.session_id;

    let success = false;
    let errorMessage = "";
    let customerEmail = "";

    if (sessionId) {
        try {
            // Retrieve Stripe checkout session to verify payment status
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            
            if (session.payment_status === "paid" || session.status === "complete") {
                const userId = session.client_reference_id || session.metadata?.userId;
                customerEmail = session.customer_details?.email || "";

                if (userId) {
                    // Update user's plan to "pro" in MongoDB
                    let updateResult = await db.collection("user").updateOne(
                        { _id: userId },
                        { $set: { plan: "pro" } }
                    );

                    // fallback to ObjectId just in case
                    if (updateResult.matchedCount === 0) {
                        try {
                            const objectId = new ObjectId(userId);
                            updateResult = await db.collection("user").updateOne(
                                { _id: objectId },
                                { $set: { plan: "pro" } }
                            );
                        } catch (e) {
                            // ignore
                        }
                    }

                    // fallback to 'id' field just in case
                    if (updateResult.matchedCount === 0) {
                        updateResult = await db.collection("user").updateOne(
                            { id: userId },
                            { $set: { plan: "pro" } }
                        );
                    }

                    if (updateResult.matchedCount > 0) {
                        success = true;
                    } else {
                        errorMessage = "Plan update failed: User not found in database.";
                    }
                } else {
                    errorMessage = "Missing client_reference_id or userId in payment metadata.";
                }
            } else {
                errorMessage = `Session payment status is '${session.payment_status}'. Payment not completed.`;
            }
        } catch (error) {
            console.error("Stripe session verification error:", error);
            errorMessage = error.message || "Failed to verify Stripe payment session.";
        }
    } else {
        errorMessage = "No Stripe session ID was provided in the query params.";
    }

    return (
        <div className="relative min-h-screen bg-[#030014] text-white flex items-center justify-center pt-24 pb-20 px-4 sm:px-6 overflow-hidden">
            {/* Glowing background circles */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-md w-full bg-[#090a16]/80 border border-white/[0.08] rounded-3xl p-8 sm:p-10 text-center backdrop-blur-md shadow-2xl relative z-10 space-y-6">
                
                {success ? (
                    <>
                        {/* Success Icon */}
                        <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Payment Successful!
                            </h1>
                            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Aiverse Pro Activated</span>
                            </p>
                        </div>

                        {/* Success details */}
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-2.5">
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span>Plan Type:</span>
                                <span className="font-semibold text-white">Lifetime Pro</span>
                            </div>
                            {customerEmail && (
                                <div className="flex justify-between text-xs text-zinc-400">
                                    <span>Billing Email:</span>
                                    <span className="font-semibold text-white truncate max-w-[180px]">{customerEmail}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span>Status:</span>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                                    Active
                                </span>
                            </div>
                        </div>

                        {/* Success description message */}
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                            Thank you for upgrading! Your account has been upgraded to **Aiverse Pro Access**. You now have unlimited access to premium prompt templates and dashboard privileges.
                        </p>

                        {/* Redirection button */}
                        <div className="pt-2">
                            <Link href="/dashboard/user">
                                <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-[#030014] py-3.5 rounded-xl font-bold text-xs transition-all shadow-[0_4px_15px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.45)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]">
                                    <span>Go to Dashboard</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Error Icon */}
                        <div className="mx-auto w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.15)]">
                            <XCircle className="w-8 h-8" />
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <h1 className="text-2xl font-extrabold text-white tracking-tight">
                                Verification Failed
                            </h1>
                            <p className="text-xs text-rose-500 font-bold uppercase tracking-wider">
                                Payment Verification Error
                            </p>
                        </div>

                        {/* Error Description details */}
                        <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl text-left">
                            <p className="text-xs font-semibold text-rose-400 tracking-wide mb-1">Details:</p>
                            <p className="text-[11px] text-zinc-400 font-mono leading-relaxed break-words">
                                {errorMessage}
                            </p>
                        </div>

                        {/* Redirection button */}
                        <div className="pt-2 flex flex-col gap-3">
                            <Link href="/payment">
                                <button className="w-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#820AD1] text-white py-3.5 rounded-xl font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]">
                                    <span>Try Payment Again</span>
                                </button>
                            </Link>
                            <Link href="/dashboard/user" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-medium">
                                Back to Dashboard
                            </Link>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
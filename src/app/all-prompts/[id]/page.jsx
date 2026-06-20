import React, { Suspense } from 'react';
import PromptDetailsClient from './PromptDetailsClient';

export const dynamic = 'force-dynamic';

const PromptDetailsPage = async (props) => {
    const params = await props.params;
    const { id } = params;

    // Fetch the single prompt data from Express Backend
    let prompt = null;
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/prompts/${id}`, { cache: 'no-store' });
        if (res.ok) {
            prompt = await res.json();
        }
    } catch (err) {
        console.error("Failed to load prompt details from backend server:", err);
    }

    if (!prompt) {
        return (
            <div className="min-h-screen bg-[#030014] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
                <h2 className="text-2xl font-black">Prompt Not Found</h2>
                <p className="text-sm text-zinc-400 max-w-sm">
                    The requested prompt could not be found or has been deleted.
                </p>
                <a href="/all-prompts" className="px-5 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-xs font-bold rounded-xl shadow-lg">
                    Back to Catalog
                </a>
            </div>
        );
    }

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#030014] text-zinc-500 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                <p className="mt-4 text-sm font-medium">Loading details...</p>
            </div>
        }>
            <PromptDetailsClient initialPrompt={prompt} />
        </Suspense>
    );
};

export default PromptDetailsPage;

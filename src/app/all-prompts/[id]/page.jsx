import React, { Suspense } from 'react';
import PromptDetailsClient from './PromptDetailsClient';

import { baseUrl } from '@/lib/core/baseUrl';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props) {
    const params = await props.params;
    const { id } = params;
    try {
        const res = await fetch(`${baseUrl}/api/prompts/${id}`);
        if (res.ok) {
            const data = await res.json();
            return {
                title: data.title,
                description: data.description || "Discover this premium AI prompt on PromptForge.",
            };
        }
    } catch (e) {
        // ignore and fallback
    }
    return {
        title: "Prompt Details",
        description: "Discover this premium AI prompt on PromptForge.",
    };
}

const PromptDetailsPage = async (props) => {
    const params = await props.params;
    const { id } = params;

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#030014] text-zinc-500 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                <p className="mt-4 text-sm font-medium">Loading details...</p>
            </div>
        }>
            <PromptDetailsClient promptId={id} />
        </Suspense>
    );
};

export default PromptDetailsPage;

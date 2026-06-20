import { getPrompts } from '@/lib/api/prompt';
import React, { Suspense } from 'react';
import ExplorePromptsClient from './ExplorePromptsClient';

export const dynamic = 'force-dynamic';

const AllPromptsPage = async (props) => {
    // Fetch all prompts from DB/Server
    const prompts = await getPrompts();
    
    // Resolve search parameters for pre-filling query from homepage search banner
    const searchParams = await props.searchParams;
    const initialSearch = searchParams?.search || "";

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#030014] text-zinc-500 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                <p className="mt-4 text-sm font-medium">Loading Catalog...</p>
            </div>
        }>
            <ExplorePromptsClient initialPrompts={prompts} initialSearch={initialSearch} />
        </Suspense>
    );
};

export default AllPromptsPage;
import React, { Suspense } from 'react';
import PromptDetailsClient from './PromptDetailsClient';

export const dynamic = 'force-dynamic';

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

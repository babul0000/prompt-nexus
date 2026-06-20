import { getPrompts } from '@/lib/api/prompt';
import React from 'react';

const AllPromptsPage = async () => {
    const prompts = await getPrompts();
    console.log(prompts, 'all prompts');

    return (
        <div>
            <h1>All Prompts</h1>
            <ul>
                {Array.isArray(prompts) && prompts.map((p) => (
                    <li key={p.id || p._id || p.title}>{p.title || JSON.stringify(p)}</li>
                ))}
            </ul>
        </div>
    );
};

export default AllPromptsPage;
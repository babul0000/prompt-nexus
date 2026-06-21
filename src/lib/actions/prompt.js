'use server'

import { serverMutation } from "../core/server";
import { getUserSession } from "../core/session";

// রিকোয়ারমেন্ট অনুযায়ী ফাংশনের নাম createJob থেকে পরিবর্তন করে createPrompt করা হলো
export const createPrompt = async (newPromptData) => {
    console.log('[createPrompt] Input data:', {
        userId: newPromptData.userId,
        creatorId: newPromptData.creatorId,
        creatorEmail: newPromptData.creatorEmail
    });

    try {
        const user = await getUserSession();
        console.log('[createPrompt] Server session user:', user);

        if (user) {
            const userId = user.id || user._id || user.userId;
            console.log('[createPrompt] Resolved userId:', userId);

            if (userId) {
                newPromptData.userId = newPromptData.userId || userId;
                newPromptData.creatorId = newPromptData.creatorId || userId;
                console.log('[createPrompt] Set userId/creatorId:', { userId: newPromptData.userId, creatorId: newPromptData.creatorId });
            }
        }
    } catch (err) {
        console.error('[createPrompt] Failed to resolve server session:', err);
    }

    return serverMutation('/api/prompts', newPromptData);
}

export const updatePrompt = async (id, updatedPromptData) => {
    return serverMutation(`/api/prompts/${id}`, updatedPromptData, "PUT");
}

export const deletePrompt = async (id) => {
    return serverMutation(`/api/prompts/${id}`, {}, "DELETE");
}
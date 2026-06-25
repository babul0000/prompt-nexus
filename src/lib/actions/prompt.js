'use server'

import { serverMutation, serverFetch } from "../core/server";
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

export const updatePromptStatus = async (id, status, feedback = "") => {
    return serverMutation(`/api/prompts/${id}/status`, { status, feedback }, "PATCH");
}

export const togglePromptFeatured = async (id, featured) => {
    return serverMutation(`/api/prompts/${id}/featured`, { featured }, "PATCH");
}

// bookmark toggling Server Action
export const toggleBookmark = async (promptId) => {
    const user = await getUserSession();
    if (!user) throw new Error("Unauthorized");
    const userId = user.id || user._id;
    return serverMutation('/api/bookmarks', { userId, promptId });
}

// bookmark status checking Server Action
export const checkBookmarkStatus = async (promptId) => {
    const user = await getUserSession();
    if (!user) return { bookmarked: false };
    const userId = user.id || user._id;
    return serverFetch(`/api/bookmarks/check?userId=${userId}&promptId=${promptId}`);
}

// reviews fetching Server Action
export const fetchReviews = async (promptId) => {
    return serverFetch(`/api/prompts/${promptId}/reviews`);
}

// review submitting Server Action
export const submitReview = async (promptId, rating, comment) => {
    const user = await getUserSession();
    if (!user) throw new Error("Unauthorized");
    return serverMutation(`/api/prompts/${promptId}/reviews`, {
        rating,
        comment,
        userName: user.name || "Anonymous User",
        userEmail: user.email || "",
        userImage: user.image || ""
    });
}

// report submitting Server Action
export const submitReport = async (promptId, reason, description) => {
    const user = await getUserSession();
    if (!user) throw new Error("Unauthorized");
    const userId = user.id || user._id;
    return serverMutation('/api/reports', {
        userId,
        promptId,
        reason,
        description
    });
}

// increment copy count Server Action
export const incrementCopyCount = async (promptId) => {
    return serverMutation(`/api/prompts/${promptId}/copy`, {}, "PATCH");
}

// Fetch all reports (Admin only)
export const fetchAllReports = async () => {
    const user = await getUserSession();
    if (!user || user.role?.toLowerCase() !== 'admin') {
        throw new Error("Unauthorized");
    }
    return serverFetch('/api/reports');
}

// Delete / Dismiss a report (Admin only)
export const dismissReport = async (reportId) => {
    const user = await getUserSession();
    if (!user || user.role?.toLowerCase() !== 'admin') {
        throw new Error("Unauthorized");
    }
    return serverMutation(`/api/reports/${reportId}`, {}, "DELETE");
}

// Fetch all prompts for admin panel
export const fetchAdminPrompts = async () => {
    const user = await getUserSession();
    if (!user || user.role?.toLowerCase() !== 'admin') {
        throw new Error("Unauthorized");
    }
    return serverFetch('/api/admin/prompts');
}
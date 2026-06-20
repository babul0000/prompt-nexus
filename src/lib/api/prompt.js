'use server'

import { serverFetch } from "../core/server";

// ইমেইল না পাঠিয়ে বরং userId ব্যবহার করো
export const getMyPrompts = async (userId) => {
    // সার্ভার থেকে কুয়েরি প্যারামিটার হিসেবে userId পাঠিয়ে দাও
    return serverFetch(`/api/my-prompts?userId=${userId}`);
}

export const getPrompts = async () => {
    return serverFetch(`/api/prompts`);
}
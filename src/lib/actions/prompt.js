'use server'

import { serverMutation } from "../core/server";

// রিকোয়ারমেন্ট অনুযায়ী ফাংশনের নাম createJob থেকে পরিবর্তন করে createPrompt করা হলো
export const createPrompt = async (newPromptData) => {
    return serverMutation('/api/prompts', newPromptData);
}
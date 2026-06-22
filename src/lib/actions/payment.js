'use server'

import db from "@/lib/db";
import { getUserSession } from "../core/session";
import { ObjectId } from "mongodb";

export async function upgradeToPro() {
    try {
        const user = await getUserSession();
        console.log("[upgradeToPro] Current user session:", user);
        
        if (!user) {
            return { error: "User session not found. Please log in first." };
        }
        
        const userId = user.id || user._id;
        if (!userId) {
            return { error: "Invalid user session: ID is missing." };
        }
        
        console.log("[upgradeToPro] Upgrading user plan to 'pro'. User ID:", userId);

        // Better-Auth by default stores user documents in 'user' collection
        // Let's perform a multi-strategy update to cover various ID forms (String vs ObjectId, _id vs id)
        
        // 1. Try updating by _id: string
        let updateResult = await db.collection("user").updateOne(
            { _id: userId },
            { $set: { plan: "pro" } }
        );
        
        console.log("[upgradeToPro] Update by _id string matched count:", updateResult.matchedCount);

        // 2. If not matched, try updating by _id: ObjectId
        if (updateResult.matchedCount === 0) {
            try {
                const objectId = new ObjectId(userId);
                updateResult = await db.collection("user").updateOne(
                    { _id: objectId },
                    { $set: { plan: "pro" } }
                );
                console.log("[upgradeToPro] Update by _id ObjectId matched count:", updateResult.matchedCount);
            } catch (err) {
                console.log("[upgradeToPro] Invalid ObjectId format for userId, skipping ObjectId lookup");
            }
        }

        // 3. If still not matched, try updating by custom id field if it exists as a string
        if (updateResult.matchedCount === 0) {
            updateResult = await db.collection("user").updateOne(
                { id: userId },
                { $set: { plan: "pro" } }
            );
            console.log("[upgradeToPro] Update by 'id' string field matched count:", updateResult.matchedCount);
        }

        if (updateResult.matchedCount === 0) {
            return { error: "User record not found in the database. Upgrade failed." };
        }

        console.log("[upgradeToPro] Plan successfully upgraded to 'pro' for user:", userId);
        return { success: true };
    } catch (error) {
        console.error("[upgradeToPro] Error upgrading user to pro:", error);
        return { error: error.message || "Failed to process payment upgrade." };
    }
}

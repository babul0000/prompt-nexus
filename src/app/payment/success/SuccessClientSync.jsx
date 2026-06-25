"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SuccessClientSync() {
    const router = useRouter();

    useEffect(() => {
        const syncSession = async () => {
            try {
                console.log("[SuccessClientSync] Refreshing better-auth session...");
                // Force a reload of the session by bypassing cookie cache
                const res = await authClient.getSession({
                    query: {
                        disableCookieCache: true
                    }
                });
                console.log("[SuccessClientSync] Session refresh response:", res);
                // Trigger next.js router refresh to update server-rendered parts (like Navbar)
                router.refresh();
            } catch (err) {
                console.error("[SuccessClientSync] Failed to refresh session:", err);
            }
        };
        
        syncSession();
    }, [router]);

    return null;
}

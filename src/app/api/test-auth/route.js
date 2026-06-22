import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
    const diagnostic = {
        dbConnected: false,
        collections: [],
        authInitialized: false,
        error: null,
    };

    try {
        console.log("[test-auth API] Testing DB connection...");
        // Test database connection
        const collections = await db.listCollections().toArray();
        diagnostic.dbConnected = true;
        diagnostic.collections = collections.map(c => c.name);
        console.log("[test-auth API] DB connection successful, collections:", diagnostic.collections);

        console.log("[test-auth API] Testing Auth initialization...");
        // Test Better Auth initialization
        if (auth && auth.api) {
            diagnostic.authInitialized = true;
        }
        console.log("[test-auth API] Auth initialization successful.");

    } catch (err) {
        console.error("[test-auth API] Error:", err);
        diagnostic.error = {
            message: err.message,
            stack: err.stack,
        };
    }

    return NextResponse.json(diagnostic);
}

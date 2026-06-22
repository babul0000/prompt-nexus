import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        hasMongoUri: !!process.env.MONGODB_URI,
        mongoUriPrefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) : null,
        betterAuthUrl: process.env.BETTER_AUTH_URL,
        allKeys: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('PASSWORD') && !k.includes('KEY')),
    });
}

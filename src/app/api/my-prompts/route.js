import db from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        console.log('[GET /api/my-prompts] Received userId:', userId);

        if (!userId) {
            console.warn('[GET /api/my-prompts] No userId provided');
            return new Response(JSON.stringify({ error: 'userId is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Try to match userId as string or ObjectId
        const query = {
            $or: [
                { userId: userId },
                { userId: new ObjectId(userId) },
                { creatorId: userId },
                { creatorId: new ObjectId(userId) }
            ]
        };

        console.log('[GET /api/my-prompts] Query:', query);

        const items = await db.collection('prompts')
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();

        console.log('[GET /api/my-prompts] Found', items.length, 'prompts for userId:', userId);

        return new Response(JSON.stringify(items), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('[GET /api/my-prompts] Error:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

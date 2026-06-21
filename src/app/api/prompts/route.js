import db from '@/lib/db';
import { getUserSession } from '@/lib/core/session';

export async function POST(req) {
    try {
        const contentType = req.headers.get('content-type') || '';
        let body = {};

        if (contentType.includes('application/json')) {
            body = await req.json();
        } else if (contentType.includes('multipart/form-data')) {
            const form = await req.formData();
            form.forEach((value, key) => {
                // try to parse JSON strings that were stringified
                try {
                    body[key] = JSON.parse(value);
                } catch {
                    body[key] = value;
                }
            });
        } else {
            // fallback
            body = await req.json().catch(() => ({}));
        }

        // Attach server-side user id if available
        console.log('[POST /api/prompts] Before session resolve:', { userId: body.userId, creatorId: body.creatorId });

        try {
            const user = await getUserSession();
            console.log('[POST /api/prompts] Server session user:', user);

            const resolvedUserId = user ? (user.id || user._id || user.userId) : null;
            console.log('[POST /api/prompts] Resolved userId from session:', resolvedUserId);

            if (resolvedUserId) {
                body.userId = body.userId || body.creatorId || resolvedUserId;
                body.creatorId = body.creatorId || body.userId;
                console.log('[POST /api/prompts] After session resolve:', { userId: body.userId, creatorId: body.creatorId });
            } else if (body.creatorId) {
                body.userId = body.userId || body.creatorId;
                console.log('[POST /api/prompts] Using fallback creatorId:', { userId: body.userId, creatorId: body.creatorId });
            }
        } catch (err) {
            console.error('[POST /api/prompts] getUserSession failed', err);
        }


        // defaults
        body.createdAt = body.createdAt ? new Date(body.createdAt) : new Date();
        body.copyCount = body.copyCount ?? 0;
        body.bookmarkCount = body.bookmarkCount ?? 0;
        body.status = body.status || 'approved';

        console.log('[POST /api/prompts] Final body before insert:', { userId: body.userId, creatorId: body.creatorId, title: body.title });

        const res = await db.collection('prompts').insertOne(body);
        const inserted = await db.collection('prompts').findOne({ _id: res.insertedId });

        return new Response(JSON.stringify({ ...inserted, insertedId: res.insertedId }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('prompts POST error', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function GET() {
    try {
        const items = await db.collection('prompts').find({}).sort({ createdAt: -1 }).toArray();
        return new Response(JSON.stringify(items), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('prompts GET error', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

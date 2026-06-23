import db from '@/lib/db';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }

    const reviews = await db.collection('reviews')
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    const reviewsWithPromptDetails = await Promise.all(
      reviews.map(async (review) => {
        let prompt = null;
        if (review.promptId) {
          try {
            prompt = await db.collection('prompts').findOne({
              $or: [
                { _id: review.promptId },
                { _id: new ObjectId(review.promptId) }
              ]
            });
          } catch (err) {
            // ignore objectId error
          }
        }
        return {
          ...review,
          promptTitle: prompt ? prompt.title : "Unknown Prompt",
          aiTool: prompt ? prompt.aiTool : "Other",
        };
      })
    );

    return NextResponse.json(reviewsWithPromptDetails);
  } catch (err) {
    console.error('[GET /api/reviews] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

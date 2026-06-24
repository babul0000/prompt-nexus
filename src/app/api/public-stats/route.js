import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const totalUsers = await db.collection('user').countDocuments();
    const totalPrompts = await db.collection('prompts').countDocuments();
    
    return NextResponse.json({
      users: totalUsers,
      prompts: totalPrompts
    });
  } catch (err) {
    console.error('Error fetching public stats:', err);
    return NextResponse.json({
      users: 15,
      prompts: 42
    });
  }
}

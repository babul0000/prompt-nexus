import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUserSession } from '@/lib/core/session';

// GET: Fetch payment overview metrics and transaction list
export async function GET() {
  try {
    const sessionUser = await getUserSession();
    if (!sessionUser || sessionUser.role?.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const proUsers = await db.collection('user')
      .find({ plan: { $regex: '^pro$', $options: 'i' } })
      .sort({ updatedAt: -1 })
      .toArray();

    const proCount = proUsers.length;

    // Calculate revenue stats ($5 subscription cost)
    const totalRevenue = proCount * 5;
    const activeSubscriptions = proCount;
    const pendingPayouts = proCount * 2; // Simulated creator payouts at $2 per user

    // Calculate recent transactions in the last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const recentTransactionsCount = proUsers.filter(u => {
      const updateDate = u.updatedAt ? new Date(u.updatedAt) : null;
      return updateDate && updateDate >= oneDayAgo;
    }).length;

    // Map users to transaction rows
    const transactions = proUsers.map(user => {
      const userDate = user.updatedAt || user.createdAt || new Date();
      return {
        id: `TXN-${user._id.toString().slice(-8).toUpperCase()}`,
        userId: user._id.toString(),
        userName: user.name || "Anonymous",
        userEmail: user.email,
        planName: "Pro (Lifetime)",
        amount: 5.00,
        status: (user.status || "active").toLowerCase() === "suspended" ? "Failed" : "Success",
        date: new Date(userDate).toISOString().split('T')[0]
      };
    });

    return NextResponse.json({
      stats: {
        totalRevenue,
        pendingPayouts,
        activeSubscriptions,
        recentTransactions: recentTransactionsCount
      },
      transactions
    });
  } catch (err) {
    console.error('[GET /api/admin/payments] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Process refund (downgrade plan to "free")
export async function PATCH(req) {
  try {
    const sessionUser = await getUserSession();
    if (!sessionUser || sessionUser.role?.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Try updating plan to "free"
    let result = await db.collection('user').updateOne(
      { _id: id },
      { $set: { plan: "free", updatedAt: new Date() } }
    );

    // Fallback to ObjectId lookup
    if (result.matchedCount === 0) {
      try {
        const objectId = new ObjectId(id);
        result = await db.collection('user').updateOne(
          { _id: objectId },
          { $set: { plan: "free", updatedAt: new Date() } }
        );
      } catch (err) {
        // ignore invalid ObjectId format
      }
    }

    // Fallback to string id field
    if (result.matchedCount === 0) {
      result = await db.collection('user').updateOne(
        { id: id },
        { $set: { plan: "free", updatedAt: new Date() } }
      );
    }

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/admin/payments] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

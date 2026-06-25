import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUserSession } from '@/lib/core/session';

// GET: Fetch all users
export async function GET() {
  try {
    const sessionUser = await getUserSession();
    if (!sessionUser || sessionUser.role?.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const users = await db.collection('user')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Map MongoDB documents to a clean frontend layout
    const mappedUsers = users.map(u => ({
      id: u._id.toString(),
      name: u.name || "Anonymous",
      email: u.email,
      role: u.role || "user",
      status: u.status || "active",
      joined: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : "N/A",
      image: u.image || ""
    }));

    return NextResponse.json(mappedUsers);
  } catch (err) {
    console.error('[GET /api/admin/users] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Update user role and status
export async function PATCH(req) {
  try {
    const sessionUser = await getUserSession();
    if (!sessionUser || sessionUser.role?.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { id, role, status } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const updateFields = {};
    if (role !== undefined) updateFields.role = role;
    if (status !== undefined) updateFields.status = status;
    updateFields.updatedAt = new Date();

    const result = await db.collection('user').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/admin/users] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Delete a user by ID
export async function DELETE(req) {
  try {
    const sessionUser = await getUserSession();
    if (!sessionUser || sessionUser.role?.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const result = await db.collection('user').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Also remove their associated accounts, sessions, and bookmarks to keep database clean
    try {
      await db.collection('session').deleteMany({ userId: id });
      await db.collection('account').deleteMany({ userId: id });
    } catch (cleanupErr) {
      console.warn("User secondary cleanup error:", cleanupErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/admin/users] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


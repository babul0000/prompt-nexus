import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Key Metrics
    const totalUsers = await db.collection('user').countDocuments();
    const totalPrompts = await db.collection('prompts').countDocuments();
    const pendingModerations = await db.collection('prompts').countDocuments({
      status: { $regex: '^pending$', $options: 'i' }
    });
    
    // Revenue is calculated from pro users (each pays $5)
    const proUsersCount = await db.collection('user').countDocuments({
      plan: { $regex: '^pro$', $options: 'i' }
    });
    const totalRevenue = proUsersCount * 5;

    // 2. Recent Activities (fetch last 5 of each)
    const recentUsers = await db.collection('user')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const recentPrompts = await db.collection('prompts')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const recentPayments = await db.collection('user')
      .find({ plan: { $regex: '^pro$', $options: 'i' } })
      .sort({ updatedAt: -1 })
      .limit(5)
      .toArray();

    // 3. User Growth Chart (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const userGrowthData = await db.collection('user')
      .aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo }
          }
        },
        {
          $project: {
            dateStr: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            }
          }
        },
        {
          $group: {
            _id: "$dateStr",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]).toArray();

    // Fill missing dates with 0 to ensure continuous 7 days line chart
    const growthChart = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = userGrowthData.find(item => item._id === dateStr);
      growthChart.push({
        date: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Users: match ? match.count : 0
      });
    }

    // 4. Prompt Categories (Pie Chart)
    const categoryCounts = await db.collection('prompts')
      .aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]).toArray();

    const categoryData = categoryCounts.map(item => ({
      name: item._id || "Uncategorized",
      value: item.count
    }));

    return NextResponse.json({
      metrics: {
        totalUsers,
        totalPrompts,
        pendingModerations,
        totalRevenue
      },
      activities: {
        recentUsers: recentUsers.map(u => ({
          id: u._id || u.id,
          name: u.name || "Anonymous",
          email: u.email,
          createdAt: u.createdAt
        })),
        recentPrompts: recentPrompts.map(p => ({
          id: p._id || p.id,
          title: p.title,
          category: p.category,
          createdAt: p.createdAt
        })),
        recentPayments: recentPayments.map(u => ({
          id: u._id || u.id,
          name: u.name || "Anonymous",
          email: u.email,
          amount: 5,
          updatedAt: u.updatedAt || u.createdAt
        }))
      },
      charts: {
        userGrowth: growthChart,
        categories: categoryData
      }
    });
  } catch (err) {
    console.error('[GET /api/admin/overview] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Compute Main Metrics
    const totalUsers = await db.collection('user').countDocuments();
    const activePrompts = await db.collection('prompts').countDocuments({
      status: { $regex: '^approved$', $options: 'i' }
    });
    const pendingApproval = await db.collection('prompts').countDocuments({
      status: { $regex: '^pending$', $options: 'i' }
    });
    
    // Revenue is derived from Pro plan users ($5 per member)
    const proUsersCount = await db.collection('user').countDocuments({
      plan: { $regex: '^pro$', $options: 'i' }
    });
    const totalRevenue = proUsersCount * 5;

    // Subscription Conversion Rate (%)
    const conversionRate = totalUsers > 0 ? (proUsersCount / totalUsers) * 100 : 0;

    // 2. Compute 30-Day User Growth Line Chart
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowthData = await db.collection('user')
      .aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo }
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

    // Fill missing dates in the 30-day window
    const growthChart = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = userGrowthData.find(item => item._id === dateStr);
      growthChart.push({
        date: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Users: match ? match.count : 0
      });
    }

    // 3. Compute Category Distribution (Pie/Bar Chart)
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
        activePrompts,
        pendingApproval,
        totalRevenue,
        conversionRate: parseFloat(conversionRate.toFixed(1))
      },
      charts: {
        userGrowth: growthChart,
        categories: categoryData
      }
    });
  } catch (err) {
    console.error('[GET /api/admin/analytics] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

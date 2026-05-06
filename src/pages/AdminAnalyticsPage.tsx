import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Users, ShoppingBag, Leaf } from 'lucide-react';
import { analyticsData as mockAnalytics } from '../data/mockData';
import { Sidebar } from '../components/layout/Sidebar';
import { WasteInsight } from '../components/features/WasteInsight';
import { AdminAICharts } from '../components/features/AdminAICharts';
import { AIGrowthInsights } from '../components/features/AIGrowthInsights';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area,
} from 'recharts';
import { analyticsApi } from '../lib/api';

const chartColors = {
  primary: '#2563eb',
  primaryLight: '#93c5fd',
  emerald: '#10b981',
  amber: '#f59e0b',
};

const chartTooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '8px 12px',
  fontSize: '12px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
};

export function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(mockAnalytics);

  useEffect(() => {
    analyticsApi.get().then(data => {
      setAnalytics(prev => ({
        ...prev,
        totalOrders: data.totalOrders || prev.totalOrders,
        revenueToday: data.todayRevenue || prev.revenueToday,
        pendingOrders: data.pendingOrders || prev.pendingOrders,
        ordersByHour: data.ordersByHour?.length > 0 ? data.ordersByHour.map((h: any) => ({ hour: h.hour, orders: h.orders })) : prev.ordersByHour,
        topMenus: data.topMenus?.length > 0 ? data.topMenus.map((m: any) => ({ name: m.name, orders: m.orders })) : prev.topMenus,
        dailyRevenue: data.dailyRevenue?.length > 0 ? data.dailyRevenue.map((d: any) => ({ day: d.day, revenue: d.revenue })) : prev.dailyRevenue,
      }));
    }).catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar role="admin" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink">แดชบอร์ดวิเคราะห์ข้อมูล</h1>
          <p className="text-muted text-sm mt-1">ข้อมูลเชิงลึกและตัวชี้วัดประสิทธิภาพ</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'ออเดอร์ทั้งหมด', value: analytics.totalOrders.toString(), icon: ShoppingBag, change: '+8%', color: 'text-brand-600', bg: 'bg-brand-50' },
            { label: 'รายได้วันนี้', value: `${analytics.revenueToday} บาท`, icon: TrendingDown, change: '+12%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'รอดำเนินการ', value: analytics.pendingOrders, icon: Users, change: 'live', color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'ลดขยะอาหาร', value: `${analytics.wasteReduction}%`, icon: Leaf, change: '-35%', color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(metric => (
            <div key={metric.label} className="card p-4">
              <div className={`w-10 h-10 ${metric.bg} rounded-xl flex items-center justify-center mb-3`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <p className="text-xs text-muted mb-0.5">{metric.label}</p>
              <p className="font-bold text-ink text-xl">{metric.value}</p>
              <span className="text-xs font-medium text-emerald-600">{metric.change}</span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
            <h3 className="font-bold text-ink mb-4">ออเดอร์ตามเวลา</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.ordersByHour}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="orders" fill={chartColors.primary} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
            <h3 className="font-bold text-ink mb-4">รายได้รายวัน (บาท)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="revenue" stroke={chartColors.primary} strokeWidth={2.5} dot={{ fill: chartColors.primary, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
            <h3 className="font-bold text-ink mb-4">เมนูขายดี</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.topMenus} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={130} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="orders" fill={chartColors.emerald} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
            <h3 className="font-bold text-ink mb-4">ช่วงเวลาคนรอมากที่สุด</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={analytics.peakQueue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="queue" stroke={chartColors.amber} fill={chartColors.amber} fillOpacity={0.15} strokeWidth={2.5} dot={{ fill: chartColors.amber, r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <AdminAICharts />

        <AIGrowthInsights />

        <WasteInsight />
      </main>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area,
} from 'recharts';

const chartColors = {
  primary: '#2563eb',
  emerald: '#10b981',
  amber: '#f59e0b',
  violet: '#8b5cf6',
};

const chartTooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '8px 12px',
  fontSize: '12px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
};

const aiClickRateData = [
  { day: 'จันทร์', clicks: 42, views: 68 },
  { day: 'อังคาร', clicks: 55, views: 72 },
  { day: 'พุธ', clicks: 48, views: 70 },
  { day: 'พฤหัส', clicks: 63, views: 78 },
  { day: 'ศุกร์', clicks: 58, views: 75 },
];

const aiSalesImpactData = [
  { week: 'สัปดาห์ 1', revenue: 8500, aiRevenue: 8500 },
  { week: 'สัปดาห์ 2', revenue: 9200, aiRevenue: 9800 },
  { week: 'สัปดาห์ 3', revenue: 9800, aiRevenue: 11200 },
  { week: 'สัปดาห์ 4', revenue: 10100, aiRevenue: 12800 },
];

const mostRecommendedData = [
  { name: 'ข้าวผัดกะเพราไก่', recommendations: 89 },
  { name: 'ชาไทยเย็น', recommendations: 76 },
  { name: 'ผัดไทย', recommendations: 64 },
  { name: 'ก๋วยเตี๋ยวเรือน้ำ', recommendations: 52 },
  { name: 'ข้าวหมกไก่', recommendations: 45 },
];

const waitTimeReductionData = [
  { month: 'ม.ค.', avgWait: 12 },
  { month: 'ก.พ.', avgWait: 10 },
  { month: 'มี.ค.', avgWait: 8.5 },
  { month: 'เม.ย.', avgWait: 7.2 },
  { month: 'พ.ค.', avgWait: 6.0 },
];

export function AdminAICharts() {
  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-violet-500" />
        <h2 className="font-bold text-ink text-lg">AI Performance Analytics</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* AI Recommendation Click Rate */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-ink">AI Recommendation Click Rate</h3>
            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full font-semibold">62% CTR</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={aiClickRateData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="clicks" fill={chartColors.violet} radius={[6, 6, 0, 0]} name="คลิก" />
              <Bar dataKey="views" fill={chartColors.primary} radius={[6, 6, 0, 0]} name="เห็น" opacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sales Increase from AI */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-ink">Sales Increase from AI Suggested Menus</h3>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">+51%</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={aiSalesImpactData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line type="monotone" dataKey="revenue" stroke="#94a3b8" strokeWidth={2} dot={{ fill: '#94a3b8', r: 3 }} name="รายได้ปกติ" />
              <Line type="monotone" dataKey="aiRevenue" stroke={chartColors.emerald} strokeWidth={2.5} dot={{ fill: chartColors.emerald, r: 4 }} name="มี AI" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Most Recommended Items */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-ink">Most Recommended Items by AI</h3>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">Top 5</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mostRecommendedData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={140} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="recommendations" fill={chartColors.amber} radius={[0, 6, 6, 0]} name="แนะนำ" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Wait Time Reduction */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-ink">Wait Time Reduction %</h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">-50%</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={waitTimeReductionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 15]} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(value: unknown) => [`${value} นาที`, 'เวลารอเฉลี่ย']} />
              <Area type="monotone" dataKey="avgWait" stroke={chartColors.primary} fill={chartColors.primary} fillOpacity={0.15} strokeWidth={2.5} dot={{ fill: chartColors.primary, r: 4 }} name="เวลารอ" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

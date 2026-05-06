import { motion } from 'framer-motion';
import { Sparkles, Megaphone, Package, TrendingDown, UtensilsCrossed, BarChart3 } from 'lucide-react';

const suggestions = [
  {
    icon: Megaphone,
    title: 'โปรโมทชาไทยเย็น ตอน 11:30',
    desc: 'ความต้องการเครื่องดื่มสูงช่วงก่อนเที่ยง — แนะนำให้ทำสต็อกเพิ่ม',
    priority: 'high' as const,
    color: 'from-rose-50 to-pink-50',
    borderColor: 'border-rose-200',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-700',
  },
  {
    icon: Package,
    title: 'เตรียมข้าวผัดกะเพราไก่ 15 จาน',
    desc: 'คาดการณ์ความต้องการเพิ่มขึ้นจากแนวโน้ม 3 วันล่าสุด',
    priority: 'high' as const,
    color: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
  },
  {
    icon: TrendingDown,
    title: 'ข้าวผัดความต้องการลดลง',
    desc: 'ออเดอร์ลดลง 20% จากสัปดาห์ก่อน — ลองทำโปรโมชั่นหรือลดราคา',
    priority: 'medium' as const,
    color: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-200',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
  },
  {
    icon: UtensilsCrossed,
    title: 'เสนอคอมโบเซ็ตอาหาร+เครื่องดื่ม',
    desc: 'นักเรียน 68% สั่งเครื่องดื่มคู่กับอาหารหลัก — เพิ่มรายได้ 15%',
    priority: 'medium' as const,
    color: 'from-emerald-50 to-green-50',
    borderColor: 'border-emerald-200',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
  },
  {
    icon: BarChart3,
    title: 'เตรียมของเพิ่มวันศุกร์',
    desc: 'วันศุกร์มียอดสั่งสูงที่สุด — เพิ่มวัตถุดิบ 25% จากปกติ',
    priority: 'low' as const,
    color: 'from-violet-50 to-purple-50',
    borderColor: 'border-violet-200',
    badgeBg: 'bg-violet-100',
    badgeText: 'text-violet-700',
  },
];

const priorityLabel = {
  high: { text: 'สำคัญ', bg: 'bg-rose-100 text-rose-700' },
  medium: { text: 'แนะนำ', bg: 'bg-amber-100 text-amber-700' },
  low: { text: 'ไอเดีย', bg: 'bg-blue-100 text-blue-700' },
};

export function VendorAIPanel() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-violet-500" />
        <h2 className="font-bold text-ink text-lg">AI Suggestions Today</h2>
        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium ml-1">5 คำแนะนำ</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`card p-5 bg-gradient-to-r ${s.color} border ${s.borderColor}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center flex-shrink-0">
                <s.icon className="w-5 h-5 text-ink/60" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-ink text-sm">{s.title}</h3>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${priorityLabel[s.priority].bg} ${priorityLabel[s.priority].text} flex-shrink-0`}>
                    {priorityLabel[s.priority].text}
                  </span>
                </div>
                <p className="text-muted text-xs leading-relaxed">{s.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Leaf, Clock, Lightbulb, X, ArrowUpRight, BarChart3, Zap } from 'lucide-react';

interface InsightDetail {
  title: string;
  desc: string;
  icon: typeof TrendingUp;
  color: string;
  bg: string;
  gradient: string;
  stat: string;
  sections: {
    heading: string;
    items: Array<{ label: string; value: string; highlight?: boolean }>;
  }[];
  bigNumber: { value: string; label: string };
}

const insightDetails: Record<string, InsightDetail> = {
  'เพิ่มยอดขาย': {
    title: 'เพิ่มยอดขาย',
    desc: 'AI แนะนำเมนูยอดนิยมให้นักเรียน ช่วยเพิ่มออเดอร์ให้ร้านค้า',
    icon: TrendingUp,
    color: 'text-brand-600',
    bg: 'bg-brand-50',
    gradient: 'from-brand-50 to-blue-50',
    stat: '+23%',
    bigNumber: { value: '+23%', label: 'ยอดขายเพิ่มขึ้นจาก AI' },
    sections: [
      {
        heading: 'เมนูที่ AI แนะนำแล้วขายดี',
        items: [
          { label: 'ข้าวผัดกะเพราไก่', value: '89 ออเดอร์ (+18%)', highlight: true },
          { label: 'ชาไทยเย็น', value: '76 ออเดอร์ (+32%)' },
          { label: 'ผัดไทย', value: '64 ออเดอร์ (+12%)' },
          { label: 'ก๋วยเตี๋ยวเรือน้ำ', value: '52 ออเดอร์ (+8%)' },
        ],
      },
      {
        heading: 'กลยุทธ์ AI ที่ใช้',
        items: [
          { label: 'แสดงเมนูยอดนิยมหน้าแรก', value: 'CTR 62%' },
          { label: 'แนะนำเมนูตามความชอบ', value: 'Conversion 41%' },
          { label: 'เสนอคอมโบเซ็ตอัตโนมัติ', value: '+15% basket size', highlight: true },
        ],
      },
    ],
  },
  'ลดขยะอาหาร': {
    title: 'ลดขยะอาหาร',
    desc: 'AI คาดการณ์ความต้องการ ลดการทำอาหารเหลือทิ้ง',
    icon: Leaf,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    gradient: 'from-emerald-50 to-green-50',
    stat: '-35%',
    bigNumber: { value: '-35%', label: 'ขยะอาหารลดลง' },
    sections: [
      {
        heading: 'คาดการณ์ vs ของจริง (วันนี้)',
        items: [
          { label: 'ข้าวผัดกะเพราไก่ — คาดการณ์', value: '15 จาน' },
          { label: 'ข้าวผัดกะเพราไก่ — ขายจริง', value: '14 จาน ✅', highlight: true },
          { label: 'ชาไทยเย็น — คาดการณ์', value: '20 แก้ว' },
          { label: 'ชาไทยเย็น — ขายจริง', value: '18 แก้ว ✅' },
        ],
      },
      {
        heading: 'เมนูที่ต้องระวัง (ขายน้อย)',
        items: [
          { label: 'เนื้อเร็นดัง', value: 'เหลือ 5 จาน/วัน', highlight: true },
          { label: 'ครัวซองค์มัทฉะ', value: 'เหลือ 3 ชิ้น/วัน' },
          { label: 'พุดดิ้งมะพร้าว', value: 'เหลือ 2 ชิ้น/วัน' },
        ],
      },
    ],
  },
  'ลดเวลารอ': {
    title: 'ลดเวลารอ',
    desc: 'AI แนะนำเมนูที่ทำเร็ว ลดคิวรอในโรงอาหาร',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    gradient: 'from-amber-50 to-orange-50',
    stat: '-40%',
    bigNumber: { value: '4.2 นาที', label: 'เวลารอเฉลี่ย (จาก 7 นาที)' },
    sections: [
      {
        heading: 'เปรียบเทียบเวลารอ',
        items: [
          { label: 'ก่อนใช้ AI', value: '7.0 นาที' },
          { label: 'หลังใช้ AI', value: '4.2 นาที', highlight: true },
          { label: 'เมนูที่เร็วที่สุด', value: 'พุดดิ้งมะพร้าว — 1 นาที' },
          { label: 'เมนูที่รอนานสุด', value: 'เนื้อเร็นดัง — 10 นาที' },
        ],
      },
      {
        heading: 'AI ช่วยอย่างไร',
        items: [
          { label: 'แนะนำเมนูทำเร็วเมื่อคิวยาว', value: '-2.1 นาที' },
          { label: 'กระจายออเดอร์ไปร้านว่าง', value: '-0.7 นาที' },
          { label: 'นักเรียนสั่งล่วงหน้า', value: '-1.5 นาที', highlight: true },
        ],
      },
    ],
  },
  'ตัดสินใจดีขึ้น': {
    title: 'ตัดสินใจดีขึ้น',
    desc: 'AI แสดงเทรนด์ความต้องการ ช่วยวางแผนล่วงหน้า',
    icon: Lightbulb,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    gradient: 'from-violet-50 to-purple-50',
    stat: 'AI-Powered',
    bigNumber: { value: '5', label: 'คำแนะนำจาก AI วันนี้' },
    sections: [
      {
        heading: 'AI แนะนำวันนี้',
        items: [
          { label: '📢 โปรโมทชาไทยเย็น 11:30', value: 'สำคัญ', highlight: true },
          { label: '📦 เตรียมกะเพราไก่ 15 จาน', value: 'สำคัญ' },
          { label: '📉 ข้าวผัดลดลง — ลองโปรโมชั่น', value: 'แนะนำ' },
          { label: '🍱 เสนอคอมโบเซ็ต', value: 'แนะนำ' },
          { label: '📊 วันศุกร์เพิ่มวัตถุดิบ 25%', value: 'ไอเดีย' },
        ],
      },
      {
        heading: 'เทรนด์สัปดาห์นี้',
        items: [
          { label: 'เครื่องดื่มเพิ่ม +28%', value: 'ร้อนนี้', highlight: true },
          { label: 'เมนูคลีนเพิ่ม +15%', value: 'เทรนด์สุขภาพ' },
          { label: 'เมนูฮาลาลคงที่', value: 'สม่ำเสมอ' },
        ],
      },
    ],
  },
};

export function AIGrowthInsights() {
  const [selected, setSelected] = useState<string | null>(null);
  const detail = selected ? insightDetails[selected] : null;

  return (
    <div className="mb-6">
      <div className="mb-4">
        <h2 className="font-bold text-ink text-lg flex items-center gap-2">
          <span className="text-xl">🧠</span> AI Growth Insights for Vendors
        </h2>
        <p className="text-muted text-sm mt-1">AI ช่วยเพิ่มประสิทธิภาพธุรกิจโรงอาหารอย่างไร — กดดูรายละเอียด</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.values(insightDetails).map((item, i) => (
          <motion.button
            key={item.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelected(item.title)}
            className={`card p-5 bg-gradient-to-r ${item.gradient} text-left cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-ink">{item.title}</h3>
                  <p className="text-muted text-sm mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.bg} ${item.color}`}>
                  {item.stat}
                </span>
                <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-brand-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && detail && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full z-50 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${detail.gradient} px-6 py-5 flex items-center justify-between flex-shrink-0`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center`}>
                    <detail.icon className={`w-6 h-6 ${detail.color}`} />
                  </div>
                  <div>
                    <h2 className="font-bold text-ink text-lg">{detail.title}</h2>
                    <p className="text-muted text-xs">AI Insights Detail</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Big Number */}
              <div className="px-6 py-5 bg-gray-50 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <span className={`text-4xl font-black ${detail.color}`}>{detail.bigNumber.value}</span>
                  <span className="text-muted text-sm">{detail.bigNumber.label}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {detail.sections.map((section, si) => (
                  <div key={si} className={si > 0 ? 'mt-5 pt-5 border-t border-gray-100' : ''}>
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="w-4 h-4 text-muted" />
                      <h3 className="font-bold text-ink text-sm">{section.heading}</h3>
                    </div>
                    <div className="space-y-2">
                      {section.items.map((item, ii) => (
                        <motion.div
                          key={ii}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: si * 0.15 + ii * 0.05 }}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm ${
                            item.highlight
                              ? `${detail.bg} border border-transparent`
                              : 'bg-white border border-gray-100'
                          }`}
                        >
                          <span className="text-ink font-medium">{item.label}</span>
                          <span className={`text-xs font-semibold ${item.highlight ? detail.color : 'text-muted'} ml-3 whitespace-nowrap`}>
                            {item.value}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2 flex-shrink-0">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-muted">ข้อมูลตัวอย่างสำหรับการสาธิต — ตัวจริงจะเชื่อมกับข้อมูลยอดขาย</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

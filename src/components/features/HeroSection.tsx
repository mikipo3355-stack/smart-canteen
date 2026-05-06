import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-300 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">ให้บริการนักเรียนกว่า 500 คนทุกวัน</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 text-balance">
              ไม่ต้องเข้าคิว<br />
              <span className="text-brand-200">ทานข้าวได้ทันที</span>
            </h1>

            <p className="text-lg text-brand-100 mb-8 max-w-lg text-balance">
              สั่งอาหารล่วงหน้าจากโรงอาหาร แล้วมารับได้เลยตอนพักเที่ยง ไม่ต้องรอคิวนานอีกต่อไป
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="btn-primary bg-white text-brand-700 hover:bg-brand-50 hover:shadow-xl hover:shadow-black/10 text-base px-8 py-3.5">
                เริ่มต้นใช้งาน
              </Link>
              <Link to="/login" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-base px-8 py-3.5">
                ลองใช้งาน
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-lg">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center text-2xl">🍛</div>
                  <div className="flex-1">
                    <p className="font-semibold text-ink">ข้าวผัดกะเพราไก่</p>
                    <p className="text-sm text-muted">ครัวป้าแดง</p>
                  </div>
                  <span className="font-bold text-brand-600">40 บาท</span>
                </div>
                <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-lg">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-2xl">🧋</div>
                  <div className="flex-1">
                    <p className="font-semibold text-ink">ชาไทยเย็น</p>
                    <p className="text-sm text-muted">Fresh Tea Bar</p>
                  </div>
                  <span className="font-bold text-brand-600">30 บาท</span>
                </div>
                <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-lg">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl">🍜</div>
                  <div className="flex-1">
                    <p className="font-semibold text-ink">ผัดไทย</p>
                    <p className="text-sm text-muted">Smile Noodles</p>
                  </div>
                  <span className="font-bold text-brand-600">40 บาท</span>
                </div>
              </div>
              <div className="mt-4 bg-brand-50 rounded-xl p-3 flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-600" />
                <span className="text-sm font-medium text-brand-700">รับ 12:00 น. — คิว #A023</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { Clock, Users, Zap, TrendingUp } from 'lucide-react';

const benefits = [
  { icon: Clock, title: 'ประหยัดเวลา', desc: 'สั่งล่วงหน้าแล้วข้ามคิว 15 นาที รับอาหารในไม่ถึง 2 นาที', color: 'from-blue-500 to-cyan-500' },
  { icon: Users, title: 'โรงอาหารไม่แออัด', desc: 'เลือกเวลารับอาหารต่างกัน ช่วยกระจายคนไม่ให้โรงอาหารแออัด', color: 'from-emerald-500 to-teal-500' },
  { icon: Zap, title: 'บริการรวดเร็ว', desc: 'พ่อค้าแม่ค้าเตรียมอาหารก่อนถึงเวลา ทุกอย่างพร้อมเมื่อคุณมาถึง', color: 'from-amber-500 to-orange-500' },
  { icon: TrendingUp, title: 'ยอดขายเพิ่มขึ้น', desc: 'ออเดอร์ล่วงหน้าช่วยให้ร้านค้าทำนายความต้องการ ลดขยะ และขายได้มากขึ้น', color: 'from-violet-500 to-purple-500' },
];

export function BenefitsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
            ทำไมต้องใช้ Smart Canteen?
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            สร้างมาเพื่อนักเรียนที่เห็นค่าของเวลา และร้านค้าที่อยากเติบโต
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 group"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${b.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <b.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-ink text-lg mb-2">{b.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

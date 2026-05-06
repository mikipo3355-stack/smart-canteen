import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/features/HeroSection';
import { BenefitsSection } from '../components/features/BenefitsSection';
import { ChatWidget } from '../components/features/ChatWidget';

export function LandingPage() {
  return (
    <div>
      <HeroSection />
      <BenefitsSection />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 bg-surface"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              ใช้งานอย่างไร
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              3 ขั้นตอนง่ายๆ เพื่อมื้อเที่ยงที่ดีกว่า
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'เลือกและสั่ง', desc: 'เลือกอาหารจากร้านโปรดในโรงอาหาร แล้วสั่งเลย', emoji: '📱' },
              { step: '02', title: 'เลือกเวลารับ', desc: 'เลือกช่วงเวลาที่ต้องการรับอาหารตอนพักเที่ยง', emoji: '⏰' },
              { step: '03', title: 'มารับแล้วทาน', desc: 'เดินมารับ แสดงหมายเลขคิว แล้วทานได้เลย', emoji: '🍽️' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="card p-8 text-center">
                  <div className="text-5xl mb-4">{item.emoji}</div>
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-brand-600 text-white rounded-full text-sm font-bold mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-ink text-xl mb-2">{item.title}</h3>
                  <p className="text-muted text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-4">
            พร้อมเลิกเข้าคิวแล้วหรือยัง?
          </h2>
          <p className="text-muted mb-8 max-w-lg mx-auto">
            ร่วมเป็นนักเรียนหลายร้อยคนที่ประหยัดเวลาตอนพักเที่ยง
          </p>
          <Link to="/login" className="btn-primary text-base px-8 py-3.5">
            สั่งอาหารเลย
          </Link>
        </div>
      </motion.section>

      <footer className="py-8 bg-ink text-white/50 text-center text-sm">
        <p>Smart Canteen — สร้างมาเพื่อโรงเรียน เป็นที่รักของนักเรียน</p>
      </footer>
      <ChatWidget />
    </div>
  );
}

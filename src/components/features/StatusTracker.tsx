import { motion } from 'framer-motion';
import { CheckCircle, ChefHat, Package } from 'lucide-react';

const steps = [
  { key: 'confirmed', label: 'ยืนยันแล้ว', icon: CheckCircle },
  { key: 'preparing', label: 'กำลังทำ', icon: ChefHat },
  { key: 'ready', label: 'พร้อมรับ', icon: Package },
];

export function StatusTracker({ currentStatus }: { currentStatus: string }) {
  const statusOrder = ['confirmed', 'preparing', 'ready'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const isComplete = i <= currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step.key} className="flex items-center flex-1">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                isComplete
                  ? isCurrent
                    ? 'bg-brand-600 text-white ring-4 ring-brand-200'
                    : 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-300'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium text-center ${isComplete ? 'text-ink' : 'text-muted/50'}`}>
                {step.label}
              </span>
            </motion.div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-6 rounded transition-colors ${
                i < currentIndex ? 'bg-emerald-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

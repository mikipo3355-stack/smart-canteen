import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Shield, Smartphone, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface PaymentModalProps {
  isOpen: boolean;
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ isOpen, total, onClose, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<'qr' | 'processing' | 'success'>('qr');

  useEffect(() => {
    if (isOpen) setStep('qr');
  }, [isOpen]);

  // Simulate payment processing
  useEffect(() => {
    if (step === 'processing') {
      const timer = setTimeout(() => {
        setStep('success');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Auto close after success
  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => {
        onSuccess();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, onSuccess]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step === 'qr' ? onClose : undefined}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full sm:max-w-md bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden"
          >
            {step === 'qr' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-ink">สแกนเพื่อชำระเงิน</h2>
                  <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <X className="w-4 h-4 text-muted" />
                  </button>
                </div>

                {/* Amount */}
                <div className="text-center mb-6">
                  <p className="text-sm text-muted mb-1">จำนวนเงิน</p>
                  <p className="text-4xl font-black text-brand-600">{total} <span className="text-lg text-muted font-normal">บาท</span></p>
                </div>

                {/* QR Code */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-4">
                  <div className="aspect-square max-w-[220px] mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 flex items-center justify-center relative overflow-hidden">
                    {/* Mock QR Code Pattern */}
                    <div className="grid grid-cols-9 grid-rows-9 gap-0.5 w-full h-full">
                      {/* Corner squares (QR finder patterns) */}
                      <div className="col-span-3 row-span-3 bg-ink rounded-sm relative">
                        <div className="absolute inset-1 bg-white rounded-sm">
                          <div className="absolute inset-1 bg-ink rounded-sm" />
                        </div>
                      </div>
                      <div className="col-start-7 col-span-3 row-span-3 bg-ink rounded-sm relative">
                        <div className="absolute inset-1 bg-white rounded-sm">
                          <div className="absolute inset-1 bg-ink rounded-sm" />
                        </div>
                      </div>
                      <div className="col-start-1 row-start-7 col-span-3 row-span-3 bg-ink rounded-sm relative">
                        <div className="absolute inset-1 bg-white rounded-sm">
                          <div className="absolute inset-1 bg-ink rounded-sm" />
                        </div>
                      </div>
                      {/* Data modules */}
                      {[
                        'col-start-5 row-start-1', 'col-start-5 row-start-2', 'col-start-6 row-start-1',
                        'col-start-1 row-start-4', 'col-start-3 row-start-4', 'col-start-4 row-start-5',
                        'col-start-5 row-start-4', 'col-start-6 row-start-5', 'col-start-7 row-start-4',
                        'col-start-8 row-start-1', 'col-start-9 row-start-2', 'col-start-8 row-start-3',
                        'col-start-5 row-start-5', 'col-start-8 row-start-5', 'col-start-9 row-start-4',
                        'col-start-2 row-start-5', 'col-start-3 row-start-6', 'col-start-1 row-start-5',
                        'col-start-5 row-start-6', 'col-start-6 row-start-6', 'col-start-7 row-start-6',
                        'col-start-8 row-start-6', 'col-start-9 row-start-6',
                        'col-start-1 row-start-8', 'col-start-2 row-start-8', 'col-start-3 row-start-8',
                        'col-start-5 row-start-8', 'col-start-6 row-start-8', 'col-start-7 row-start-8',
                        'col-start-1 row-start-9', 'col-start-4 row-start-9', 'col-start-7 row-start-9',
                        'col-start-9 row-start-8', 'col-start-8 row-start-9', 'col-start-9 row-start-9',
                        'col-start-4 row-start-4', 'col-start-6 row-start-3', 'col-start-9 row-start-3',
                        'col-start-9 row-start-7', 'col-start-7 row-start-7', 'col-start-5 row-start-7',
                      ].map((pos, i) => (
                        <div key={i} className={`${pos} bg-ink rounded-[1px]`} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Payment info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                    <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <p className="text-sm text-emerald-700 font-medium">ชำระเงินผ่าน PromptPay อย่างปลอดภัย</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Smartphone className="w-5 h-5 text-brand-600 flex-shrink-0" />
                    <p className="text-sm text-muted">เปิดแอปธนาคารแล้วสแกน QR Code</p>
                  </div>
                </div>

                {/* Simulate payment button */}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => setStep('processing')}
                >
                  <Smartphone className="w-5 h-5" />
                  จำลองการสแกน QR
                </Button>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 flex flex-col items-center justify-center"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-4 border-brand-200 rounded-full animate-spin border-t-brand-600" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-brand-600" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">กำลังดำเนินการชำระเงิน</h3>
                <p className="text-muted text-center">กรุณารอสักครู่...</p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                  className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-ink mb-2">ชำระเงินสำเร็จ!</h3>
                <p className="text-muted text-center">ยอดเงิน {total} บาท</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

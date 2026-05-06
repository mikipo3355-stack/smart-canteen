import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import { useToast } from '../store/toastStore';
import { Lock, User, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

const demoAccounts = [
  { username: '65001', password: '1234', name: 'ตำนาน', role: 'นักเรียน', color: 'from-blue-500 to-cyan-500', emoji: '🎓' },
  { username: 'vendor1', password: '1234', name: 'ป้าแดง', role: 'ร้านค้า', color: 'from-amber-500 to-orange-500', emoji: '🍳' },
  { username: 'admin', password: '1234', name: 'ผู้ดูแลระบบ', role: 'ผู้ดูแล', color: 'from-violet-500 to-purple-500', emoji: '⚙️' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsLoggingIn(true);
    const result = await login(username, password);
    if (result.success) {
      addToast('เข้าสู่ระบบสำเร็จ!', 'success');
      const account = demoAccounts.find(a => a.username === username);
      if (account?.role === 'vendor') navigate('/vendor');
      else if (account?.role === 'admin') navigate('/admin');
      else navigate('/student');
    } else {
      addToast(result.error || 'เข้าสู่ระบบไม่สำเร็จ', 'error');
    }
    setIsLoggingIn(false);
  };

  const quickLogin = async (account: typeof demoAccounts[0]) => {
    setUsername(account.username);
    setPassword(account.password);
    setIsLoggingIn(true);
    const result = await login(account.username, account.password);
    if (result.success) {
      addToast(`ยินดีต้อนรับ ${account.name}!`, 'success');
      if (account.role === 'vendor') navigate('/vendor');
      else if (account.role === 'admin') navigate('/admin');
      else navigate('/student');
    }
    setIsLoggingIn(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl"
        />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-emerald-400/5 rounded-full blur-2xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <span className="text-white text-xl font-black">SC</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Smart Canteen</h1>
          <p className="text-brand-200 text-sm">ระบบสั่งอาหารล่วงหน้า</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-6">เข้าสู่ระบบ</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2 font-medium">ชื่อผู้ใช้ / รหัสนักเรียน</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                  placeholder="กรอกชื่อผู้ใช้"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2 font-medium">รหัสผ่าน</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                  placeholder="กรอกรหัสผ่าน"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || !username || !password}
              className="w-full bg-white text-brand-700 font-bold py-3.5 rounded-xl hover:bg-brand-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-black/10"
            >
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
              ) : (
                <>
                  เข้าสู่ระบบ
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">บัญชีทดลอง</h3>
            </div>
            <div className="space-y-2">
              {demoAccounts.map(account => (
                <button
                  key={account.username}
                  onClick={() => quickLogin(account)}
                  disabled={isLoggingIn}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${account.color} hover:opacity-90 transition-all duration-200 disabled:opacity-50 text-white group`}
                >
                  <span className="text-xl">{account.emoji}</span>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm">{account.name}</p>
                    <p className="text-white/70 text-xs">{account.role} — รหัส: {account.username}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-white/40 text-xs mt-6"
        >
          Smart Canteen v1.0 — Competition Demo
        </motion.p>
      </div>
    </div>
  );
}

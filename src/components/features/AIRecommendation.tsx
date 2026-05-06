import { Sparkles } from 'lucide-react';

export function AIRecommendation() {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">AI แนะนำ</span>
      </div>
      <p className="text-ink font-semibold text-sm">เมนูยอดฮิตวันนี้: ข้าวผัดกะเพราไก่</p>
      <p className="text-muted text-xs mt-1">สั่งโดยนักเรียน 42 คนวันนี้ — 95% ให้คะแนน 4 ดาวขึ้นไป</p>
    </div>
  );
}

import { Leaf } from 'lucide-react';

export function WasteInsight() {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <Leaf className="w-5 h-5 text-emerald-600" />
      </div>
      <div>
        <p className="font-semibold text-ink text-sm">ข้อมูลลดขยะอาหาร</p>
        <p className="text-muted text-sm">
          อาหารเหลือขายลดลงประมาณ <span className="font-bold text-emerald-600">35%</span>
        </p>
      </div>
    </div>
  );
}

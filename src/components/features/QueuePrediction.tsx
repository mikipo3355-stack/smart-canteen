import { Clock } from 'lucide-react';

export function QueuePrediction() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <Clock className="w-5 h-5 text-brand-600" />
      </div>
      <div>
        <p className="font-semibold text-ink text-sm">พยากรณ์คิว</p>
        <p className="text-muted text-sm">
          เวลารอปัจจุบัน: <span className="font-bold text-brand-600">4 นาที</span>
        </p>
      </div>
    </div>
  );
}

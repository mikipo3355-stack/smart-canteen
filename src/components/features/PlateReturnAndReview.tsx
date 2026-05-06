import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Star, Send, Check, MessageSquare } from 'lucide-react';
import { useOrders } from '../../store/orderStore';
import { useReviews } from '../../store/reviewStore';
import { useAuth } from '../../store/authStore';
import { useToast } from '../../store/toastStore';
import { menuItems, shops as allShops } from '../../data/mockData';

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'เพิ่งรีวิว';
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ชั่วโมงที่แล้ว`;
  return `${Math.floor(hrs / 24)} วันที่แล้ว`;
}

export function PlateReturnAndReview() {
  const { orders, returnPlate } = useOrders();
  const { user } = useAuth();
  const { addReview, reviews } = useReviews();
  const { addToast } = useToast();

  const [reviewingOrder, setReviewingOrder] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAllReturns, setShowAllReturns] = useState(false);

  const pendingReturns = orders.filter(
    (o: any) => o.status === 'picked_up' && !o.plateReturned
  );
  const displayReturns = showAllReturns ? pendingReturns : pendingReturns.slice(0, 2);

  const displayReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const handleReturnPlate = (orderId: string) => {
    returnPlate(orderId);
    addToast('🍽️ คืนจานสำเร็จ!', 'success');
    setReviewingOrder(orderId);
    setReviewRating(0);
    setReviewComment('');
    setReviewSubmitted(false);
  };

  const handleSubmitReview = () => {
    if (!reviewingOrder || !reviewRating) return;

    const order = orders.find((o: any) => o.id === reviewingOrder);
    if (!order) return;

    const firstItem = order.items?.[0];
    const matchedItem = firstItem ? menuItems.find((m: any) => m.name === firstItem.name) : undefined;
    const matchedShop = matchedItem ? allShops.find((s: any) => s.id === matchedItem.shopId) : undefined;

    addReview({
      shopId: matchedShop?.id || 'shop-1',
      shopName: matchedShop?.name || 'ร้านค้า',
      studentName: user?.name || 'นักเรียน',
      rating: reviewRating,
      comment: reviewComment.trim() || '⭐',
      menuItem: firstItem?.name,
    });

    addToast('⭐ ส่งรีวิวแล้ว!', 'success');
    setReviewSubmitted(true);
  };

  const ratingEmoji = ['', '😞', '😐', '🙂', '😊', '🤩'];
  const ratingText = ['', 'แย่มาก', 'พอใช้', 'ดี', 'ดีมาก', 'ยอดเยี่ยม!'];

  const reviewing = reviewingOrder ? orders.find((o: any) => o.id === reviewingOrder) : null;

  return (
    <div className="mb-6">

      {/* ========== PLATE RETURN NOTIFICATION ========== */}
      <AnimatePresence>
        {pendingReturns.length > 0 && !reviewingOrder && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <div className="card p-4 border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-ink text-sm">คืนจานที่จุดรับคืน</h3>
                  <p className="text-xs text-muted">หลังจากทานเสร็จแล้ว นำจานมาคืนที่จุดรับคืน</p>
                </div>
              </div>

              <div className="space-y-2">
                {displayReturns.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-3 bg-white/70 rounded-xl px-3 py-2.5"
                  >
                    <span className="text-sm text-ink flex-1 truncate">
                      {order.items.map((it: any) => `${it.emoji} ${it.name}`).join(', ')}
                    </span>
                    <button
                      onClick={() => handleReturnPlate(order.id)}
                      className="text-xs font-semibold bg-amber-500 text-white px-4 py-1.5 rounded-lg hover:bg-amber-600 transition-colors flex-shrink-0 active:scale-95"
                    >
                      คืนจานแล้ว
                    </button>
                  </div>
                ))}
              </div>

              {pendingReturns.length > 2 && (
                <button
                  onClick={() => setShowAllReturns(!showAllReturns)}
                  className="w-full mt-2 text-center text-xs text-amber-700 font-medium hover:underline"
                >
                  {showAllReturns ? '↑ ย่อลง' : `↓ ดูทั้งหมด ${pendingReturns.length} ออเดอร์`}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== REVIEW FORM (after plate return) ========== */}
      <AnimatePresence>
        {reviewingOrder && !reviewSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <div className="card p-4 border-2 border-violet-200">
              {reviewing && (
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-emerald-600 font-medium">คืนจานสำเร็จ</span>
                  <span className="text-xs text-muted">— ให้คะแนน {reviewing.items?.[0]?.emoji} {reviewing.items?.[0]?.name}</span>
                </div>
              )}

              <p className="font-bold text-ink text-sm mb-3">อาหารเป็นอย่างไรบ้าง?</p>

              {/* Stars */}
              <div className="flex items-center gap-1.5 mb-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setReviewRating(star)}
                  >
                    <Star
                      className={`w-7 h-7 ${star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                    />
                  </motion.button>
                ))}
                {reviewRating > 0 && (
                  <span className="text-sm text-violet-600 ml-2 font-medium">
                    {ratingEmoji[reviewRating]} {ratingText[reviewRating]}
                  </span>
                )}
              </div>

              {/* Comment */}
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="รีวิวสั้นๆ (ไม่บังคับ)..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:bg-white resize-none placeholder:text-muted/50 mb-3 transition-colors"
              />

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitReview}
                  disabled={!reviewRating}
                  className="flex-1 bg-violet-500 text-white text-sm font-semibold py-2 rounded-xl hover:bg-violet-600 transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  ส่งรีวิว
                </button>
                <button
                  onClick={() => setReviewingOrder(null)}
                  className="px-4 py-2 text-sm text-muted hover:text-ink bg-gray-100 rounded-xl transition-colors"
                >
                  ข้าม
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== REVIEW SUCCESS ========== */}
      <AnimatePresence>
        {reviewSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-6"
          >
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-700">ขอบคุณสำหรับรีวิว!</p>
              <p className="text-xs text-emerald-600/70">รีวิวของคุณจะช่วยให้เพื่อนๆ เลือกอาหารได้ดีขึ้น</p>
            </div>
            <button
              onClick={() => setReviewingOrder(null)}
              className="text-xs text-emerald-600 hover:underline flex-shrink-0"
            >
              กลับไปดูออเดอร์อื่น
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== REVIEWS LIST ========== */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-brand-500" />
          <h2 className="font-bold text-ink text-sm">รีวิวล่าสุด</h2>
          <span className="text-xs text-muted">({reviews.length})</span>
        </div>

        <div className="space-y-2">
          {displayReviews.map((review: any) => {
            const shop = allShops.find((s: any) => s.id === review.shopId);
            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-3"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 bg-gradient-to-br from-brand-400 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-bold">{review.studentName.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-ink text-xs">{review.studentName}</span>
                      <span className="text-[11px] text-gray-400">
                        {shop?.emoji} {review.shopName}
                      </span>
                      <span className="text-[10px] text-muted ml-auto">{timeAgo(review.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-150'}`}
                          />
                        ))}
                      </div>
                      {review.menuItem && (
                        <span className="text-[10px] text-muted">• {review.menuItem}</span>
                      )}
                    </div>
                    <p className="text-ink text-xs mt-1 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {reviews.length > 3 && (
          <button
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="w-full mt-2 text-center text-xs text-brand-600 font-medium hover:underline"
          >
            {showAllReviews ? '↑ ย่อลง' : `↓ ดูทั้งหมด ${reviews.length} รีวิว`}
          </button>
        )}
      </div>
    </div>
  );
}

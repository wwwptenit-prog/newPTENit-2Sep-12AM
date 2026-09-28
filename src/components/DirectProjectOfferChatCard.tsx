import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Send, 
  ShieldCheck, 
  Globe, 
  AlertTriangle,
  Calendar,
  DollarSign,
  Paperclip
} from 'lucide-react';
import { DirectOfferMeta } from '../types';

interface DirectProjectOfferChatCardProps {
  offer: DirectOfferMeta;
  isSelf: boolean;
  currentUserId?: string;
  currentUserRole?: string;
  onAccept?: (offer: DirectOfferMeta) => void;
  onDecline?: (offer: DirectOfferMeta) => void;
  onPublishToPublic?: (offer: DirectOfferMeta) => void;
  onResend?: (offer: DirectOfferMeta) => void;
}

export const DirectProjectOfferChatCard: React.FC<DirectProjectOfferChatCardProps> = ({
  offer,
  isSelf,
  currentUserId,
  currentUserRole,
  onAccept,
  onDecline,
  onPublishToPublic,
  onResend
}) => {
  const [now, setNow] = useState(Date.now());
  const [actionDone, setActionDone] = useState<string | null>(null);

  // Live 1-second countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const expiresAtMs = offer.expiresAt ? new Date(offer.expiresAt).getTime() : (offer.createdAt ? new Date(offer.createdAt).getTime() + 24 * 3600 * 1000 : 0);
  const remainingMs = Math.max(0, expiresAtMs - now);
  const isExpired = expiresAtMs > 0 && remainingMs <= 0;

  // Determine effective status
  let effectiveStatus = offer.status;
  if (effectiveStatus === 'pending' && isExpired) {
    effectiveStatus = 'expired_returned';
  }
  if (actionDone === 'accepted') effectiveStatus = 'accepted';
  if (actionDone === 'declined') effectiveStatus = 'declined';
  if (actionDone === 'published') effectiveStatus = 'accepted'; // or handled

  // Calculate remaining hours, minutes, seconds
  const totalSecs = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  // Is current viewer the intended recipient (seller / admin)?
  const isRecipient = !isSelf || (currentUserId && offer.targetSellerId && currentUserId === offer.targetSellerId) || currentUserRole === 'admin';

  const handleAcceptClick = () => {
    setActionDone('accepted');
    if (onAccept) onAccept(offer);
  };

  const handleDeclineClick = () => {
    setActionDone('declined');
    if (onDecline) onDecline(offer);
  };

  const handlePublishClick = () => {
    setActionDone('published');
    if (onPublishToPublic) onPublishToPublic(offer);
  };

  const handleResendClick = () => {
    setActionDone(null);
    if (onResend) onResend(offer);
  };

  return (
    <div className="my-1.5 p-3.5 sm:p-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-md space-y-3 font-bengali max-w-sm sm:max-w-md w-full">
      {/* Top Header with Badge */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#006A4E] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shrink-0">
            <Briefcase className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#006A4E] dark:text-emerald-400 block truncate">
              {effectiveStatus === 'accepted'
                ? '✅ গৃহীত ডিরেক্ট প্রজেক্ট'
                : effectiveStatus === 'declined'
                ? '❌ প্রত্যাখ্যাত অফার'
                : effectiveStatus === 'expired_returned'
                ? '🔄 অটো ফেরত এসেছে (২৪h সমাপ্ত)'
                : '🔒 ডিরেক্ট প্রজেক্ট অফার (২৪ ঘণ্টা)'}
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
              {offer.title || 'কাস্টম প্রজেক্ট প্রস্তাব'}
            </span>
          </div>
        </div>

        {/* Status Pill */}
        <div className="shrink-0">
          {effectiveStatus === 'accepted' ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-[#006A4E] dark:text-emerald-300 text-[10px] font-black border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#006A4E] dark:text-emerald-400" />
              গৃহীত
            </span>
          ) : effectiveStatus === 'declined' ? (
            <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 text-[10px] font-black border border-rose-300 dark:border-rose-700 flex items-center gap-1">
              <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
              প্রত্যাখ্যাত
            </span>
          ) : effectiveStatus === 'expired_returned' ? (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-black border border-amber-300 dark:border-amber-700 flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              অটো ফেরত
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 text-[10px] font-black border border-sky-300 dark:border-sky-700 flex items-center gap-1">
              <Clock className="w-3 h-3 text-sky-600 dark:text-sky-400 animate-spin" />
              অপেক্ষমাণ
            </span>
          )}
        </div>
      </div>

      {/* Cover Image if present */}
      {offer.coverImage && (
        <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
          <img src={offer.coverImage} alt={offer.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Offer Meta Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">অফার বাজেট</span>
          <span className="font-black text-[#006A4E] dark:text-emerald-400 text-sm">
            {offer.budgetRange || `৳${Number(offer.budget || 0).toLocaleString('bn-BD')}`}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">ডেলিভারি সময়সীমা</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {offer.deliveryDays || 3} দিন
          </span>
        </div>
        {offer.category && (
          <div className="col-span-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between gap-1">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">ক্যাটাগরি</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                {offer.category}
              </span>
            </div>
            {offer.offerType && (
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                offer.offerType === 'paid'
                  ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300'
                  : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
              }`}>
                {offer.offerType === 'paid' ? '💳 সিকিউরড অগ্রিম' : '⚡ কাজ দেখে বিল'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Skills tags if present */}
      {offer.skills && (
        <div className="flex flex-wrap gap-1">
          {offer.skills.split(',').map((skill, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-md">
              {skill.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Requirements List if present */}
      {offer.requirements && offer.requirements.length > 0 && (
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">📌 প্রজেক্ট রিকোয়ারমেন্টস:</span>
          <div className="space-y-1">
            {offer.requirements.map((req, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#38BDF8] shrink-0 mt-0.5" />
                <span className="leading-tight">{req}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attachment link if present */}
      {offer.attachmentUrl && (
        <a 
          href={offer.attachmentUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1.5 text-xs text-[#006A4E] dark:text-[#38BDF8] hover:underline font-bold"
        >
          <Paperclip className="w-3.5 h-3.5" />
          <span>সংযুক্ত ফাইল / রেফারেন্স লিংক দেখুন</span>
        </a>
      )}

      {/* Description */}
      {offer.description && (
        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-h-24 overflow-y-auto pr-1">
          <p className="whitespace-pre-wrap">{offer.description}</p>
        </div>
      )}

      {/* 24-Hour Countdown / Status Banner */}
      {effectiveStatus === 'pending' && (
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 block">
                ২৪ ঘণ্টার ভ্যালিডিটি কাউন্টডাউন
              </span>
              <span className="text-xs font-black text-amber-900 dark:text-amber-200 font-mono tracking-wide">
                {hours > 0 ? `${hours} ঘণ্টা ` : ''}{mins} মিনিট {secs} সেকেন্ড বাকি
              </span>
            </div>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold shrink-0">
            প্রাইভেট
          </span>
        </div>
      )}

      {/* Expired / Auto-Returned Notice */}
      {effectiveStatus === 'expired_returned' && (
        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300 font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>২৪ ঘণ্টার মেয়াদ শেষ • অফার অটো ফেরত এসেছে</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            নির্দিষ্ট সেলার ২৪ ঘণ্টার মধ্যে অফারটি রিসিভ না করায় এটি স্বয়ংক্রিয়ভাবে ফেরত এসেছে। আপনি চাইলে এটি সরাসরি সবার জন্য পাবলিক নিউজ ফিডে প্রকাশ করতে পারেন।
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {/* Case 1: Pending & Recipient (Seller / Admin) */}
        {effectiveStatus === 'pending' && isRecipient && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAcceptClick}
              className="flex-1 py-2 px-3 bg-[#006A4E] hover:bg-[#047857] text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>অফার একসেপ্ট ও শুরু</span>
            </button>
            <button
              type="button"
              onClick={handleDeclineClick}
              className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-600 dark:text-slate-300 hover:text-rose-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>প্রত্যাখ্যান</span>
            </button>
          </div>
        )}

        {/* Case 2: Pending & Sender (Buyer) */}
        {effectiveStatus === 'pending' && !isRecipient && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              সেলার রিসিভ করার অপেক্ষায়
            </span>
            <button
              type="button"
              onClick={handleDeclineClick}
              className="py-1 px-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-lg transition cursor-pointer"
            >
              অফার প্রত্যাহার
            </button>
          </div>
        )}

        {/* Case 3: Expired / Auto-Returned (Options for Buyer) */}
        {effectiveStatus === 'expired_returned' && (
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <button
              type="button"
              onClick={handlePublishClick}
              className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
            >
              <Globe className="w-4 h-4" />
              <span>📢 পাবলিক নিউজ ফিডে পোস্ট করুন</span>
            </button>
            <button
              type="button"
              onClick={handleResendClick}
              className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition cursor-pointer active:scale-95"
              title="নতুন করে ২৪ ঘণ্টার জন্য পাঠান"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>পুনরায় পাঠান</span>
            </button>
          </div>
        )}

        {/* Case 4: Accepted State */}
        {effectiveStatus === 'accepted' && (
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#006A4E] dark:text-emerald-400 shrink-0" />
            <span>অর্ডার সফলভাবে একসেপ্ট করা হয়েছে এবং এস্ক্রো কার্যকর।</span>
          </div>
        )}

        {/* Case 5: Declined State */}
        {effectiveStatus === 'declined' && (
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2">
            <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <span>অফারটি বাতিল বা প্রত্যাহার করা হয়েছে।</span>
          </div>
        )}
      </div>
    </div>
  );
};

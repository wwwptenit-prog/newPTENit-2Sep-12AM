import React, { useState } from 'react';
import {
  Code,
  TrendingUp,
  Palette,
  Video,
  Search,
  Share2,
  Globe,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  X,
  MessageSquare,
  ShoppingBag,
  Star,
  Sparkles,
  BadgeCheck,
  Check,
  Clock,
  ShieldCheck,
  Cpu,
  Bot
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Service, MarketplaceGig } from '../types';
import { GigCard } from './GigCard';
import { GigDetailPage } from './GigDetailPage';
import { OrderCheckoutModal } from './OrderCheckoutModal';
import { DigitalProductsSection } from './DigitalProductsSection';
import { getLocalizedService } from '../utils/localization';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Code,
  TrendingUp,
  Palette,
  Video,
  Search,
  Share2,
  Globe,
  Award
};

interface ServicesSectionProps {
  setActiveTab?: (tab: string, category?: string) => void;
  openAuthModal?: () => void;
  isStandalonePage?: boolean;
  onBack?: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  setActiveTab,
  openAuthModal,
  isStandalonePage = false,
  onBack
}) => {
  const { currentUser, services, gigs, siteSettings, t, lang } = useData();

  // In-place Detail Modal state for Services and Gigs
  const [activeInPlaceGig, setActiveInPlaceGig] = useState<MarketplaceGig | null>(null);
  const [inPlaceSelectedPkg, setInPlaceSelectedPkg] = useState<'basic' | 'standard' | 'premium'>('basic');

  // State for Direct Order Modal (Checkout)
  const [activeGigForOrder, setActiveGigForOrder] = useState<MarketplaceGig | null>(null);
  const [selectedPkgType, setSelectedPkgType] = useState<'basic' | 'standard' | 'premium'>('basic');

  // Top Trending General Gigs
  const featuredGigs = gigs.slice(0, 4);

  // Open Service or Gig Details IN-PLACE right here in this section (modal)
  const handleOpenServiceDetail = (service: Service) => {
    const matchedGig = mapServiceToGig(service);
    setActiveInPlaceGig(matchedGig);
    setInPlaceSelectedPkg('basic');
  };

  const navigateToGigDetail = (gig: MarketplaceGig) => {
    setActiveInPlaceGig(gig);
    setInPlaceSelectedPkg('basic');
  };

  // Start Order Checkout Flow from In-place Detail Modal
  const handleStartOrderFromInPlace = (pkgType: 'basic' | 'standard' | 'premium' = 'basic') => {
    if (!activeInPlaceGig) return;
    setActiveGigForOrder(activeInPlaceGig);
    setSelectedPkgType(pkgType);
    setActiveInPlaceGig(null);
  };

  // Helper to map an Agency Service into a Marketplace Gig format for GigCard rendering & detailed package ordering
  const mapServiceToGig = (service: Service): MarketplaceGig => {
    const locService = getLocalizedService(service, lang);

    const matchedGig = gigs.find(
      g => g.id === service.id || g.title.toLowerCase() === service.title.toLowerCase()
    );
    if (matchedGig) {
      return {
        ...matchedGig,
        title: locService.title,
        category: locService.category,
        description: locService.shortDescription,
        sellerName: 'PTENit Official Agency',
        sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        sellerLevel: 'Official Top Rated Agency',
        isAgencyStaff: true,
        offerBadge: matchedGig.offerBadge || (lang === 'en' ? 'Official Guarantee' : 'অফিশিয়াল গ্যারান্টি')
      };
    }

    const defaultFeatures = locService.features && locService.features.length > 0
      ? locService.features
      : (lang === 'en'
        ? ['Custom Responsive Design', 'SEO Friendly Structure', 'Technical Support', 'Source Code Delivery']
        : ['কাস্টম রেসপন্সিভ ডিজাইন', 'এসইও ফ্রেন্ডলি স্ট্রাকচার', 'টেকনিক্যাল সাপোর্ট', 'সোর্স ফাইল ডেলিভারি']);

    return {
      id: service.id,
      sellerId: 'ptenit-agency',
      sellerName: 'PTENit Official Agency',
      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      sellerLevel: 'Official Top Rated Agency',
      isAgencyStaff: true,
      title: locService.title,
      category: locService.category,
      description: locService.fullDescription || locService.shortDescription,
      thumbnail: service.thumbnail || 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
      rating: service.rating || 5.0,
      reviewsCount: service.reviewsCount || 48,
      salesCount: 150,
      packages: {
        basic: {
          name: service.packages?.basic?.name || (lang === 'en' ? 'Basic Package' : 'বেসিক প্যাকেজ'),
          price: service.packages?.basic?.price ?? 5000,
          deliveryDays: service.packages?.basic?.deliveryDays ?? 3,
          revisions: (service.packages?.basic?.revisions as any) || '3',
          features: service.packages?.basic?.features || defaultFeatures.slice(0, 3)
        },
        standard: {
          name: service.packages?.standard?.name || (lang === 'en' ? 'Standard Package' : 'স্ট্যান্ডার্ড প্যাকেজ'),
          price: service.packages?.standard?.price ?? 12000,
          deliveryDays: service.packages?.standard?.deliveryDays ?? 5,
          revisions: (service.packages?.standard?.revisions as any) || '5',
          features: service.packages?.standard?.features || defaultFeatures.slice(0, 4)
        },
        premium: {
          name: service.packages?.premium?.name || (lang === 'en' ? 'Premium Package' : 'প্রিমিয়াম প্যাকেজ'),
          price: service.packages?.premium?.price ?? 25000,
          deliveryDays: service.packages?.premium?.deliveryDays ?? 7,
          revisions: (service.packages?.premium?.revisions as any) || 'Unlimited',
          features: service.packages?.premium?.features || defaultFeatures
        }
      },
      tags: ['Official Agency', 'PTENit Guarantee', locService.category],
      status: 'active' as const,
      offerBadge: lang === 'en' ? 'Official Agency' : 'অফিশিয়াল এজেন্সি'
    };
  };

  // Reusable Unified Service Card Component - uses GigCard for exact visual parity
  const renderServiceCard = (service: Service) => {
    const gigObj = mapServiceToGig(service);
    return (
      <GigCard
        key={service.id}
        gig={gigObj}
        onClick={() => handleOpenServiceDetail(service)}
        currentUser={currentUser}
      />
    );
  };

  const allPublishedServices = services.filter(s => s.published);

  // In-Place Detail Modal for both Agency Packages and Popular Gigs
  const renderDetailModal = () => {
    if (!activeInPlaceGig) return null;

    const isAgency = activeInPlaceGig.isAgencyStaff || activeInPlaceGig.sellerId === 'ptenit-agency';
    const pkgKeys: Array<'basic' | 'standard' | 'premium'> = ['basic', 'standard', 'premium'];
    const activePkg = activeInPlaceGig.packages?.[inPlaceSelectedPkg] || activeInPlaceGig.packages?.basic || {
      name: 'স্ট্যান্ডার্ড প্যাকেজ',
      price: 5000,
      deliveryDays: 3,
      revisions: '3',
      features: ['কাস্টম ডিজাইন', 'রেসপন্সিভ লেআউট', 'ফুল সাপোর্ট']
    };

    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn font-bengali">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full p-4 sm:p-7 relative shadow-2xl space-y-4 sm:space-y-5 my-auto max-h-[92vh] overflow-y-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 sm:pb-4">
            <button
              type="button"
              onClick={() => setActiveInPlaceGig(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#1DB954] text-slate-800 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:text-white font-bold text-xs transition cursor-pointer active:scale-95 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('ফিরে যান', 'Go Back')}</span>
            </button>

            <span className="text-xs font-black text-[#1DB954] bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/20 truncate max-w-[220px]">
              {isAgency ? 'Official Agency Package' : (activeInPlaceGig.category || 'Freelance Service')}
            </span>

            <button
              type="button"
              onClick={() => setActiveInPlaceGig(null)}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hero Banner / Thumbnail */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800">
            <img
              src={activeInPlaceGig.thumbnail || 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80'}
              alt={activeInPlaceGig.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-4 sm:p-6">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>{activeInPlaceGig.rating || 5.0} ({activeInPlaceGig.reviewsCount || 48} রিভিউ)</span>
                <span>•</span>
                <span className="text-slate-300">{activeInPlaceGig.salesCount || 120}+ ডেলিভারি</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
                {activeInPlaceGig.title}
              </h2>
            </div>
          </div>

          {/* Provider / Agency Info Bar */}
          <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={activeInPlaceGig.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={activeInPlaceGig.sellerName}
                className="w-8 h-8 rounded-full object-cover border-2 border-[#1DB954] shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white truncate">
                  <span>{activeInPlaceGig.sellerName}</span>
                  <BadgeCheck className="w-4 h-4 text-[#0084FF] fill-[#0084FF] text-white shrink-0" />
                </div>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block truncate">
                  {isAgency ? 'PTENit গ্যারান্টিযুক্ত অফিশিয়াল সার্ভিস' : (activeInPlaceGig.sellerLevel || 'Verified Specialist')}
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-[#1DB954] font-black text-[11px] border border-emerald-500/20 shrink-0">
              ১০০% এস্ক্রো সিকিউরড
            </span>
          </div>

          {/* 3 Package Tier Selector */}
          {activeInPlaceGig.packages && (
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">
                  প্যাকেজ নির্বাচন করুন:
                </h4>
                <span className="text-[11px] text-slate-500">
                  যেকোনো প্যাকেজ সিলেক্ট করে বিস্তারিত ও ফিচার দেখুন
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {pkgKeys.map(pKey => {
                  const pkg = activeInPlaceGig.packages?.[pKey];
                  if (!pkg) return null;
                  const isSel = inPlaceSelectedPkg === pKey;
                  return (
                    <button
                      key={pKey}
                      type="button"
                      onClick={() => setInPlaceSelectedPkg(pKey)}
                      className={`p-2.5 sm:p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-between ${
                        isSel
                          ? 'border-[#1DB954] bg-[#1DB954]/10 ring-2 ring-[#1DB954]/30 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className={`text-[9px] sm:text-[10px] uppercase font-black block tracking-wider ${
                          isSel ? 'text-[#1DB954]' : 'text-slate-400'
                        }`}>
                          {pKey === 'basic' ? 'বেসিক' : pKey === 'standard' ? 'স্ট্যান্ডার্ড' : 'প্রিমিয়াম'}
                        </span>
                        <div className="font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white truncate mt-0.5">
                          {pkg.name}
                        </div>
                      </div>
                      <div className="font-black text-xs sm:text-base text-[#1DB954] mt-2">
                        ৳{pkg.price.toLocaleString('bn-BD')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected Package Detailed Specs & Checklists */}
          <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/90 dark:border-slate-800 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-700/80 pb-2.5">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">নির্বাচিত প্যাকেজ</span>
                <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {activePkg.name}
                </h5>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#1DB954]" />
                  {activePkg.deliveryDays} দিন ডেলিভারি
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  {activePkg.revisions} রিভিশন
                </span>
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 block">এই প্যাকেজে যা যা অন্তর্ভুক্ত:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                {(activePkg.features || []).map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <span className="text-[11px] font-bold text-slate-900 dark:text-white block">সার্ভিস বিবরণ:</span>
            <p className="line-clamp-4 sm:line-clamp-none">{activeInPlaceGig.description}</p>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">প্যাকেজ মূল্য</span>
              <span className="text-xl sm:text-2xl font-black text-[#1DB954]">
                ৳{activePkg.price.toLocaleString('bn-BD')}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleStartOrderFromInPlace(inPlaceSelectedPkg)}
                className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-[#1DB954] hover:bg-emerald-600 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>প্যাকেজটি অর্ডার করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${siteSettings.whatsapp}?text=I%20am%20interested%20in%20${encodeURIComponent(activeInPlaceGig.title)}%20(${activePkg.name})`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 border border-slate-700 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span className="hidden sm:inline">হোয়াটসঅ্যাপ</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // STANDALONE FULL-PAGE VIEW FOR OFFICIAL AGENCY PACKAGES
  if (isStandalonePage) {
    return (
      <div className="w-full min-h-screen bg-white dark:bg-slate-900 font-bengali text-slate-900 dark:text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          
          {/* Top Header Bar - Centered on Mobile, Row on Desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 text-center sm:text-left">
            <div className="space-y-1.5 flex flex-col items-center sm:items-start">
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {t('আমাদের সার্ভিসসমূহ', 'Our Services')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                {t('সরাসরি আমাদের এক্সপার্ট টিম থেকে প্রফেশনাল ওয়েব, মোবাইল অ্যাপ, এআই সফটওয়্যার ও সার্ভিস গ্রহণ করুন।', 'Get professional web, mobile app, AI software, and custom digital services directly from our expert team.')}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs transition cursor-pointer shadow-xs"
                  title={t('পূর্ববর্তী স্থানে ফিরে যান', 'Go back to previous page')}
                >
                  <ArrowLeft className="w-4 h-4 text-[#1DB954]" />
                  <span>{t('ফিরে যান', 'Back')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Grid of Agency Services - All services shown directly on PC & Mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {allPublishedServices.map(renderServiceCard)}
          </div>

        </div>

        {/* IN-PLACE DETAIL MODAL */}
        {renderDetailModal()}

        {/* ORDER CHECKOUT MODAL */}
        <OrderCheckoutModal
          gig={activeGigForOrder}
          isOpen={!!activeGigForOrder}
          onClose={() => setActiveGigForOrder(null)}
          currentUser={currentUser}
          siteSettings={siteSettings}
          setActiveTab={setActiveTab}
          onOrderCompleted={(orderId) => {
            setActiveGigForOrder(null);
            setActiveInPlaceGig(null);
            if (setActiveTab) {
              setActiveTab('marketplace', 'buying');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        />
      </div>
    );
  }

  // HOME PAGE SECTION VIEW - Show official agency packages (4 on PC for 1 row of 4)
  const visibleAgencyServices = allPublishedServices.slice(0, 4);

  return (
    <div className="w-full">
      {/* SECTION 1: Official Agency Packages - হালকা শেড / অফ-হোয়াইট (Soft Light Shade, not full white) */}
      <section className="py-10 sm:py-14 bg-slate-100/90 dark:bg-slate-950 text-slate-900 dark:text-white border-y border-slate-200/70 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-1.5 text-center sm:text-left flex flex-col items-center sm:items-start">
              <h2 className="text-2xl sm:text-3xl font-black font-bengali text-slate-900 dark:text-white leading-tight">
                {t('আমাদের অফিশিয়াল এজেন্সি প্যাকেজসমূহ', 'Our Official Agency Packages')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-bengali">
                {t('PTENit এর গ্যারান্টিযুক্ত সার্ভিস প্যাকেজ।', 'Guaranteed official IT service packages.')}
              </p>
            </div>

            {!isStandalonePage && setActiveTab && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1 text-[#1DB954] hover:text-emerald-600 font-bold text-xs sm:text-sm hover:underline transition-all cursor-pointer font-bengali shrink-0 group"
                >
                  <span>{t('সবগুলো দেখুন →', 'See All →')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Agency Services Grid: Desktop shows 4 in 1 row; Mobile shows 4 cards */}
          <div className="space-y-4">
            {/* Desktop (Hidden on mobile): 1 row of 4 */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-5">
              {visibleAgencyServices.map(renderServiceCard)}
            </div>

            {/* Mobile (Visible only on mobile): 4 items */}
            <div className="grid grid-cols-2 gap-2.5 sm:hidden">
              {visibleAgencyServices.map(renderServiceCard)}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Digital Products Section - একদুম সাদা (Completely Pure White) */}
      <section className="py-10 sm:py-14 bg-white text-slate-900 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DigitalProductsSection setActiveTab={setActiveTab} />
        </div>
      </section>

      {/* SECTION 3: Popular Freelance Gigs Row - হালকা শেড / অফ-হোয়াইট (Soft Light Shade, not full white) */}
      <section className="py-10 sm:py-14 bg-slate-100/90 dark:bg-slate-950 text-slate-900 dark:text-white border-y border-slate-200/70 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-1.5 text-center sm:text-left flex flex-col items-center sm:items-start">
              <h2 className="text-2xl sm:text-3xl font-black font-bengali text-slate-900 dark:text-white leading-tight">
                {t('জনপ্রিয় গিগ ও ডিজিটাল সার্ভিসসমূহ', 'Popular Gigs & Digital Services')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-bengali">
                {t('PTENit ভেরিফায়েড স্পেশালিস্টদের জনপ্রিয় ফ্রিল্যান্সিং গিগস।', 'Popular freelance gigs and services by verified specialists.')}
              </p>
            </div>

            {setActiveTab && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('marketplace', 'All');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1 text-[#1DB954] hover:text-emerald-600 font-bold text-xs sm:text-sm hover:underline transition-all cursor-pointer font-bengali shrink-0 group"
                >
                  <span>{t('সবগুলো দেখুন →', 'See All →')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Gigs Grid: Desktop shows 4 in 1 row; Mobile shows 4 */}
          <div className="space-y-4">
            {/* Desktop (Hidden on mobile): 1 row of 4 */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-5">
              {featuredGigs.map(gig => (
                <GigCard
                  key={gig.id}
                  gig={gig}
                  onClick={() => navigateToGigDetail(gig)}
                  currentUser={currentUser}
                />
              ))}
            </div>

            {/* Mobile (Visible only on mobile): 4 items */}
            <div className="grid grid-cols-2 gap-2.5 sm:hidden">
              {gigs.slice(0, 4).map(gig => (
                <GigCard
                  key={gig.id}
                  gig={gig}
                  onClick={() => navigateToGigDetail(gig)}
                  currentUser={currentUser}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IN-PLACE DETAIL MODAL for Services & Gigs */}
      {renderDetailModal()}

      {/* MODAL 2: Interactive Smart Order Checkout Modal */}
      <OrderCheckoutModal
        gig={activeGigForOrder}
        isOpen={!!activeGigForOrder}
        onClose={() => setActiveGigForOrder(null)}
        currentUser={currentUser}
        siteSettings={siteSettings}
        setActiveTab={setActiveTab}
        onOrderCompleted={(orderId) => {
          setActiveGigForOrder(null);
          setActiveInPlaceGig(null);
          if (setActiveTab) {
            setActiveTab('marketplace', 'buying');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />
    </div>
  );
};

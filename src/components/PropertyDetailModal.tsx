import React, { useState } from 'react';
import { Property } from '../types/index.ts';
import { useRealEstate } from '../context/RealEstateContext.tsx';
import {
  X,
  Heart,
  Share2,
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  BadgeCheck,
  Sparkles,
  MapPin,
  Maximize2,
  FileText,
  Compass,
  Building2,
  Car,
  Layers,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  TrendingDown,
  Info
} from 'lucide-react';
import { calculateEMI, calculateStampDuty } from '../utils/realEstateCalculators.ts';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  onOpenSiteVisit?: (property: Property) => void;
  onOpenEnquiry?: (property: Property) => void;
}

export function PropertyDetailModal({
  property,
  onClose,
  onOpenSiteVisit,
  onOpenEnquiry
}: PropertyDetailModalProps) {
  const {
    toggleWishlist,
    isInWishlist,
    addToComparison,
    comparisonIds,
    scheduleSiteVisit,
    submitEnquiry,
    currentUser,
    addToast
  } = useRealEstate();

  const [activeImage, setActiveImage] = useState<string>(property.featuredImage);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'floorplans' | 'landmarks' | 'pricing'>('overview');
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  // Quick Inline Site Visit booking state
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [visitDate, setVisitDate] = useState('2026-11-20');
  const [visitSlot, setVisitSlot] = useState('11:00 AM - 12:30 PM');
  const [visitType, setVisitType] = useState<'in_person' | 'virtual'>('in_person');

  // Quick Inline Enquiry state
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [enquiryMsg, setEnquiryMsg] = useState(`Hello, I am interested in purchasing ${property.title}. Please provide more documentation and schedule an initial consultation.`);
  const [contactMethod, setContactMethod] = useState<'phone' | 'email' | 'whatsapp'>('phone');

  const isLiked = isInWishlist(property.id);
  const isInCompare = comparisonIds.includes(property.id);

  const emi = calculateEMI(property.price * 0.8, 6.5, 30);
  const stampDuty = calculateStampDuty(property.price, 'luxury_metro', false);

  const timeSlots = [
    '09:30 AM - 11:00 AM',
    '11:00 AM - 12:30 PM',
    '02:00 PM - 03:30 PM',
    '04:00 PM - 05:30 PM'
  ];

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = scheduleSiteVisit({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyImage: property.featuredImage,
      propertyAddress: `${property.address}, ${property.city}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email || 'customer@aurarealestate.com',
      userPhone: currentUser.phone || '+1 (555) 019-2831',
      agentId: property.agent.id,
      agentName: property.agent.name,
      date: visitDate,
      timeSlot: visitSlot,
      visitType,
      notes: `Booked via property detail modal (${visitType})`
    });

    if (result.success) {
      setShowVisitForm(false);
    }
  };

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    submitEnquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyImage: property.featuredImage,
      userId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email || 'client@aurarealestate.com',
      customerPhone: currentUser.phone || '+1 (555) 019-2831',
      message: enquiryMsg,
      preferredContact: contactMethod
    });
    setShowEnquiryForm(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `${property.title} - ${property.tagline}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      addToast('info', 'Link Copied', 'Property link copied to clipboard');
    }
  };

  const handleBrochureDownload = () => {
    addToast('success', 'Architectural Brochure Generated', `Downloading comprehensive portfolio PDF for ${property.title}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-5xl rounded-[36px] bg-white dark:bg-slate-900 shadow-2xl border border-white/60 dark:border-white/10 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-slate-700 dark:text-slate-300">
              ID: {property.id}
            </span>
            {property.isVerified && (
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Listing
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(property.id)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              aria-label="Save to wishlist"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              aria-label="Share property"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => addToComparison(property.id)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                isInCompare
                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {isInCompare ? 'In Comparison' : '+ Compare'}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors ml-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8">
          
          {/* Main Visual Showcase & Gallery */}
          <div className="space-y-3">
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] max-h-[460px] bg-slate-950 group">
              <img
                src={activeImage}
                alt={property.title}
                className="w-full h-full object-cover object-center transition-all duration-500"
              />
              <button
                onClick={() => setIsFullscreenImage(true)}
                className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-md"
                aria-label="View fullscreen image"
                title="Fullscreen Image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              
              <div className="absolute top-4 left-4">
                <span className="text-xs uppercase font-bold tracking-widest px-3 py-1.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                  {property.propertyType} · {property.listingType.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails Strip */}
            {property.galleryImages && property.galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {property.galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImage === img
                        ? 'border-[#4c2fbb] ring-2 ring-purple-300 dark:ring-purple-900 scale-102'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Pricing & Highlights */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {property.title}
              </h1>
              <p className="mt-1 text-sm text-[#4c2fbb] dark:text-purple-400 font-medium">
                {property.tagline}
              </p>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{property.address}, {property.locality}, {property.city}, {property.state}</span>
              </p>
            </div>

            <div className="md:text-right shrink-0">
              <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                {property.listingType === 'rent'
                  ? `$${property.price.toLocaleString()}/mo`
                  : `$${property.price.toLocaleString()}`}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                ${property.pricePerSqFt}/sq.ft · Est. EMI: ${emi.monthlyEMI.toLocaleString()}/mo
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                Last updated {property.lastUpdatedDate}
              </div>
            </div>
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.05]">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bedrooms</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{property.bedrooms} BHK</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.05]">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bathrooms</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{property.bathrooms} Baths</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.05]">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Carpet Area</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{property.carpetAreaSqFt.toLocaleString()} sq.ft</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.05]">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Built-up Area</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{property.areaSqM} m²</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.05]">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Parking</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{property.parkingSpaces} Cars</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.05]">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Possession</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 truncate block mt-1">{property.possessionStatus}</span>
            </div>
          </div>

          {/* Navigation Tabs for In-Depth Detail Sections */}
          <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 relative transition-colors ${
                activeTab === 'overview' ? 'text-slate-950 dark:text-white border-b-2 border-[#4c2fbb]' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Overview & Amenities
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-2 relative transition-colors ${
                activeTab === 'specs' ? 'text-slate-950 dark:text-white border-b-2 border-[#4c2fbb]' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('floorplans')}
              className={`py-2 relative transition-colors ${
                activeTab === 'floorplans' ? 'text-slate-950 dark:text-white border-b-2 border-[#4c2fbb]' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Floor Plans & Architecture
            </button>
            <button
              onClick={() => setActiveTab('landmarks')}
              className={`py-2 relative transition-colors ${
                activeTab === 'landmarks' ? 'text-slate-950 dark:text-white border-b-2 border-[#4c2fbb]' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Neighborhood & Map
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`py-2 relative transition-colors ${
                activeTab === 'pricing' ? 'text-slate-950 dark:text-white border-b-2 border-[#4c2fbb]' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Financials & Stamp Duty
            </button>
          </div>

          {/* Tab 1: Overview & Amenities */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  Architectural Description
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                  {property.description}
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                  Signature Amenities & Features
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 text-xs text-slate-800 dark:text-slate-200 border border-purple-100/50 dark:border-purple-900/30"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#4c2fbb] dark:text-purple-400 shrink-0" />
                      <span className="truncate">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Technical Specifications */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs animate-in fade-in">
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Facing Direction</span>
                <p className="font-semibold text-slate-900 dark:text-white">{property.facingDirection}</p>
              </div>
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Furnishing Status</span>
                <p className="font-semibold text-slate-900 dark:text-white">{property.furnishingStatus}</p>
              </div>
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Property Age</span>
                <p className="font-semibold text-slate-900 dark:text-white">{property.propertyAgeYears === 0 ? 'Brand New / Built 2026' : `${property.propertyAgeYears} Year(s)`}</p>
              </div>
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Total Floors</span>
                <p className="font-semibold text-slate-900 dark:text-white">{property.totalFloors} Levels</p>
              </div>
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Availability Status</span>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase">{property.status.replace('_', ' ')}</p>
              </div>
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold">Ownership Type</span>
                <p className="font-semibold text-slate-900 dark:text-white">Freehold Title Deed</p>
              </div>
            </div>
          )}

          {/* Tab 3: Floor Plans */}
          {activeTab === 'floorplans' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.floorPlans?.map((plan, i) => (
                  <div key={i} className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{plan.title}</h4>
                    <p className="text-xs text-slate-500 font-mono">
                      {plan.bedrooms} Beds · {plan.bathrooms} Baths · {plan.areaSqFt.toLocaleString()} sq.ft
                    </p>
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img src={plan.imageUrl} alt={plan.title} className="w-full h-full object-cover" />
                    </div>
                  </div>
                )) || (
                  <p className="text-xs text-slate-500">Architectural schematics available on verified enquiry.</p>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Neighborhood Landmarks & Map */}
          {activeTab === 'landmarks' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Curated Enclave Location</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Coordinates: {property.coordinates.lat}, {property.coordinates.lng}</p>
                </div>
                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${property.coordinates.lat},${property.coordinates.lng}`, '_blank')}
                  className="px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" /> Google Maps
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.nearbyLandmarks.map((lm, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{lm.name}</span>
                    <span className="font-mono text-purple-600 dark:text-purple-400">{lm.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Pricing & Calculations */}
          {activeTab === 'pricing' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs animate-in fade-in">
              <div className="p-4 rounded-3xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-2">
                <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">Estimated Monthly EMI</span>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  ${emi.monthlyEMI.toLocaleString()}
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Calculated based on 20% down payment ($${(property.price * 0.2).toLocaleString()}) at 6.5% interest over 30 years.
                </p>
              </div>

              <div className="p-4 rounded-3xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.05] space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Stamp Duty & Fees</span>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  ${stampDuty.stampDuty.toLocaleString()}
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Estimated 5-6% regional conveyance tariff + registration escrow.
                </p>
              </div>

              <div className="p-4 rounded-3xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.05] space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Investment Metrics</span>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  ${property.pricePerSqFt}/sq.ft
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Current projected annual capital appreciation in {property.locality}: +8.4%.
                </p>
              </div>
            </div>
          )}

          {/* Assigned Senior Dealer / Broker Profile Card */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={property.agent.avatar}
                alt={property.agent.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-[#4c2fbb]"
              />
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">{property.agent.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{property.agent.agency} · Senior Portfolio Director</p>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-amber-500 font-semibold font-mono">★ {property.agent.rating}</span>
                  <span className="text-slate-400">({property.agent.reviewCount} luxury transactions)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`tel:${property.agent.phone}`}
                className="flex-1 sm:flex-none px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Call Agent
              </a>
              <button
                onClick={() => setShowEnquiryForm(!showEnquiryForm)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-[#2e1d6d] hover:bg-[#3d278f] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Direct Enquiry
              </button>
            </div>
          </div>

          {/* Inline Site Visit Booking Section */}
          {showVisitForm && (
            <div className="p-6 rounded-3xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#4c2fbb] dark:text-purple-400" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Schedule Private Showing</h3>
                </div>
                <button onClick={() => setShowVisitForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleBookVisit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Available Time Slot</label>
                    <select
                      value={visitSlot}
                      onChange={(e) => setVisitSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      {timeSlots.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Showing Format</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setVisitType('in_person')}
                        className={`flex-1 py-2 rounded-xl font-medium transition-colors ${
                          visitType === 'in_person'
                            ? 'bg-[#2e1d6d] text-white'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        In-Person
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisitType('virtual')}
                        className={`flex-1 py-2 rounded-xl font-medium transition-colors ${
                          visitType === 'virtual'
                            ? 'bg-[#2e1d6d] text-white'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Virtual HD
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#2e1d6d] text-white font-semibold shadow-md hover:bg-[#3d278f] transition-colors"
                  >
                    Confirm Showing Reservation
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Inline Enquiry Form */}
          {showEnquiryForm && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#4c2fbb] dark:text-purple-400" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Submit Official Enquiry</h3>
                </div>
                <button onClick={() => setShowEnquiryForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSendEnquiry} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-800 dark:text-slate-200">Message to Broker</label>
                  <textarea
                    rows={3}
                    value={enquiryMsg}
                    onChange={(e) => setEnquiryMsg(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Preferred Contact:</span>
                    {(['phone', 'email', 'whatsapp'] as const).map((m) => (
                      <label key={m} className="flex items-center gap-1 cursor-pointer capitalize">
                        <input
                          type="radio"
                          name="contact"
                          checked={contactMethod === m}
                          onChange={() => setContactMethod(m)}
                        />
                        <span>{m}</span>
                      </label>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#2e1d6d] text-white font-semibold hover:bg-[#3d278f] transition-colors"
                  >
                    Submit Enquiry
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Sticky Action Bar */}
        <div className="p-4 sm:p-6 bg-[#f4f2ee] dark:bg-[#0c101a] border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBrochureDownload}
              className="px-4 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" /> Download Portfolio PDF
            </button>
            <a
              href={`https://wa.me/14805550192?text=Inquiry%20regarding%20${encodeURIComponent(property.title)}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-full border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              WhatsApp Dealer
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowVisitForm(true)}
              className="px-6 py-2.5 rounded-full bg-[#2e1d6d] hover:bg-[#3e278f] text-white text-xs font-semibold shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Schedule Site Showing
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Lightbox Modal */}
      {isFullscreenImage && (
        <div className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 animate-in fade-in">
          <button
            onClick={() => setIsFullscreenImage(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <X className="w-6 h-6" />
          </button>
          <img src={activeImage} alt={property.title} className="max-w-full max-h-[90vh] object-contain rounded-2xl" />
        </div>
      )}
    </div>
  );
}

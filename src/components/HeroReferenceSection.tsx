import React, { useState } from 'react';
import { useRealEstate } from '../context/RealEstateContext.tsx';
import {
  Search,
  Home,
  Grid,
  MessageSquare,
  User,
  Bell,
  Settings,
  Sun,
  Moon,
  ArrowUpRight,
  Heart,
  Bookmark,
  Share2,
  MapPin,
  ChevronDown,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Property } from '../types/index.ts';

export function HeroReferenceSection() {
  const {
    properties,
    filters,
    updateFilter,
    setSelectedProperty,
    activeView,
    setActiveView,
    toggleWishlist,
    isInWishlist,
    isDarkMode,
    toggleTheme,
    unreadNotifCount,
    addToast
  } = useRealEstate();

  // Find the Lunar Oasis Villa as default hero showcase
  const defaultHero = properties.find((p) => p.id === 'prop-lunar-oasis') || properties[0];
  const [activeHeroProp, setActiveHeroProp] = useState<Property>(defaultHero);

  // Dropdown states for the top hero search bar
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  const locations = [
    { label: 'Arizona', city: 'Scottsdale' },
    { label: 'California Coast', city: 'Big Sur' },
    { label: 'Manhattan, NY', city: 'New York' },
    { label: 'Aspen, Colorado', city: 'Aspen' },
    { label: 'Miami, Florida', city: 'Miami' }
  ];

  const propertyTypes = ['Villa', 'Penthouse', 'Mansion', 'Commercial'];
  const maxPriceOptions = [
    { label: '$500 000', value: 500000 },
    { label: '$2 000 000', value: 2000000 },
    { label: '$5 000 000', value: 5000000 },
    { label: '$12 000 000', value: 12000000 }
  ];

  // Cycling hero properties
  const featuredProperties = properties.slice(0, 4);
  const currentIndex = featuredProperties.findIndex((p) => p.id === activeHeroProp.id);

  const nextHero = () => {
    const nextIdx = (currentIndex + 1) % featuredProperties.length;
    setActiveHeroProp(featuredProperties[nextIdx]);
  };

  const prevHero = () => {
    const prevIdx = (currentIndex - 1 + featuredProperties.length) % featuredProperties.length;
    setActiveHeroProp(featuredProperties[prevIdx]);
  };

  const handleOpenDetails = (prop: Property) => {
    setSelectedProperty(prop);
    setActiveView('details');
  };

  const handleShare = (e: React.MouseEvent, prop: Property) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: prop.title,
        text: prop.tagline,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      addToast('info', 'Link Copied', 'Property URL copied to clipboard');
    }
  };

  const isLiked = isInWishlist(activeHeroProp.id);

  return (
    <section className="relative w-full py-6 md:py-10 px-3 sm:px-6 lg:px-8 select-none">
      {/* Outer Scenic Atmosphere Canvas Container matching Reference Image */}
      <div className="relative mx-auto max-w-[1440px] rounded-[36px] sm:rounded-[48px] lg:rounded-[56px] p-3 sm:p-5 lg:p-7 bg-[#ded8cd] dark:bg-[#121622] transition-colors duration-500 shadow-xl overflow-hidden">
        
        {/* Subtle Scenic Mountain Atmosphere Background Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-15 mix-blend-multiply pointer-events-none filter contrast-125"
          style={{
            backgroundImage: `url('/public/assets/aistudio/787f1b2c-d8ae-4f0a-80a5-5aa8634eeefb_d52c333d.jpeg')`
          }}
        />

        {/* Top Outer Vignette Headers matching Reference */}
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-2 text-xs font-semibold tracking-wider text-slate-700/80 dark:text-slate-300/80 uppercase">
          <span className="font-mono text-[11px] sm:text-xs">ORIZON DESIGN · AURA</span>
          <span className="font-mono text-[11px] sm:text-xs">BEST SHOTS // 2026</span>
        </div>

        {/* Main Floating Rounded Hero Container */}
        <div className="relative z-10 mt-2 rounded-[32px] sm:rounded-[44px] lg:rounded-[48px] overflow-hidden min-h-[580px] md:min-h-[640px] lg:min-h-[680px] shadow-2xl border border-white/60 dark:border-white/10 flex flex-col justify-between p-3 sm:p-5 lg:p-6">
          
          {/* Main Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={activeHeroProp.featuredImage}
              alt={activeHeroProp.title}
              className="w-full h-full object-cover object-center transition-all duration-700 ease-out transform scale-100"
            />
            {/* Scrim Overlay for contrast and readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/35" />
          </div>

          {/* Top Floating Search & Filter Pill Bar */}
          <div className="relative z-20 w-full max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 sm:p-2 rounded-full bg-white/75 dark:bg-slate-900/80 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-lg text-slate-800 dark:text-slate-100">
              
              {/* Buy Toggle Button */}
              <button
                onClick={() => {
                  updateFilter('listingType', 'buy');
                  setActiveView('search');
                }}
                className={`flex items-center gap-1.5 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                  filters.listingType === 'buy' || filters.listingType === 'all'
                    ? 'bg-white text-slate-900 shadow-md dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <span>Buy</span>
              </button>

              {/* Filter: Location Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsLocationOpen(!isLocationOpen);
                    setIsTypeOpen(false);
                    setIsPriceOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  <MapPin className="w-3 h-3 text-[#4c2fbb] dark:text-purple-400" />
                  <div className="text-left">
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-medium">Location</span>
                    <span className="font-semibold">{filters.city && filters.city !== 'all' ? filters.city : 'Arizona'}</span>
                  </div>
                  <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
                </button>

                {isLocationOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-30 animate-in fade-in">
                    {locations.map((loc) => (
                      <button
                        key={loc.label}
                        onClick={() => {
                          updateFilter('city', loc.city);
                          setIsLocationOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        {loc.label}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        updateFilter('city', 'all');
                        setIsLocationOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#4c2fbb] dark:text-purple-400 font-semibold hover:bg-purple-50 dark:hover:bg-purple-950/40"
                    >
                      All Locations
                    </button>
                  </div>
                )}
              </div>

              {/* Filter: Property Type Dropdown */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => {
                    setIsTypeOpen(!isTypeOpen);
                    setIsLocationOpen(false);
                    setIsPriceOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  <div className="text-left">
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-medium">Property Type</span>
                    <span className="font-semibold">{filters.propertyType && filters.propertyType !== 'all' ? filters.propertyType : 'Villa'}</span>
                  </div>
                  <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
                </button>

                {isTypeOpen && (
                  <div className="absolute top-full left-0 mt-2 w-40 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-30 animate-in fade-in">
                    {propertyTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          updateFilter('propertyType', type);
                          setIsTypeOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        {type}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        updateFilter('propertyType', 'all');
                        setIsTypeOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#4c2fbb] dark:text-purple-400 font-semibold hover:bg-purple-50 dark:hover:bg-purple-950/40"
                    >
                      All Types
                    </button>
                  </div>
                )}
              </div>

              {/* Filter: Max Price Dropdown */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => {
                    setIsPriceOpen(!isPriceOpen);
                    setIsLocationOpen(false);
                    setIsTypeOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  <div className="text-left">
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-medium">Max Price</span>
                    <span className="font-semibold font-mono">
                      {filters.maxPrice ? `$${(filters.maxPrice / 1000).toLocaleString()}k` : '$5 000 000'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
                </button>

                {isPriceOpen && (
                  <div className="absolute top-full right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-30 animate-in fade-in">
                    {maxPriceOptions.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => {
                          updateFilter('maxPrice', opt.value);
                          setIsPriceOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        {opt.label}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        updateFilter('maxPrice', undefined);
                        setIsPriceOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#4c2fbb] dark:text-purple-400 font-semibold hover:bg-purple-50 dark:hover:bg-purple-950/40"
                    >
                      Any Price
                    </button>
                  </div>
                )}
              </div>

              {/* Rent Toggle Button with Arrow */}
              <button
                onClick={() => {
                  updateFilter('listingType', 'rent');
                  setActiveView('search');
                }}
                className={`flex items-center gap-1.5 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  filters.listingType === 'rent'
                    ? 'bg-white text-slate-900 shadow-md dark:bg-slate-800 dark:text-white'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <span>Rent</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Middle Layout: Floating Left Dock + Grand Architectural Headline */}
          <div className="relative z-20 my-auto flex items-center justify-between w-full pt-4 pb-6">
            
            {/* Floating Left Dock with Circular Icons matching Reference */}
            <div className="hidden sm:flex flex-col items-center gap-3 p-2 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xl text-slate-700 dark:text-slate-200">
              <button
                onClick={() => setActiveView('home')}
                className={`p-2.5 rounded-full transition-colors ${
                  activeView === 'home'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'hover:bg-white/80 dark:hover:bg-slate-800'
                }`}
                title="Home"
                aria-label="Home"
              >
                <Home className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveView('search')}
                className={`p-2.5 rounded-full transition-colors ${
                  activeView === 'search'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'hover:bg-white/80 dark:hover:bg-slate-800'
                }`}
                title="Search Properties"
                aria-label="Search Properties"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveView('compare')}
                className={`p-2.5 rounded-full transition-colors ${
                  activeView === 'compare'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'hover:bg-white/80 dark:hover:bg-slate-800'
                }`}
                title="Compare Properties"
                aria-label="Compare Properties"
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setSelectedProperty(activeHeroProp);
                  setActiveView('details');
                }}
                className="p-2.5 rounded-full hover:bg-white/80 dark:hover:bg-slate-800 transition-colors"
                title="Inquire"
                aria-label="Inquire"
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveView('customer_dash')}
                className="p-1 rounded-full hover:ring-2 hover:ring-[#4c2fbb] transition-all"
                title="User Profile"
                aria-label="User Profile"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar"
                  className="w-7 h-7 rounded-full object-cover"
                />
              </button>

              <button
                onClick={() => addToast('info', 'Notifications Center', `${unreadNotifCount} unread updates`)}
                className="p-2.5 rounded-full hover:bg-white/80 dark:hover:bg-slate-800 transition-colors relative"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4c2fbb]" />
                )}
              </button>

              <button
                onClick={() => setActiveView('calculators')}
                className="p-2.5 rounded-full hover:bg-white/80 dark:hover:bg-slate-800 transition-colors"
                title="Financial Calculators"
                aria-label="Financial Calculators"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full hover:bg-white/80 dark:hover:bg-slate-800 transition-colors"
                title="Toggle Theme"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
            </div>

            {/* Central Architectural Headline & Value Proposition */}
            <div className="flex-1 max-w-2xl mx-auto text-center px-4">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-md text-balance leading-none">
                New Way Of Living
              </h1>
              <p className="mt-2.5 text-xs sm:text-sm text-white/90 max-w-lg mx-auto leading-relaxed drop-shadow font-light line-clamp-2 sm:line-clamp-none">
                Discover extraordinary properties available for purchase or rent. Whether you're seeking a dream home or a unique investment, our curated listings offer the most exceptional properties worldwide.
              </p>

              {/* Prev / Next Showcase Indicators */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={prevHero}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all"
                  aria-label="Previous property"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-white/80 font-mono tracking-widest">
                  0{currentIndex + 1} / 0{featuredProperties.length}
                </span>
                <button
                  onClick={nextHero}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all"
                  aria-label="Next property"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Balancing Empty Space for Left Dock */}
            <div className="hidden sm:block w-12" />
          </div>

          {/* Bottom Row: Floating Bottom-Left Card + Floating Bottom-Right Card */}
          <div className="relative z-20 grid grid-cols-1 md:grid-cols-12 gap-4 items-end pt-4">
            
            {/* Bottom-Left Card: "Find The Perfect Place" */}
            <div className="md:col-span-5 lg:col-span-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/80 dark:border-white/10 p-5 sm:p-6 shadow-2xl transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Find The Perfect Place
              </h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Our platform connects you with extraordinary homes in the most sought-after locations. Start your journey to discovering the perfect match for your lifestyle.
              </p>

              <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                    10K+
                  </span>
                  <div className="flex -space-x-2 overflow-hidden">
                    <img
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      src="/src/assets/images/hero_lunar_villa_1794834327790.jpg"
                      alt="Property thumbnail 1"
                    />
                    <img
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      src="/src/assets/images/villa_coastal_horizon_1794834329508.jpg"
                      alt="Property thumbnail 2"
                    />
                    <img
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      src="/src/assets/images/penthouse_skyline_glass_1794834329656.jpg"
                      alt="Property thumbnail 3"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('search')}
                  className="w-9 h-9 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center hover:scale-105 transition-transform"
                  aria-label="Explore all properties"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Spacer for center */}
            <div className="hidden lg:block lg:col-span-2" />

            {/* Bottom-Right Card: "Lunar Oasis Villa" Frosted Glassmorphism Card */}
            <div className="md:col-span-7 lg:col-span-6 rounded-3xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-2xl border border-white/50 dark:border-white/10 p-5 sm:p-6 shadow-2xl text-white transition-all duration-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow">
                    {activeHeroProp.title}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-white/90 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                    <span>{activeHeroProp.address}, {activeHeroProp.city}</span>
                  </div>
                </div>

                {/* View Details Circular Button */}
                <button
                  onClick={() => handleOpenDetails(activeHeroProp)}
                  className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform shrink-0"
                  aria-label={`View details of ${activeHeroProp.title}`}
                  title="View Property Details"
                >
                  <ArrowUpRight className="w-5 h-5 text-slate-900" />
                </button>
              </div>

              <p className="mt-3 text-xs text-white/80 line-clamp-2 leading-relaxed font-light">
                {activeHeroProp.description}
              </p>

              {/* Specs Row */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/90 font-mono border-t border-white/20 pt-3">
                <span>📐 {activeHeroProp.areaSqM}m²</span>
                <span aria-hidden="true">·</span>
                <span>🌲 {activeHeroProp.yardSqM || 120}m² yard</span>
                <span aria-hidden="true">·</span>
                <span>🛏 {activeHeroProp.bedrooms} bedrooms</span>
                <span aria-hidden="true">·</span>
                <span>🛁 {activeHeroProp.bathrooms} baths</span>
              </div>

              {/* Bottom Action Strip matching Reference Image */}
              <div className="mt-5 flex items-center justify-between pt-2">
                {/* Purple Monogram Emblem Button */}
                <div className="w-11 h-11 rounded-full bg-[#2e1d6d] text-white flex items-center justify-center shadow-md">
                  <span className="font-bold text-lg font-mono">U</span>
                </div>

                {/* Social & Save Buttons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleWishlist(activeHeroProp.id)}
                    className="flex items-center gap-1.5 text-xs text-white/90 hover:text-white transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span className="font-mono">{isLiked ? '4.4K+1' : '4.4K'}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(activeHeroProp.id)}
                    className="flex items-center gap-1.5 text-xs text-white/90 hover:text-white transition-colors"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span className="font-mono">157</span>
                  </button>

                  <button
                    onClick={(e) => handleShare(e, activeHeroProp)}
                    className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors"
                    aria-label="Share property"
                    title="Share Property"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Outer Vignette Footer matching Reference Image */}
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 text-xs font-semibold tracking-wider text-slate-700/80 dark:text-slate-300/80">
          <button
            onClick={() => addToast('info', 'Followed AURA', 'You are now following luxury updates.')}
            className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <span>Like & Follow</span>
            <Heart className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('featured-listings');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-500/40 dark:border-slate-400/40 hover:bg-black/5 dark:hover:bg-white/10 transition-colors font-mono"
          >
            <span>Swipe</span>
            <span className="text-[10px]">»</span>
          </button>
        </div>
      </div>
    </section>
  );
}

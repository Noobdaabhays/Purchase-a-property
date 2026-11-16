import React from 'react';
import { Property } from '../types/index.ts';
import { useRealEstate } from '../context/RealEstateContext.tsx';
import {
  Heart,
  BadgeCheck,
  Sparkles,
  MapPin,
  ArrowUpRight,
  Maximize2,
  CalendarCheck,
  Layers
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  layout?: 'grid' | 'list';
  onScheduleVisit?: (property: Property) => void;
}

export function PropertyCard({ property, layout = 'grid', onScheduleVisit }: PropertyCardProps) {
  const {
    setSelectedProperty,
    setActiveView,
    toggleWishlist,
    isInWishlist,
    addToComparison,
    comparisonIds
  } = useRealEstate();

  const isLiked = isInWishlist(property.id);
  const isInCompare = comparisonIds.includes(property.id);

  const handleOpenDetails = () => {
    setSelectedProperty(property);
    setActiveView('details');
  };

  const formattedPrice = property.listingType === 'rent'
    ? `$${property.price.toLocaleString()}/mo`
    : `$${property.price.toLocaleString()}`;

  if (layout === 'list') {
    return (
      <div className="group rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08] hover:border-purple-300 dark:hover:border-purple-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
        {/* Image Container */}
        <div className="relative md:w-2/5 aspect-[16/10] md:aspect-auto overflow-hidden">
          <img
            src={property.featuredImage}
            alt={property.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {property.isVerified && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-400 backdrop-blur-md">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified
              </span>
            )}
            {property.isFeatured && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#2e1d6d] text-white backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-amber-300" /> Featured
              </span>
            )}
          </div>

          {/* Top-Right Wishlist Button */}
          <button
            onClick={() => toggleWishlist(property.id)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md hover:bg-white text-slate-800 dark:text-white transition-transform active:scale-95 shadow-sm"
            aria-label={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Status Indicator */}
          {property.status !== 'available' && (
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-amber-500/90 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              {property.status.replace('_', ' ')}
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-5 md:p-6 md:w-3/5 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-[#4c2fbb] dark:text-purple-400">
                {property.propertyType} · {property.listingType.toUpperCase()}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                ${property.pricePerSqFt}/sq.ft
              </span>
            </div>

            <h3
              onClick={handleOpenDetails}
              className="mt-1.5 text-xl font-bold text-slate-900 dark:text-white cursor-pointer hover:text-[#4c2fbb] dark:hover:text-purple-400 transition-colors"
            >
              {property.title}
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>{property.address}, {property.city}, {property.state}</span>
            </p>

            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {property.description}
            </p>

            {/* Specs Strip */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 pt-3 font-mono">
              <span>📐 {property.areaSqM} m² ({property.areaSqFt.toLocaleString()} sq.ft)</span>
              <span aria-hidden="true">·</span>
              <span>🛏 {property.bedrooms} Beds</span>
              <span aria-hidden="true">·</span>
              <span>🛁 {property.bathrooms} Baths</span>
              <span aria-hidden="true">·</span>
              <span>🚗 {property.parkingSpaces} Parking</span>
            </div>
          </div>

          {/* Actions Strip */}
          <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                {formattedPrice}
              </span>
              {property.originalPrice && property.originalPrice > property.price && (
                <span className="block text-xs line-through text-slate-400 font-mono">
                  ${property.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => addToComparison(property.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isInCompare
                    ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                    : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Compare side by side"
              >
                {isInCompare ? 'Comparing' : 'Compare'}
              </button>

              {onScheduleVisit && (
                <button
                  onClick={() => onScheduleVisit(property)}
                  className="px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1"
                >
                  <CalendarCheck className="w-3.5 h-3.5" /> Showing
                </button>
              )}

              <button
                onClick={handleOpenDetails}
                className="p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-slate-800 dark:text-white transition-colors"
                aria-label="View property details"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: Grid View
  return (
    <div className="group rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08] hover:border-purple-300 dark:hover:border-purple-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Property Image with Badges */}
      <div className="relative aspect-[16/11] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={property.featuredImage}
          alt={property.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {property.isVerified && (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-400 backdrop-blur-md shadow-xs">
              <BadgeCheck className="w-3 h-3 text-emerald-600" /> Verified
            </span>
          )}
          {property.isFeatured && (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#2e1d6d] text-white backdrop-blur-md shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" /> Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(property.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md hover:bg-white text-slate-800 dark:text-white transition-transform active:scale-90 shadow-sm"
          aria-label={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <span className="text-xl font-bold font-mono tracking-tight text-white drop-shadow">
              {formattedPrice}
            </span>
            {property.originalPrice && property.originalPrice > property.price && (
              <span className="block text-[11px] line-through text-white/70 font-mono drop-shadow">
                ${property.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-white/90 drop-shadow">
            ${property.pricePerSqFt}/sq.ft
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#4c2fbb] dark:text-purple-400">
            {property.propertyType} · {property.possessionStatus}
          </div>

          <h3
            onClick={handleOpenDetails}
            className="mt-1 text-base font-bold text-slate-900 dark:text-white cursor-pointer hover:text-[#4c2fbb] dark:hover:text-purple-400 transition-colors line-clamp-1"
          >
            {property.title}
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
            <span className="truncate">{property.locality}, {property.city}</span>
          </p>

          {/* Specs Grid */}
          <div className="mt-3.5 grid grid-cols-3 gap-2 py-2.5 px-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] text-center border border-black/[0.04] dark:border-white/[0.04] text-xs font-mono">
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-sans">Beds</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{property.bedrooms}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-sans">Baths</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{property.bathrooms}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-sans">Area</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{property.areaSqM}m²</span>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={() => addToComparison(property.id)}
            className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
              isInCompare
                ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isInCompare ? 'Comparing' : '+ Compare'}
          </button>

          <div className="flex items-center gap-1.5">
            {onScheduleVisit && (
              <button
                onClick={() => onScheduleVisit(property)}
                className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1"
              >
                <CalendarCheck className="w-3 h-3 text-[#4c2fbb] dark:text-purple-400" />
                <span>Visit</span>
              </button>
            )}

            <button
              onClick={handleOpenDetails}
              className="p-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
              aria-label="View property details"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

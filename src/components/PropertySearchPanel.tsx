import React, { useState } from 'react';
import { useRealEstate } from '../context/RealEstateContext.tsx';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
  Building,
  Grid,
  List,
  Sparkles,
  BadgeCheck
} from 'lucide-react';
import { PropertyType } from '../types/index.ts';

interface PropertySearchPanelProps {
  layout: 'grid' | 'list';
  setLayout: (layout: 'grid' | 'list') => void;
  resultCount: number;
}

export function PropertySearchPanel({ layout, setLayout, resultCount }: PropertySearchPanelProps) {
  const { filters, setFilters, updateFilter, resetFilters, properties } = useRealEstate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const propertyTypes: PropertyType[] = ['Villa', 'Penthouse', 'Mansion', 'Apartment', 'Commercial', 'Plot'];
  const cities = ['All', 'Scottsdale', 'Big Sur', 'New York', 'Aspen', 'Miami', 'Sedona'];
  const amenitiesList = [
    'Private Infinity Pool',
    'Panoramic Views',
    'Smart Home Automation',
    'Solar Energy Storage',
    'Wine Cellar',
    'Private Security Perimeter',
    'Chef Kitchen',
    'Private Elevator'
  ];

  const handleAmenityToggle = (amenity: string) => {
    const current = filters.amenities || [];
    if (current.includes(amenity)) {
      updateFilter('amenities', current.filter((a) => a !== amenity));
    } else {
      updateFilter('amenities', [...current, amenity]);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Primary Search Bar + Filter Pill Row */}
      <div className="rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search Query Input */}
        <div className="relative w-full md:w-80 lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            placeholder="Search by villa name, city, location..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-transparent focus:border-purple-400 focus:bg-white dark:focus:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => updateFilter('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Buy / Rent Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-black/[0.04] dark:bg-white/[0.05] rounded-2xl text-xs font-semibold">
            <button
              onClick={() => updateFilter('listingType', 'all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filters.listingType === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => updateFilter('listingType', 'buy')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filters.listingType === 'buy'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => updateFilter('listingType', 'rent')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filters.listingType === 'rent'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Rent
            </button>
          </div>

          {/* Property Type Selector */}
          <select
            value={filters.propertyType || 'all'}
            onChange={(e) => updateFilter('propertyType', e.target.value)}
            className="px-3 py-2 rounded-2xl bg-black/[0.04] dark:bg-white/[0.05] border-none text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-purple-400 outline-none cursor-pointer"
          >
            <option value="all">All Property Types</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* City Selector */}
          <select
            value={filters.city || 'all'}
            onChange={(e) => updateFilter('city', e.target.value)}
            className="px-3 py-2 rounded-2xl bg-black/[0.04] dark:bg-white/[0.05] border-none text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-purple-400 outline-none cursor-pointer"
          >
            {cities.map((city) => (
              <option key={city} value={city === 'All' ? 'all' : city}>
                {city === 'All' ? 'All Locations' : city}
              </option>
            ))}
          </select>

          {/* Advanced Filters Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="px-3.5 py-2 rounded-2xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#4c2fbb] dark:text-purple-400" />
            <span>Filters</span>
            {(filters.verifiedOnly || filters.readyToMoveOnly || filters.bedrooms !== 'any' || (filters.amenities && filters.amenities.length > 0)) && (
              <span className="w-2 h-2 rounded-full bg-[#4c2fbb]" />
            )}
          </button>
        </div>

        {/* Layout Switcher & Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Sorting */}
          <select
            value={filters.sortBy || 'recommended'}
            onChange={(e) => updateFilter('sortBy', e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-transparent border border-black/10 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="recommended">Curated / Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="popularity">Most Popular</option>
          </select>

          {/* View toggle (Grid / List) */}
          <div className="flex items-center gap-1 p-1 bg-black/[0.04] dark:bg-white/[0.05] rounded-xl">
            <button
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
              title="Grid View"
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === 'list'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
              title="List View"
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips & Reset Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
        <div className="flex items-center gap-2">
          <span>Found <strong className="text-slate-900 dark:text-white font-mono">{resultCount}</strong> extraordinary residences</span>
          {filters.city && filters.city !== 'all' && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-medium">
              Location: {filters.city}
            </span>
          )}
          {filters.propertyType && filters.propertyType !== 'all' && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-medium">
              Type: {filters.propertyType}
            </span>
          )}
        </div>

        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Advanced Filter Modal / Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#4c2fbb] dark:text-purple-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Advanced Search Filters</h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-5 text-xs">
              {/* Bedrooms (BHK) */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Bedrooms (BHK)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['any', 1, 2, 3, 4, 5].map((bed) => (
                    <button
                      key={bed}
                      type="button"
                      onClick={() => updateFilter('bedrooms', bed as any)}
                      className={`px-4 py-2 rounded-xl font-mono font-medium transition-colors ${
                        filters.bedrooms === bed
                          ? 'bg-[#2e1d6d] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {bed === 'any' ? 'Any BHK' : `${bed}+ Beds`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Min Budget ($)
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice || ''}
                    onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 500000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none font-mono text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Max Budget ($)
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice || ''}
                    onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 8000000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none font-mono text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Verified & Ready To Move Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly || false}
                    onChange={(e) => updateFilter('verifiedOnly', e.target.checked)}
                    className="rounded text-[#4c2fbb] focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Verified Only</span>
                    <span className="text-[10px] text-slate-500">Inspected & deed checked</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.readyToMoveOnly || false}
                    onChange={(e) => updateFilter('readyToMoveOnly', e.target.checked)}
                    className="rounded text-[#4c2fbb] focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Ready to Move</span>
                    <span className="text-[10px] text-slate-500">Immediate possession</span>
                  </div>
                </label>
              </div>

              {/* Amenities Multiselect */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Luxury Amenities
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesList.map((amenity) => {
                    const isChecked = filters.amenities?.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`text-left p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                          isChecked
                            ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 text-purple-800 dark:text-purple-300 font-semibold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{amenity}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-purple-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={resetFilters}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#2e1d6d] hover:bg-[#3f2894] text-white text-xs font-semibold shadow-md transition-colors"
              >
                Apply Filters ({resultCount} Properties)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

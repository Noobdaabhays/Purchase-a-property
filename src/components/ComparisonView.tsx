import React from 'react';
import { useRealEstate } from '../context/RealEstateContext.tsx';
import {
  X,
  Plus,
  BadgeCheck,
  CalendarCheck,
  ArrowUpRight,
  Sparkles,
  Layers,
  RotateCcw
} from 'lucide-react';

export function ComparisonView() {
  const {
    properties,
    comparisonIds,
    removeFromComparison,
    clearComparison,
    setSelectedProperty,
    setActiveView,
    addToast
  } = useRealEstate();

  const comparedProperties = properties.filter((p) => comparisonIds.includes(p.id));

  const handleOpenDetails = (prop: typeof properties[0]) => {
    setSelectedProperty(prop);
    setActiveView('details');
  };

  if (comparedProperties.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#4c2fbb] dark:text-purple-400 mx-auto flex items-center justify-center mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">No Properties in Comparison</h2>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
          Add 2 to 4 properties from the marketplace or listings to compare specifications, prices, square footage, and amenities side by side.
        </p>
        <button
          onClick={() => setActiveView('search')}
          className="mt-6 px-6 py-2.5 rounded-full bg-[#2e1d6d] text-white text-xs font-semibold hover:bg-[#3e278f] transition-colors"
        >
          Explore Properties
        </button>
      </div>
    );
  }

  const comparisonAttributes = [
    { label: 'Price', render: (p: typeof properties[0]) => `$${p.price.toLocaleString()}` },
    { label: 'Listing Type', render: (p: typeof properties[0]) => p.listingType.toUpperCase() },
    { label: 'Property Type', render: (p: typeof properties[0]) => p.propertyType },
    { label: 'Location', render: (p: typeof properties[0]) => `${p.locality}, ${p.city}` },
    { label: 'Bedrooms', render: (p: typeof properties[0]) => `${p.bedrooms} BHK` },
    { label: 'Bathrooms', render: (p: typeof properties[0]) => `${p.bathrooms} Baths` },
    { label: 'Carpet Area', render: (p: typeof properties[0]) => `${p.carpetAreaSqFt.toLocaleString()} sq.ft` },
    { label: 'Built-up Area', render: (p: typeof properties[0]) => `${p.areaSqM} m²` },
    { label: 'Price / Sq.Ft', render: (p: typeof properties[0]) => `$${p.pricePerSqFt}` },
    { label: 'Parking Spaces', render: (p: typeof properties[0]) => `${p.parkingSpaces} Vehicles` },
    { label: 'Furnishing', render: (p: typeof properties[0]) => p.furnishingStatus },
    { label: 'Facing Direction', render: (p: typeof properties[0]) => p.facingDirection },
    { label: 'Possession Status', render: (p: typeof properties[0]) => p.possessionStatus },
    { label: 'Verified Status', render: (p: typeof properties[0]) => p.isVerified ? 'Verified ✓' : 'Unverified' },
    { label: 'Top Amenities', render: (p: typeof properties[0]) => p.amenities.slice(0, 3).join(', ') }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Property Comparison Matrix
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Comparing {comparedProperties.length} of 4 maximum simultaneous properties
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('search')}
            className="px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            + Add Another Property
          </button>
          <button
            onClick={clearComparison}
            className="px-4 py-2 rounded-full border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="p-5 w-48 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-black/[0.01] dark:bg-white/[0.01]">
                Parameter
              </th>
              {comparedProperties.map((prop) => (
                <th key={prop.id} className="p-5 min-w-[240px] align-top">
                  <div className="relative group">
                    <button
                      onClick={() => removeFromComparison(prop.id)}
                      className="absolute -top-2 -right-2 p-1.5 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3">
                      <img src={prop.featuredImage} alt={prop.title} className="w-full h-full object-cover" />
                    </div>

                    <h4
                      onClick={() => handleOpenDetails(prop)}
                      className="font-bold text-sm text-slate-900 dark:text-white hover:text-[#4c2fbb] cursor-pointer line-clamp-1"
                    >
                      {prop.title}
                    </h4>

                    <div className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-1">
                      ${prop.price.toLocaleString()}
                    </div>

                    <button
                      onClick={() => handleOpenDetails(prop)}
                      className="mt-3 w-full py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
                    >
                      <span>Full Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {comparisonAttributes.map((attr) => (
              <tr key={attr.label} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-semibold text-slate-600 dark:text-slate-300 bg-black/[0.01] dark:bg-white/[0.01]">
                  {attr.label}
                </td>
                {comparedProperties.map((prop) => (
                  <td key={prop.id} className="p-4 font-mono text-slate-900 dark:text-slate-100">
                    {attr.render(prop)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

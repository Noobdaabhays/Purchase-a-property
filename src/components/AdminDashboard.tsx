import React, { useState } from 'react';
import { useRealEstate } from '../context/RealEstateContext.tsx';
import {
  Building2,
  Plus,
  Trash2,
  Edit3,
  BadgeCheck,
  Sparkles,
  TrendingUp,
  Users,
  CalendarCheck,
  DollarSign,
  Download,
  CheckCircle2,
  X,
  Search,
  Filter
} from 'lucide-react';
import { Property, PropertyType, ListingType, PropertyStatus } from '../types/index.ts';

export function AdminDashboard() {
  const {
    properties,
    addProperty,
    updateProperty,
    deleteProperty,
    leads,
    siteVisits,
    enquiries,
    addToast
  } = useRealEstate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Stats calculation
  const totalProperties = properties.length;
  const activeProperties = properties.filter((p) => p.status === 'available').length;
  const soldProperties = properties.filter((p) => p.status === 'sold').length;
  const rentedProperties = properties.filter((p) => p.status === 'rented').length;
  const totalVolume = properties.reduce((acc, p) => acc + p.price, 0);

  // Filtered properties
  const filteredListings = properties.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    }
    return true;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Type', 'ListingType', 'Price', 'City', 'Status', 'Bedrooms', 'AreaSqFt'];
    const rows = properties.map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.propertyType,
      p.listingType,
      p.price,
      p.city,
      p.status,
      p.bedrooms,
      p.areaSqFt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aura_properties_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'CSV Exported', 'Full property directory downloaded.');
  };

  // Add / Edit Form State
  const [formData, setFormData] = useState<{
    title: string;
    tagline: string;
    description: string;
    price: number;
    pricePerSqFt: number;
    listingType: ListingType;
    propertyType: PropertyType;
    status: PropertyStatus;
    address: string;
    locality: string;
    city: string;
    state: string;
    country: string;
    areaSqM: number;
    areaSqFt: number;
    carpetAreaSqFt: number;
    builtUpAreaSqFt: number;
    bedrooms: number;
    bathrooms: number;
    parkingSpaces: number;
    facingDirection: Property['facingDirection'];
    furnishingStatus: Property['furnishingStatus'];
    possessionStatus: Property['possessionStatus'];
    propertyAgeYears: number;
    featuredImage: string;
    isFeatured: boolean;
    isVerified: boolean;
  }>({
    title: '',
    tagline: '',
    description: '',
    price: 2500000,
    pricePerSqFt: 550,
    listingType: 'buy',
    propertyType: 'Villa',
    status: 'available',
    address: '',
    locality: '',
    city: 'Scottsdale',
    state: 'Arizona',
    country: 'United States',
    areaSqM: 520,
    areaSqFt: 5600,
    carpetAreaSqFt: 4800,
    builtUpAreaSqFt: 5600,
    bedrooms: 4,
    bathrooms: 4,
    parkingSpaces: 3,
    facingDirection: 'South',
    furnishingStatus: 'Furnished',
    possessionStatus: 'Ready to Move',
    propertyAgeYears: 0,
    featuredImage: '/src/assets/images/hero_lunar_villa_1794834327790.jpg',
    isFeatured: true,
    isVerified: true
  });

  const handleOpenEdit = (prop: Property) => {
    setEditingProperty(prop);
    setFormData({
      title: prop.title,
      tagline: prop.tagline,
      description: prop.description,
      price: prop.price,
      pricePerSqFt: prop.pricePerSqFt,
      listingType: prop.listingType,
      propertyType: prop.propertyType,
      status: prop.status,
      address: prop.address,
      locality: prop.locality,
      city: prop.city,
      state: prop.state,
      country: prop.country,
      areaSqM: prop.areaSqM,
      areaSqFt: prop.areaSqFt,
      carpetAreaSqFt: prop.carpetAreaSqFt,
      builtUpAreaSqFt: prop.builtUpAreaSqFt,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      parkingSpaces: prop.parkingSpaces,
      facingDirection: prop.facingDirection,
      furnishingStatus: prop.furnishingStatus,
      possessionStatus: prop.possessionStatus,
      propertyAgeYears: prop.propertyAgeYears,
      featuredImage: prop.featuredImage,
      isFeatured: prop.isFeatured,
      isVerified: prop.isVerified
    });
    setIsAddModalOpen(true);
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();

    // Duplicate detection check
    const duplicate = properties.find(
      (p) =>
        (!editingProperty || p.id !== editingProperty.id) &&
        p.title.trim().toLowerCase() === formData.title.trim().toLowerCase()
    );
    if (duplicate) {
      addToast('error', 'Duplicate Listing Warning', 'A property with this identical title already exists in the system.');
      return;
    }

    if (editingProperty) {
      updateProperty(editingProperty.id, formData);
      setIsAddModalOpen(false);
      setEditingProperty(null);
    } else {
      addProperty({
        ...formData,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        coordinates: { lat: 33.5, lng: -111.9 },
        nearbyLandmarks: [
          { name: 'City Center Heliport', distance: '10 min drive', type: 'airport' }
        ],
        galleryImages: [formData.featuredImage],
        amenities: ['Private Infinity Pool', 'Smart Home Automation', 'Wine Cellar'],
        isTrending: true,
        agent: {
          id: 'agent-marcus',
          name: 'Marcus Vance',
          email: 'm.vance@aurarealestate.com',
          phone: '+1 (480) 555-0192',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          agency: 'Aura Prime Estates',
          rating: 4.96,
          reviewCount: 48
        }
      });
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Administrator Command Console
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              Admin Access
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global catalog synchronization, lead pipeline monitoring, and property inventory control.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Catalog CSV
          </button>
          <button
            onClick={() => {
              setEditingProperty(null);
              setIsAddModalOpen(true);
            }}
            className="px-5 py-2 rounded-full bg-[#2e1d6d] text-white text-xs font-semibold hover:bg-[#3e278f] flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" /> Add New Property
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Listings</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {totalProperties}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">100% active sync</span>
        </div>

        <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Available</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {activeProperties}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">{Math.round((activeProperties / totalProperties) * 100)}% inventory</span>
        </div>

        <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sold / Rented</span>
          <div className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">
            {soldProperties + rentedProperties}
          </div>
          <span className="text-[11px] text-slate-500">Completed deals</span>
        </div>

        <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total CRM Leads</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {leads.length}
          </div>
          <span className="text-[11px] text-purple-600 font-semibold">{leads.filter((l) => l.priority === 'high').length} High priority</span>
        </div>

        <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Site Visits</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {siteVisits.length}
          </div>
          <span className="text-[11px] text-slate-500">{siteVisits.filter((v) => v.status === 'confirmed').length} Confirmed</span>
        </div>

        <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Catalog Value</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            ${(totalVolume / 1000000).toFixed(1)}M
          </div>
          <span className="text-[11px] text-slate-500">Gross asset volume</span>
        </div>
      </div>

      {/* Property Inventory Management Table */}
      <div className="rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xl overflow-hidden space-y-4 p-5">
        
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search listings by title, ID, city..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border-none outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 border-none outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="under_offer">Under Offer</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>
        </div>

        {/* Listings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-3">Property</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Badges</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredListings.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img src={prop.featuredImage} alt={prop.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block line-clamp-1">{prop.title}</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">ID: {prop.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    ${prop.price.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {prop.propertyType} ({prop.listingType})
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {prop.city}, {prop.state}
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={prop.status}
                      onChange={(e) => updateProperty(prop.id, { status: e.target.value as PropertyStatus })}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-none cursor-pointer"
                    >
                      <option value="available">Available</option>
                      <option value="under_offer">Under Offer</option>
                      <option value="sold">Sold</option>
                      <option value="rented">Rented</option>
                    </select>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateProperty(prop.id, { isVerified: !prop.isVerified })}
                        className={`p-1 rounded-md text-[10px] font-semibold transition-colors ${
                          prop.isVerified
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                        title="Toggle Verified badge"
                      >
                        ✓ Verified
                      </button>
                      <button
                        onClick={() => updateProperty(prop.id, { isFeatured: !prop.isFeatured })}
                        className={`p-1 rounded-md text-[10px] font-semibold transition-colors ${
                          prop.isFeatured
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                        title="Toggle Featured badge"
                      >
                        ★ Featured
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(prop)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Property"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProperty(prop.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        title="Delete Property"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Property Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {editingProperty ? 'Edit Property Listing' : 'Publish New Luxury Residence'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold mb-1">Property Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g. Lunar Oasis Villa"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold mb-1">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    required
                    placeholder="e.g. Futuristic Curvilinear Desert Sanctuary"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Listing Type</label>
                  <select
                    value={formData.listingType}
                    onChange={(e) => setFormData({ ...formData, listingType: e.target.value as ListingType })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="buy">Buy</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Mansion">Mansion</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Bedrooms (BHK)</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Area (sq.ft)</label>
                  <input
                    type="number"
                    value={formData.areaSqFt}
                    onChange={(e) => setFormData({ ...formData, areaSqFt: Number(e.target.value), areaSqM: Math.round(Number(e.target.value) * 0.0929) })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Locality</label>
                  <input
                    type="text"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    placeholder="e.g. Red Mountain Enclave"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    placeholder="e.g. 1874 Forest Haven Rd"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold mb-1">Main Featured Image Path/URL</label>
                  <input
                    type="text"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#2e1d6d] text-white font-semibold hover:bg-[#3e278f] transition-colors"
                >
                  {editingProperty ? 'Update Listing' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

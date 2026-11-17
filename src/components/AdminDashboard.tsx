import React, { useState, useEffect } from 'react';
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
  Filter,
  Upload,
  Image as ImageIcon,
  Database,
  RefreshCw,
  Phone,
  Mail,
  MessageSquare,
  Shield,
  Layers,
  Clock,
  Eye,
  Check,
  Copy,
  ExternalLink,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { Property, PropertyType, ListingType, PropertyStatus, Lead, SiteVisit, Enquiry } from '../types/index.ts';
import {
  uploadPropertyImage,
  seedPropertiesToSupabase,
  checkSupabaseHealth,
  SUPABASE_SQL_SETUP,
  isSupabaseConfigured
} from '../utils/supabase.ts';

type AdminTab = 'overview' | 'properties' | 'enquiries' | 'visits' | 'leads' | 'customers' | 'agents' | 'db_sync';

export function AdminDashboard() {
  const {
    properties,
    addProperty,
    updateProperty,
    deleteProperty,
    leads,
    updateLeadStatus,
    addLeadNote,
    siteVisits,
    cancelSiteVisit,
    enquiries,
    currentUser,
    addToast
  } = useRealEstate();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Storage Image Upload State
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  // CRM Note state inside Admin
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leads[0]?.id || null);
  const [adminNoteText, setAdminNoteText] = useState('');

  // Database Health check state
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);
  const [dbHealth, setDbHealth] = useState<{
    isConfigured: boolean;
    projectUrl: string;
    tables: {
      properties: boolean;
      profiles: boolean;
      enquiries: boolean;
      site_visits: boolean;
      leads: boolean;
    };
    storageReady: boolean;
    error?: string;
  } | null>(null);

  useEffect(() => {
    runHealthCheck();
  }, []);

  const runHealthCheck = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await checkSupabaseHealth();
      setDbHealth(res);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const handleSeedSupabase = async () => {
    setIsSeeding(true);
    try {
      const res = await seedPropertiesToSupabase();
      if (res.count > 0) {
        addToast('success', 'Supabase Populated', `Successfully seeded ${res.count} luxury properties.`);
        await runHealthCheck();
      } else {
        addToast('error', 'Seeding Failed', res.error || 'Ensure SQL migration tables are created in Supabase SQL editor first.');
      }
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setSqlCopied(true);
    addToast('success', 'SQL Copied to Clipboard', 'Paste and run in your Supabase project SQL Editor.');
    setTimeout(() => setSqlCopied(false), 3000);
  };

  // Stats calculation
  const totalProperties = properties.length;
  const activeProperties = properties.filter((p) => p.status === 'available').length;
  const underOfferProperties = properties.filter((p) => p.status === 'under_offer').length;
  const soldProperties = properties.filter((p) => p.status === 'sold').length;
  const rentedProperties = properties.filter((p) => p.status === 'rented').length;
  const totalVolume = properties.reduce((acc, p) => acc + p.price, 0);

  // Filtered properties
  const filteredListings = properties.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
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
    link.setAttribute('download', `aura_properties_catalog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'CSV Exported', 'Full property directory downloaded.');
  };

  // Add / Edit Form State
  const initialFormState = {
    title: '',
    tagline: '',
    description: '',
    price: 2850000,
    pricePerSqFt: 520,
    listingType: 'buy' as ListingType,
    propertyType: 'Villa' as PropertyType,
    status: 'available' as PropertyStatus,
    address: '2400 Mirabel Club Dr',
    locality: 'Desert Mountain Highlands',
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
    facingDirection: 'South' as Property['facingDirection'],
    furnishingStatus: 'Furnished' as Property['furnishingStatus'],
    possessionStatus: 'Ready to Move' as Property['possessionStatus'],
    propertyAgeYears: 1,
    featuredImage: '/src/assets/images/hero_lunar_villa_1794834327790.jpg',
    isFeatured: true,
    isVerified: true
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setEditingProperty(null);
    setFormData(initialFormState);
    setUploadPreview(null);
    setIsAddModalOpen(true);
  };

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
    setUploadPreview(prop.featuredImage);
    setIsAddModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    addToast('info', 'Uploading Image', 'Processing through Supabase Storage...');

    try {
      const res = await uploadPropertyImage(file);
      setFormData((prev) => ({ ...prev, featuredImage: res.url }));
      setUploadPreview(res.url);

      if (res.isCloud) {
        addToast('success', 'Storage Upload Complete', 'Image hosted on Supabase Cloud Storage.');
      } else {
        addToast('success', 'Image Prepared', 'Local file attached to listing.');
      }
    } catch {
      addToast('error', 'Upload Error', 'Failed to process image file.');
    } finally {
      setIsUploadingImage(false);
    }
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
          { name: 'Scottsdale Private Jet Airport', distance: '12 min drive', type: 'airport' }
        ],
        galleryImages: [formData.featuredImage],
        amenities: ['Private Infinity Pool', 'Smart Home Automation', 'Wine Cellar', 'Panoramic Views'],
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

  const handleAddAdminNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !adminNoteText.trim()) return;
    addLeadNote(selectedLeadId, `[Admin Note]: ${adminNoteText.trim()}`);
    setAdminNoteText('');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Administrator Command Console
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              Admin Access
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global catalog synchronization, lead pipeline monitoring, and Supabase cloud operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/purchase-a-property-deployment.zip"
            download="purchase-a-property-deployment.zip"
            className="px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Download complete static InfinityFree build (5.1MB)"
          >
            <Download className="w-3.5 h-3.5" /> Download ZIP
          </a>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors text-slate-800 dark:text-slate-200"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-full bg-[#2e1d6d] text-white text-xs font-semibold hover:bg-[#3e278f] flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Property
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-black/[0.05] dark:border-white/[0.05] scrollbar-none text-xs">
        {[
          { id: 'overview' as AdminTab, label: 'Overview & KPIs', icon: TrendingUp },
          { id: 'properties' as AdminTab, label: `Properties (${properties.length})`, icon: Building2 },
          { id: 'enquiries' as AdminTab, label: `Enquiries (${enquiries.length})`, icon: MessageSquare },
          { id: 'visits' as AdminTab, label: `Site Visits (${siteVisits.length})`, icon: CalendarCheck },
          { id: 'leads' as AdminTab, label: `CRM Leads (${leads.length})`, icon: Briefcase },
          { id: 'customers' as AdminTab, label: 'Customers', icon: Users },
          { id: 'agents' as AdminTab, label: 'Agents', icon: Shield },
          { id: 'db_sync' as AdminTab, label: 'Database & Supabase Sync', icon: Database }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#2e1d6d] text-white shadow-md'
                  : 'bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-black/[0.04] dark:border-white/[0.04]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* KPI Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Listings</span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                {totalProperties}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Catalog synchronized</span>
            </div>

            <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Available</span>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {activeProperties}
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {totalProperties > 0 ? Math.round((activeProperties / totalProperties) * 100) : 0}% active
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sold / Rented</span>
              <div className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">
                {soldProperties + rentedProperties}
              </div>
              <span className="text-[11px] text-slate-500">Completed deals</span>
            </div>

            <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">CRM Leads</span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                {leads.length}
              </div>
              <span className="text-[11px] text-purple-600 font-semibold">
                {leads.filter((l) => l.priority === 'high').length} High priority
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Site Visits</span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                {siteVisits.length}
              </div>
              <span className="text-[11px] text-slate-500">
                {siteVisits.filter((v) => v.status === 'confirmed').length} Confirmed
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Catalog Value</span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                ${(totalVolume / 1000000).toFixed(1)}M
              </div>
              <span className="text-[11px] text-slate-500">Gross asset volume</span>
            </div>
          </div>

          {/* Quick Shortcuts & Database Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4c2fbb]" /> Executive Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <button
                  onClick={handleOpenAdd}
                  className="p-3.5 rounded-2xl bg-[#2e1d6d]/5 dark:bg-white/[0.03] hover:bg-[#2e1d6d]/10 dark:hover:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06] text-left transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#2e1d6d] dark:text-purple-400 mb-1" />
                  <span className="font-bold text-slate-900 dark:text-white block">Add Listing</span>
                  <span className="text-[10px] text-slate-500">With Supabase photo</span>
                </button>

                <button
                  onClick={() => setActiveTab('enquiries')}
                  className="p-3.5 rounded-2xl bg-[#2e1d6d]/5 dark:bg-white/[0.03] hover:bg-[#2e1d6d]/10 dark:hover:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06] text-left transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#2e1d6d] dark:text-purple-400 mb-1" />
                  <span className="font-bold text-slate-900 dark:text-white block">Review Enquiries</span>
                  <span className="text-[10px] text-slate-500">{enquiries.length} customer messages</span>
                </button>

                <button
                  onClick={() => setActiveTab('leads')}
                  className="p-3.5 rounded-2xl bg-[#2e1d6d]/5 dark:bg-white/[0.03] hover:bg-[#2e1d6d]/10 dark:hover:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06] text-left transition-all cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-[#2e1d6d] dark:text-purple-400 mb-1" />
                  <span className="font-bold text-slate-900 dark:text-white block">CRM Pipeline</span>
                  <span className="text-[10px] text-slate-500">{leads.length} active leads</span>
                </button>

                <button
                  onClick={() => setActiveTab('db_sync')}
                  className="p-3.5 rounded-2xl bg-[#2e1d6d]/5 dark:bg-white/[0.03] hover:bg-[#2e1d6d]/10 dark:hover:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06] text-left transition-all cursor-pointer"
                >
                  <Database className="w-4 h-4 text-[#2e1d6d] dark:text-purple-400 mb-1" />
                  <span className="font-bold text-slate-900 dark:text-white block">Cloud DB Sync</span>
                  <span className="text-[10px] text-slate-500">Supabase live monitor</span>
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] p-6 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#4c2fbb]" /> Supabase Status
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Connected
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                {isSupabaseConfigured ? 'ofelgsarcccpecaychkk.supabase.co' : 'Local Standalone Mode'}
              </p>
              <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Storage Bucket:</span>
                  <span className="font-semibold">{dbHealth?.storageReady ? '✓ Active' : 'Fallback Ready'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Auth Gateway:</span>
                  <span className="font-semibold">✓ JWT / RLS Ready</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('db_sync')}
                className="w-full mt-2 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold transition-colors cursor-pointer text-center block"
              >
                Inspect Tables & SQL →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROPERTIES INVENTORY MANAGEMENT */}
      {activeTab === 'properties' && (
        <div className="rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xl overflow-hidden space-y-4 p-5 animate-in fade-in">
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

              <button
                onClick={handleOpenAdd}
                className="px-3 py-2 rounded-xl bg-[#2e1d6d] text-white text-xs font-semibold hover:bg-[#3e278f] flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Property
              </button>
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
                        <img
                          src={prop.featuredImage}
                          alt={prop.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/src/assets/images/hero_lunar_villa_1794834327790.jpg';
                          }}
                        />
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
                          className={`p-1 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
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
                          className={`p-1 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
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
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Property"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProperty(prop.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
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
      )}

      {/* TAB 3: ENQUIRIES MANAGEMENT */}
      {activeTab === 'enquiries' && (
        <div className="rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-sm p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.05] dark:border-white/[0.05]">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Customer Enquiries</h3>
              <p className="text-xs text-slate-500">Live inquiries received from the marketplace.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold font-mono">
              {enquiries.length} Enquiries
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {enquiries.map((enq) => (
              <div key={enq.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{enq.customerName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Inquiry for: <strong className="text-slate-700 dark:text-slate-300">{enq.propertyTitle}</strong>
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-black/[0.02] dark:bg-white/[0.02] p-2.5 rounded-xl max-w-xl">
                    "{enq.message}"
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span>Contact: {enq.preferredContact}</span>
                    <span>•</span>
                    <span>Received: {enq.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${enq.customerPhone}`}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                    title="Call"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${enq.customerEmail}`}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                    title="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://wa.me/${enq.customerPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 transition-colors"
                    title="WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SITE VISITS MANAGEMENT */}
      {activeTab === 'visits' && (
        <div className="rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-sm p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.05] dark:border-white/[0.05]">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Scheduled Site Visits</h3>
              <p className="text-xs text-slate-500">Luxury tours and virtual walkthrough appointments.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-mono">
              {siteVisits.filter((v) => v.status === 'confirmed').length} Confirmed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {siteVisits.map((visit) => (
              <div
                key={visit.id}
                className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.06] space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{visit.propertyTitle}</h4>
                    <p className="text-xs text-slate-500">Client: {visit.userName} ({visit.userPhone})</p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    visit.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {visit.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded-xl bg-white/60 dark:bg-slate-800/60">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-sans">Date</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{visit.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-sans">Time Slot</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{visit.timeSlot}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">Type: {visit.visitType === 'in_person' ? 'In-Person Tour' : 'Virtual'}</span>
                  {visit.status === 'confirmed' && (
                    <button
                      onClick={() => cancelSiteVisit(visit.id)}
                      className="text-rose-600 hover:underline text-[11px] font-semibold cursor-pointer"
                    >
                      Cancel Tour
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CRM LEADS MANAGEMENT */}
      {activeTab === 'leads' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          {/* Left: Leads List */}
          <div className="lg:col-span-5 rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Active Buyer Leads</h3>
              <span className="text-xs font-mono text-purple-600 font-bold">{leads.length} Leads</span>
            </div>

            <div className="space-y-2 max-h-[550px] overflow-y-auto">
              {leads.map((l) => (
                <div
                  key={l.id}
                  onClick={() => setSelectedLeadId(l.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    selectedLeadId === l.id
                      ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800'
                      : 'bg-black/[0.01] dark:bg-white/[0.01] border-slate-200/60 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{l.customerName}</h4>
                      <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{l.propertyTitle}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      {l.priority}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs font-mono">
                    <span className="text-purple-600 font-semibold">{l.status.replace(/_/g, ' ').toUpperCase()}</span>
                    <span className="text-slate-400 text-[10px]">{l.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Selected Lead Detail & Status Control */}
          <div className="lg:col-span-7 rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] p-6 shadow-sm space-y-5">
            {selectedLeadId && leads.find((l) => l.id === selectedLeadId) ? (
              (() => {
                const lead = leads.find((l) => l.id === selectedLeadId)!;
                return (
                  <>
                    <div className="flex items-center justify-between pb-3 border-b border-black/[0.05] dark:border-white/[0.05]">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{lead.customerName}</h3>
                        <p className="text-xs text-slate-500">{lead.email} • {lead.phone}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#2e1d6d] text-white text-xs font-bold uppercase">
                        {lead.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Status Transitions */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Advance Lead Stage
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {(['new', 'contacted', 'interested', 'site_visit_scheduled', 'negotiation', 'deal_closed', 'not_interested'] as Lead['status'][]).map((st) => (
                          <button
                            key={st}
                            onClick={() => updateLeadStatus(lead.id, st)}
                            className={`py-2 px-3 rounded-xl font-semibold transition-all cursor-pointer ${
                              lead.status === st
                                ? 'bg-[#2e1d6d] text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {st.replace(/_/g, ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Broker Notes */}
                    <div className="space-y-3 pt-3">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Broker Notes & Interaction Log</h4>
                      <form onSubmit={handleAddAdminNote} className="flex gap-2">
                        <input
                          type="text"
                          value={adminNoteText}
                          onChange={(e) => setAdminNoteText(e.target.value)}
                          placeholder="Log call outcome, offer update, or client notes..."
                          className="flex-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border-none outline-none text-slate-900 dark:text-white"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-[#2e1d6d] text-white text-xs font-semibold hover:bg-[#3e278f] transition-colors"
                        >
                          Log Note
                        </button>
                      </form>

                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {lead.notes.map((n) => (
                          <div key={n.id} className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] text-xs space-y-1">
                            <div className="flex justify-between text-slate-400 text-[10px]">
                              <span className="font-bold text-slate-700 dark:text-slate-300">{n.author}</span>
                              <span>{n.createdAt}</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-200">{n.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()
            ) : (
              <div className="py-20 text-center text-xs text-slate-400">Select a lead to manage details.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: CUSTOMERS DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-sm p-6 space-y-4 animate-in fade-in">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Verified Customer Registry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                alt="Alexander Cross"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/20"
              />
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white text-sm block">Alexander Cross</span>
                <span className="text-slate-500 block">alexander@aura-client.com</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  VIP Buyer • Tier 1
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
                alt="Elena Rostova"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/20"
              />
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white text-sm block">Elena Rostova</span>
                <span className="text-slate-500 block">elena.r@invest-cap.com</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  High Net Worth Buyer
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: AGENTS DIRECTORY */}
      {activeTab === 'agents' && (
        <div className="rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-sm p-6 space-y-4 animate-in fade-in">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Licensed Broker Network</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] flex items-start gap-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="Marcus Vance"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#4c2fbb]/30"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Marcus Vance</h4>
                  <span className="text-amber-500 font-bold font-mono">★ 4.96</span>
                </div>
                <p className="text-slate-500 text-[11px]">Senior Advisor • Aura Prime Estates</p>
                <p className="text-slate-400 text-[11px] font-mono">m.vance@aurarealestate.com</p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    Scottsdale & Phoenix
                  </span>
                  <span className="text-[10px] text-slate-400">48 Verified Closings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: DATABASE & SUPABASE SYNC MONITOR */}
      {activeTab === 'db_sync' && (
        <div className="rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-sm p-6 space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.05] dark:border-white/[0.05]">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-[#4c2fbb]" /> Supabase Cloud Database & Storage Control
              </h3>
              <p className="text-xs text-slate-500">Live verification of PostgreSQL tables, RLS rules, and storage bucket.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={runHealthCheck}
                disabled={isCheckingHealth}
                className="px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-slate-800 dark:text-slate-200"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingHealth ? 'animate-spin' : ''}`} /> Run Diagnostic
              </button>
              <button
                onClick={handleSeedSupabase}
                disabled={isSeeding}
                className="px-4 py-2 rounded-full bg-[#2e1d6d] hover:bg-[#3d278f] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isSeeding ? 'Seeding...' : 'Seed Catalog to Supabase'}
              </button>
            </div>
          </div>

          {/* Diagnostic Status Table */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {[
              { name: 'properties', ready: dbHealth?.tables.properties },
              { name: 'profiles', ready: dbHealth?.tables.profiles },
              { name: 'enquiries', ready: dbHealth?.tables.enquiries },
              { name: 'site_visits', ready: dbHealth?.tables.site_visits },
              { name: 'leads', ready: dbHealth?.tables.leads },
              { name: 'storage', ready: dbHealth?.storageReady }
            ].map((item) => (
              <div
                key={item.name}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  item.ready
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                    : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
                }`}
              >
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">{item.name}</span>
                <span className={`font-bold font-mono text-xs ${item.ready ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>
                  {item.ready ? '✓ ACTIVE' : '! PENDING'}
                </span>
              </div>
            ))}
          </div>

          {/* Copy SQL Schema Box */}
          <div className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Supabase SQL Migration Script</h4>
                <p className="text-xs text-slate-500">Run this in your Supabase SQL Editor to provision all tables and storage with one click.</p>
              </div>
              <button
                onClick={handleCopySql}
                className="px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {sqlCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{sqlCopied ? 'Copied!' : 'Copy SQL Script'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-48 scrollbar-thin">
              {SUPABASE_SQL_SETUP}
            </pre>
          </div>
        </div>
      )}

      {/* ADD / EDIT PROPERTY MODAL WITH SUPABASE STORAGE IMAGE UPLOAD */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {editingProperty ? 'Edit Property Listing' : 'Publish New Luxury Residence'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        areaSqFt: Number(e.target.value),
                        areaSqM: Math.round(Number(e.target.value) * 0.0929)
                      })
                    }
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

                {/* Real File Upload & Storage Section */}
                <div className="col-span-2 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#4c2fbb]" /> Featured Photography (Supabase Storage)
                    </label>
                    <span className="text-[10px] text-slate-400">JPG, PNG, WebP</span>
                  </div>

                  <div className="flex items-center gap-4">
                    {uploadPreview && (
                      <img
                        src={uploadPreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-xl object-cover ring-2 ring-purple-500/20 shrink-0"
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2e1d6d] hover:bg-[#3d278f] text-white font-semibold cursor-pointer transition-colors text-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingImage ? 'Uploading to Supabase...' : 'Upload Image File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          disabled={isUploadingImage}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={formData.featuredImage}
                        onChange={(e) => {
                          setFormData({ ...formData, featuredImage: e.target.value });
                          setUploadPreview(e.target.value);
                        }}
                        placeholder="Or enter direct image URL"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-800 dark:text-slate-200 border-none outline-none"
                      />
                    </div>
                  </div>
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
                  className="text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#2e1d6d] text-white font-semibold hover:bg-[#3e278f] transition-colors cursor-pointer shadow-md"
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

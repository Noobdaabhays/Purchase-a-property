import React, { useState } from 'react';
import { useRealEstate } from '../context/RealEstateContext.tsx';
import {
  Heart,
  Calendar,
  MessageSquare,
  FileText,
  User,
  Settings,
  Clock,
  MapPin,
  Trash2,
  CalendarCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { PropertyCard } from './PropertyCard.tsx';

export function CustomerDashboard() {
  const {
    currentUser,
    properties,
    wishlistIds,
    toggleWishlist,
    siteVisits,
    cancelSiteVisit,
    rescheduleSiteVisit,
    enquiries,
    setSelectedProperty,
    setActiveView,
    addToast
  } = useRealEstate();

  const [activeTab, setActiveTab] = useState<'overview' | 'wishlist' | 'visits' | 'enquiries' | 'documents' | 'settings'>('overview');

  // Reschedule modal state
  const [rescheduleVisitId, setRescheduleVisitId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('2026-11-22');
  const [newSlot, setNewSlot] = useState('02:00 PM - 03:30 PM');

  const wishlistProperties = properties.filter((p) => wishlistIds.includes(p.id));

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleVisitId) return;
    const res = rescheduleSiteVisit(rescheduleVisitId, newDate, newSlot);
    if (res.success) {
      setRescheduleVisitId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Customer Header Banner */}
      <div className="rounded-[36px] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-18 h-18 rounded-full object-cover ring-4 ring-[#4c2fbb]/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                VIP Client
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentUser.email || 'alexander@aura-client.com'} · Member since Sept 2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('search')}
            className="px-5 py-2.5 rounded-full bg-[#2e1d6d] text-white text-xs font-semibold hover:bg-[#3e278f] transition-colors"
          >
            Explore Market
          </button>
        </div>
      </div>

      {/* Dashboard Sub-navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'wishlist', label: `Saved Wishlist (${wishlistProperties.length})`, icon: Heart },
          { id: 'visits', label: `Scheduled Visits (${siteVisits.length})`, icon: Calendar },
          { id: 'enquiries', label: `My Enquiries (${enquiries.length})`, icon: MessageSquare },
          { id: 'documents', label: 'Document Vault', icon: FileText },
          { id: 'settings', label: 'Account Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveTab('wishlist')}
              className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] hover:border-purple-300 dark:hover:border-purple-800 transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-400">Saved Wishlist</span>
                <Heart className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white mt-3">
                {wishlistProperties.length}
              </div>
              <p className="text-xs text-slate-500 mt-1">Extraordinary properties bookmarked</p>
            </div>

            <div
              onClick={() => setActiveTab('visits')}
              className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] hover:border-purple-300 dark:hover:border-purple-800 transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-400">Site Showings</span>
                <Calendar className="w-5 h-5 text-[#4c2fbb] dark:text-purple-400" />
              </div>
              <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white mt-3">
                {siteVisits.filter((v) => v.status === 'confirmed').length}
              </div>
              <p className="text-xs text-slate-500 mt-1">Confirmed upcoming appointments</p>
            </div>

            <div
              onClick={() => setActiveTab('enquiries')}
              className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] hover:border-purple-300 dark:hover:border-purple-800 transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-400">Active Inquiries</span>
                <MessageSquare className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white mt-3">
                {enquiries.length}
              </div>
              <p className="text-xs text-slate-500 mt-1">Under dealer review & advisory</p>
            </div>
          </div>

          {/* Upcoming Showings Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Private Showings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {siteVisits.slice(0, 2).map((visit) => (
                <div
                  key={visit.id}
                  className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={visit.propertyImage}
                      alt={visit.propertyTitle}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">
                        {visit.visitType === 'in_person' ? 'In-Person Tour' : 'Virtual Tour'}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                        {visit.propertyTitle}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{visit.date} · {visit.timeSlot}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">Agent: {visit.agentName}</p>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {visit.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Saved Luxury Residences ({wishlistProperties.length})
            </h3>
            <span className="text-xs text-slate-500">Real-time availability synced</span>
          </div>

          {wishlistProperties.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
              <Heart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your wishlist is empty</p>
              <button
                onClick={() => setActiveView('search')}
                className="mt-3 px-5 py-2 rounded-full bg-[#2e1d6d] text-white text-xs font-semibold"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Scheduled Visits */}
      {activeTab === 'visits' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Site Showings & Walkthroughs</h3>
          </div>

          <div className="space-y-3">
            {siteVisits.map((visit) => (
              <div
                key={visit.id}
                className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={visit.propertyImage}
                    alt={visit.propertyTitle}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">{visit.propertyTitle}</h4>
                    <p className="text-xs text-slate-500">{visit.propertyAddress}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
                      <span>📅 {visit.date}</span>
                      <span>⏰ {visit.timeSlot}</span>
                      <span>👤 {visit.agentName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
                    visit.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {visit.status}
                  </span>

                  {visit.status !== 'cancelled' && (
                    <>
                      <button
                        onClick={() => {
                          setRescheduleVisitId(visit.id);
                          setNewDate(visit.date);
                        }}
                        className="px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Reschedule
                      </button>

                      <button
                        onClick={() => cancelSiteVisit(visit.id)}
                        className="p-2 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        title="Cancel Showing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: My Enquiries */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Property Inquiries</h3>
          <div className="space-y-3">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{enq.propertyTitle}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Submitted {enq.createdAt} · Preferred Contact: {enq.preferredContact}</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {enq.status}
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 bg-black/[0.02] dark:bg-white/[0.02] p-3 rounded-2xl">
                  "{enq.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Document Vault */}
      {activeTab === 'documents' && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Secured Real Estate Document Vault</h3>
          <p className="text-xs text-slate-500">Verified deeds, compliance certificates, and escrow files.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: 'Title Deed & Ownership Cert', file: 'Deed_LunarOasis_2026.pdf', date: 'Nov 10, 2026' },
              { title: 'Architectural Blueprint Package', file: 'Blueprints_HorizonCliff.dwg', date: 'Oct 28, 2026' },
              { title: 'Environmental & Zoning Audit', file: 'LEED_Platinum_Certification.pdf', date: 'Oct 15, 2026' }
            ].map((doc, idx) => (
              <div key={idx} className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                <FileText className="w-6 h-6 text-[#4c2fbb] dark:text-purple-400" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{doc.title}</h4>
                <p className="text-xs text-slate-500 font-mono">{doc.file}</p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{doc.date}</span>
                  <button
                    onClick={() => addToast('info', 'Secure Document', `Opening verified copy of ${doc.file}`)}
                    className="text-[#4c2fbb] dark:text-purple-400 font-semibold hover:underline"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && (
        <div className="max-w-xl space-y-4 animate-in fade-in">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account Settings & Notifications</h3>
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Full Legal Name</label>
              <input
                type="text"
                defaultValue={currentUser.name}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email Address</label>
              <input
                type="email"
                defaultValue={currentUser.email}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone Number</label>
              <input
                type="tel"
                defaultValue={currentUser.phone || '+1 (415) 555-7821'}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none text-slate-900 dark:text-white"
              />
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => addToast('success', 'Preferences Updated')}
                className="px-6 py-2 rounded-full bg-[#2e1d6d] text-white font-semibold"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleVisitId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Reschedule Showing</h3>
            <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">New Time Slot</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white"
                >
                  <option value="09:30 AM - 11:00 AM">09:30 AM - 11:00 AM</option>
                  <option value="11:00 AM - 12:30 PM">11:00 AM - 12:30 PM</option>
                  <option value="02:00 PM - 03:30 PM">02:00 PM - 03:30 PM</option>
                  <option value="04:00 PM - 05:30 PM">04:00 PM - 05:30 PM</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleVisitId(null)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#2e1d6d] text-white font-semibold"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

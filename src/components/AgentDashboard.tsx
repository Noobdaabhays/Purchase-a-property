import React, { useState } from 'react';
import { useRealEstate } from '../context/RealEstateContext.tsx';
import {
  Briefcase,
  Users,
  Calendar,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Award,
  Filter
} from 'lucide-react';
import { Lead } from '../types/index.ts';

export function AgentDashboard() {
  const {
    currentUser,
    leads,
    updateLeadStatus,
    addLeadNote,
    siteVisits,
    addToast
  } = useRealEstate();

  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] || null);
  const [noteContent, setNoteContent] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const leadStatuses: Lead['status'][] = [
    'new',
    'contacted',
    'interested',
    'site_visit_scheduled',
    'site_visit_completed',
    'negotiation',
    'booking_initiated',
    'deal_closed',
    'not_interested'
  ];

  const agentLeads = leads.filter((l) => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    return true;
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !noteContent.trim()) return;
    addLeadNote(selectedLead.id, noteContent.trim());
    setNoteContent('');
  };

  const activeVisitsCount = siteVisits.filter((v) => v.status === 'confirmed').length;
  const closedDealsCount = leads.filter((l) => l.status === 'deal_closed').length;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Agent Header Banner */}
      <div className="rounded-[36px] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-[#4c2fbb]/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                Senior Real Estate Advisor
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Aura Prime Estates · 4.96 Rating · Assigned to Scottsdale & Coastal luxury corridors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Performance</span>
            <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">92% Response Rate</span>
          </div>
        </div>
      </div>

      {/* Agent Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Pipeline Leads</span>
          <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {leads.length}
          </div>
          <span className="text-xs text-purple-600 font-semibold">{leads.filter((l) => l.status === 'negotiation').length} in active negotiation</span>
        </div>

        <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Site Showings This Month</span>
          <div className="text-3xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">
            {activeVisitsCount}
          </div>
          <span className="text-xs text-slate-500">Scheduled luxury appointments</span>
        </div>

        <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Closed Transactions</span>
          <div className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {closedDealsCount + 3}
          </div>
          <span className="text-xs text-slate-500">$21.4M total deal volume</span>
        </div>

        <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Avg Closing Cycle</span>
          <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            18 Days
          </div>
          <span className="text-xs text-slate-500">From first inquiry to closing</span>
        </div>
      </div>

      {/* CRM Pipeline & Detail Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lead List with Filter */}
        <div className="lg:col-span-5 rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Active Buyer Leads</h3>
              <p className="text-xs text-slate-500">{agentLeads.length} leads in workflow</p>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 border-none outline-none cursor-pointer"
            >
              <option value="all">All Stages</option>
              {leadStatuses.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto">
            {agentLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  selectedLead?.id === lead.id
                    ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 shadow-sm'
                    : 'bg-black/[0.01] dark:bg-white/[0.01] border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{lead.customerName}</h4>
                    <span className="text-xs text-slate-500 line-clamp-1">{lead.propertyTitle || 'General Luxury Portfolio'}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    lead.priority === 'high'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {lead.priority}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs font-mono">
                  <span className="text-[11px] font-semibold text-[#4c2fbb] dark:text-purple-400">
                    {lead.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Follow-up: {lead.followUpDate || 'Today'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Lead Details & CRM Activity Log */}
        <div className="lg:col-span-7 rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] p-6 shadow-sm space-y-6">
          {selectedLead ? (
            <>
              {/* Lead Top Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedLead.customerName}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>Source: {selectedLead.leadSource}</span>
                    <span aria-hidden="true">·</span>
                    <span>Created: {selectedLead.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
                    title="Call Buyer"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full border border-emerald-300 dark:border-emerald-800 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                    title="WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Status Pipeline Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Deal Progression Stage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {leadStatuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => updateLeadStatus(selectedLead.id, st)}
                      className={`py-2 px-3 rounded-xl text-left font-medium transition-colors ${
                        selectedLead.status === st
                          ? 'bg-[#2e1d6d] text-white shadow-xs font-semibold'
                          : 'bg-black/[0.02] dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lead Information Card */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                  <span className="font-semibold text-slate-900 dark:text-white truncate block">{selectedLead.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedLead.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Property</span>
                  <span className="font-semibold text-slate-900 dark:text-white truncate block">{selectedLead.propertyTitle || 'N/A'}</span>
                </div>
              </div>

              {/* CRM Internal Notes & History */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Broker Notes & Interaction Log</h4>
                
                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Log client call, preference, or offer update..."
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#2e1d6d] text-white text-xs font-semibold hover:bg-[#3e278f] flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> Log
                  </button>
                </form>

                {/* Notes List */}
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {selectedLead.notes.map((n) => (
                    <div key={n.id} className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{n.author}</span>
                        <span>{n.createdAt}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-200">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-xs text-slate-400">
              Select a lead from the left to view timeline and actions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

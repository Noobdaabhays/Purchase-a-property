import React from 'react';
import { useRealEstate } from '../context/RealEstateContext.tsx';
import {
  ShieldCheck,
  Award,
  KeyRound,
  FileCheck2,
  Sparkles,
  ArrowUpRight,
  Star,
  Quote,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Building,
  Globe
} from 'lucide-react';
import { PropertyCard } from './PropertyCard.tsx';

export function HomeSections() {
  const {
    properties,
    setSelectedProperty,
    setActiveView,
    addToast
  } = useRealEstate();

  const featured = properties.filter((p) => p.isFeatured).slice(0, 3);
  const trending = properties.filter((p) => p.isTrending).slice(0, 3);

  const testimonials = [
    {
      name: 'Victoria Vance-Sloan',
      role: 'Family Office Principal',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      quote: 'AURA acquired our Scottsdale desert sanctuary off-market in 14 days with zero friction. Their private concierge showings and verified title escrow represent the gold standard.',
      property: 'Acquired Lunar Oasis Villa ($3.5M)'
    },
    {
      name: 'Dr. Henrik Lindqvist',
      role: 'Biotech Founder',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      quote: 'The level of architectural discernment on this platform is unmatched. From cantilevered coastal retreats to Manhattan duplex penthouses, every residence is genuine art.',
      property: 'Acquired Horizon Cliff Sanctuary ($6.8M)'
    }
  ];

  const soldProperties = [
    {
      title: 'Mirador Mountain Pavilion',
      location: 'Sedona, Arizona',
      price: '$5,200,000',
      date: 'Sold Nov 2026',
      image: '/src/assets/images/hero_lunar_villa_1794834327790.jpg'
    },
    {
      title: 'The Bel Air Horizon Compound',
      location: 'Los Angeles, California',
      price: '$14,800,000',
      date: 'Sold Oct 2026',
      image: '/src/assets/images/villa_coastal_horizon_1794834329508.jpg'
    },
    {
      title: 'The Hudson Glass Tower Suite',
      location: 'Tribeca, New York',
      price: '$9,400,000',
      date: 'Sold Oct 2026',
      image: '/src/assets/images/penthouse_skyline_glass_1794834329656.jpg'
    }
  ];

  return (
    <div className="space-y-20 py-12">
      {/* Featured Properties Section */}
      <section id="featured-listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#4c2fbb] dark:text-purple-400">
              <Sparkles className="w-3.5 h-3.5" /> Curated Collection
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Featured Architectural Masterpieces
            </h2>
          </div>
          <button
            onClick={() => setActiveView('search')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-[#4c2fbb] dark:hover:text-purple-400 transition-colors"
          >
            <span>View All Curated Listings</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* Why Choose Us & Escrow Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[40px] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4c2fbb] dark:text-purple-400">
              Private Dealer Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Why Discerning Collectors Choose AURA
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed">
              Every property on AURA undergoes exhaustive on-site verification, physical structural audits, and legal title deed inspection prior to inclusion in our portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2e1d6d] text-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">100% Verified Title Deeds</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Direct legal title audit and ownership provenance. Zero unverified listings or ghost inventory.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2e1d6d] text-white flex items-center justify-center shadow-sm">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">White-Glove Private Showings</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Chauffeured in-person walkthroughs or encrypted 4K live virtual walkthroughs directly with senior portfolio dealers.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2e1d6d] text-white flex items-center justify-center shadow-sm">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Institutional Escrow Protocols</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Enquiries and purchase transactions proceed through secure multi-signature escrow with full regulatory compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Sold Luxury Transactions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#4c2fbb] dark:text-purple-400">
              Track Record
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Recently Closed Private Transactions
            </h2>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            $48.2M transacted in Q3/Q4 2026
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {soldProperties.map((item, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08] overflow-hidden group shadow-xs hover:shadow-xl transition-all"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  {item.date}
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.location}</p>
                </div>
                <div className="text-right font-mono font-bold text-sm text-slate-900 dark:text-white">
                  {item.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[40px] bg-gradient-to-br from-[#121622] to-[#1c2236] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-xl mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-300">Client Perspectives</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
              Refined Living Without Compromise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
                <Quote className="w-8 h-8 text-purple-400 opacity-60" />
                <p className="text-sm sm:text-base text-white/90 font-light leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-400" />
                  <div>
                    <h4 className="font-bold text-sm text-white">{t.name}</h4>
                    <p className="text-xs text-white/60">{t.role}</p>
                    <span className="text-[11px] text-purple-300 font-mono mt-0.5 block">{t.property}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Real Estate Footer */}
      <footer className="border-t border-black/[0.08] dark:border-white/[0.08] pt-16 pb-12 bg-[#ded8cd]/40 dark:bg-[#080b12] text-slate-700 dark:text-slate-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Col 1: Brand */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2e1d6d] to-[#4c2fbb] flex items-center justify-center text-white font-bold text-base">
                  A
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">AURA</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-light">
                Premier futuristic real estate marketplace & private property brokerage. Discover extraordinary residences, modern penthouses, and bespoke architectural sanctuaries worldwide.
              </p>
              <div className="text-[11px] font-mono text-slate-400">
                Operating in Scottsdale · New York · Big Sur · Aspen · Miami · Tokyo
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Residences</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                <li><button onClick={() => setActiveView('search')} className="hover:text-slate-900 dark:hover:text-white">Luxury Villas</button></li>
                <li><button onClick={() => setActiveView('search')} className="hover:text-slate-900 dark:hover:text-white">Sky Penthouses</button></li>
                <li><button onClick={() => setActiveView('search')} className="hover:text-slate-900 dark:hover:text-white">Modern Mansions</button></li>
                <li><button onClick={() => setActiveView('search')} className="hover:text-slate-900 dark:hover:text-white">Commercial Suites</button></li>
              </ul>
            </div>

            {/* Col 3: Portals */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Management Portals</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                <li><button onClick={() => setActiveView('customer_dash')} className="hover:text-slate-900 dark:hover:text-white">Customer VIP Portal</button></li>
                <li><button onClick={() => setActiveView('agent_dash')} className="hover:text-slate-900 dark:hover:text-white">Broker CRM Dashboard</button></li>
                <li><button onClick={() => setActiveView('admin_dash')} className="hover:text-slate-900 dark:hover:text-white">Admin Management Console</button></li>
                <li><button onClick={() => setActiveView('calculators')} className="hover:text-slate-900 dark:hover:text-white">Financial & EMI Engine</button></li>
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Private Gazette</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Receive unlisted off-market private offerings directly into your confidential inbox.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addToast('success', 'Subscribed to Gazette', 'Confidential property briefs will be dispatched monthly.');
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  required
                  placeholder="name@familyoffice.com"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2e1d6d] text-white font-semibold hover:bg-[#3e278f] shrink-0"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© 2026 AURA Real Estate Global Inc. All rights reserved. Equal Housing Opportunity.</p>
            <div className="flex items-center gap-6">
              <span className="hover:underline cursor-pointer">Privacy Charter</span>
              <span className="hover:underline cursor-pointer">Escrow Terms</span>
              <span className="hover:underline cursor-pointer">Zoning Compliance</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useRealEstate } from '../context/RealEstateContext.tsx';
import {
  Search,
  Building,
  Home,
  Calculator,
  Shield,
  Briefcase,
  Layers,
  Moon,
  Sun,
  X,
  ArrowRight
} from 'lucide-react';

export function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    properties,
    setSelectedProperty,
    setActiveView,
    toggleTheme,
    isDarkMode,
    switchUserRole
  } = useRealEstate();

  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const filteredProperties = query.trim() === ''
    ? properties.slice(0, 4)
    : properties.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.city.toLowerCase().includes(query.toLowerCase()) ||
          p.propertyType.toLowerCase().includes(query.toLowerCase())
      );

  const actions = [
    {
      title: 'Explore All Properties',
      category: 'Navigation',
      icon: Search,
      run: () => setActiveView('search')
    },
    {
      title: 'Open Property Comparison Matrix',
      category: 'Tools',
      icon: Layers,
      run: () => setActiveView('compare')
    },
    {
      title: 'Mortgage EMI & Stamp Duty Calculators',
      category: 'Finance',
      icon: Calculator,
      run: () => setActiveView('calculators')
    },
    {
      title: 'Administrator Console',
      category: 'Management',
      icon: Shield,
      run: () => {
        switchUserRole('admin');
        setActiveView('admin_dash');
      }
    },
    {
      title: 'Agent CRM Pipeline',
      category: 'Management',
      icon: Briefcase,
      run: () => {
        switchUserRole('agent');
        setActiveView('agent_dash');
      }
    },
    {
      title: `Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`,
      category: 'System',
      icon: isDarkMode ? Sun : Moon,
      run: () => toggleTheme()
    }
  ];

  const filteredActions = query.trim() === ''
    ? actions
    : actions.filter((a) => a.title.toLowerCase().includes(query.toLowerCase()));

  const handleSelectProperty = (prop: typeof properties[0]) => {
    setSelectedProperty(prop);
    setActiveView('details');
    setIsCommandPaletteOpen(false);
  };

  const handleSelectAction = (action: typeof actions[0]) => {
    action.run();
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-white/60 dark:border-white/10 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a property, city, tool or command (e.g. 'Lunar', 'Admin')..."
            className="w-full text-sm bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Properties match */}
          {filteredProperties.length > 0 && (
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pb-1.5">
                Residences & Estates
              </span>
              <div className="space-y-1">
                {filteredProperties.map((prop) => (
                  <div
                    key={prop.id}
                    onClick={() => handleSelectProperty(prop)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={prop.featuredImage} alt={prop.title} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{prop.title}</span>
                        <span className="text-[11px] text-slate-500">{prop.locality}, {prop.city} · ${prop.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {filteredActions.length > 0 && (
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pb-1.5">
                Navigation & Operations
              </span>
              <div className="space-y-1">
                {filteredActions.map((act) => {
                  const Icon = act.icon;
                  return (
                    <div
                      key={act.title}
                      onClick={() => handleSelectAction(act)}
                      className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.05] text-[#4c2fbb] dark:text-purple-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">{act.title}</span>
                          <span className="text-[10px] text-slate-400">{act.category}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Select ↵</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Navigate with mouse or keyboard</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}

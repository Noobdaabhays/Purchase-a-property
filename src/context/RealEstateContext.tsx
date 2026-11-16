import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Property,
  PropertyFilters,
  User,
  UserRole,
  SiteVisit,
  Enquiry,
  Lead,
  NotificationItem
} from '../types/index.ts';
import {
  INITIAL_PROPERTIES,
  INITIAL_LEADS,
  INITIAL_SITE_VISITS,
  INITIAL_ENQUIRIES,
  DEMO_USERS,
  INITIAL_NOTIFICATIONS
} from '../data/initialData.ts';
import { filterProperties, checkSiteVisitConflict } from '../utils/realEstateCalculators.ts';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface RealEstateContextType {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Auth & Roles
  currentUser: User;
  switchUserRole: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authMode: 'login' | 'register';
  loginUser: (email: string, role?: UserRole) => void;
  logoutUser: () => void;

  // Properties & Search
  properties: Property[];
  filters: PropertyFilters;
  setFilters: React.Dispatch<React.SetStateAction<PropertyFilters>>;
  updateFilter: <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => void;
  resetFilters: () => void;
  filteredProperties: Property[];
  selectedProperty: Property | null;
  setSelectedProperty: (prop: Property | null) => void;
  activeView: 'home' | 'search' | 'details' | 'compare' | 'customer_dash' | 'admin_dash' | 'agent_dash' | 'calculators';
  setActiveView: (view: 'home' | 'search' | 'details' | 'compare' | 'customer_dash' | 'admin_dash' | 'agent_dash' | 'calculators') => void;

  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (propertyId: string) => void;
  isInWishlist: (propertyId: string) => boolean;

  // Comparison
  comparisonIds: string[];
  addToComparison: (propertyId: string) => boolean;
  removeFromComparison: (propertyId: string) => void;
  clearComparison: () => void;

  // Site Visits
  siteVisits: SiteVisit[];
  scheduleSiteVisit: (data: Omit<SiteVisit, 'id' | 'createdAt' | 'status'>) => { success: boolean; error?: string };
  cancelSiteVisit: (visitId: string) => void;
  rescheduleSiteVisit: (visitId: string, newDate: string, newTimeSlot: string) => { success: boolean; error?: string };

  // Enquiries
  enquiries: Enquiry[];
  submitEnquiry: (data: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => void;

  // Leads & CRM (Agent / Admin)
  leads: Lead[];
  updateLeadStatus: (leadId: string, status: Lead['status']) => void;
  addLeadNote: (leadId: string, content: string) => void;
  assignLeadAgent: (leadId: string, agentId: string, agentName: string) => void;

  // Admin Property Management
  addProperty: (propertyData: Omit<Property, 'id' | 'listedDate' | 'lastUpdatedDate' | 'viewCount' | 'likesCount' | 'savesCount' | 'priceHistory'>) => void;
  updateProperty: (propertyId: string, updates: Partial<Property>) => void;
  deleteProperty: (propertyId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotifCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Command Palette
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const RealEstateContext = createContext<RealEstateContextType | undefined>(undefined);

export function RealEstateProvider({ children }: { children: ReactNode }) {
  // Theme state: default to dark or detect system preference
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('aura_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('aura_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Auth & Roles
  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('aura_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch {
          // fallback
        }
      }
    }
    return DEMO_USERS[0]; // Alexander Cross (Customer)
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginUser = (email: string, role: UserRole = 'customer') => {
    const matched = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const userToSet: User = matched || {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(userToSet);
    localStorage.setItem('aura_user', JSON.stringify(userToSet));
    addToast('success', `Signed in as ${userToSet.name}`, `Role: ${userToSet.role.toUpperCase()}`);
    closeAuthModal();
  };

  const logoutUser = () => {
    const guest: User = {
      id: 'guest',
      name: 'Guest Explorer',
      email: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(guest);
    localStorage.removeItem('aura_user');
    addToast('info', 'Logged out successfully');
  };

  const switchUserRole = (role: UserRole) => {
    const demoForRole = DEMO_USERS.find((u) => u.role === role);
    if (demoForRole) {
      setCurrentUser(demoForRole);
      localStorage.setItem('aura_user', JSON.stringify(demoForRole));
      addToast('info', `Switched mode to ${role.toUpperCase()}`, `Active user: ${demoForRole.name}`);
    } else {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
      localStorage.setItem('aura_user', JSON.stringify(updated));
      addToast('info', `Active role changed to ${role.toUpperCase()}`);
    }
  };

  // Properties State
  const [properties, setProperties] = useState<Property[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura_properties');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_PROPERTIES;
  });

  useEffect(() => {
    localStorage.setItem('aura_properties', JSON.stringify(properties));
  }, [properties]);

  // Active View and Selected Property
  const [activeView, setActiveView] = useState<'home' | 'search' | 'details' | 'compare' | 'customer_dash' | 'admin_dash' | 'agent_dash' | 'calculators'>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(INITIAL_PROPERTIES[0]);

  // Filters State
  const [filters, setFilters] = useState<PropertyFilters>({
    listingType: 'all',
    searchQuery: '',
    propertyType: 'all',
    city: 'all',
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: 'any',
    minAreaSqFt: undefined,
    maxAreaSqFt: undefined,
    readyToMoveOnly: false,
    verifiedOnly: false,
    featuredOnly: false,
    furnishing: 'all',
    amenities: [],
    sortBy: 'recommended'
  });

  const updateFilter = <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      listingType: 'all',
      searchQuery: '',
      propertyType: 'all',
      city: 'all',
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: 'any',
      minAreaSqFt: undefined,
      maxAreaSqFt: undefined,
      readyToMoveOnly: false,
      verifiedOnly: false,
      featuredOnly: false,
      furnishing: 'all',
      amenities: [],
      sortBy: 'recommended'
    });
    addToast('info', 'Filters reset to default');
  };

  // Filtered properties
  const filteredProperties = React.useMemo(() => {
    let result = filterProperties(properties, filters);

    // Apply sorting
    if (filters.sortBy === 'price_asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'newest') {
      result = [...result].sort((a, b) => new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime());
    } else if (filters.sortBy === 'popularity') {
      result = [...result].sort((a, b) => (b.likesCount + b.savesCount) - (a.likesCount + a.savesCount));
    }

    return result;
  }, [properties, filters]);

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura_wishlist');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return ['prop-lunar-oasis', 'prop-aurelia-penthouse'];
  });

  useEffect(() => {
    localStorage.setItem('aura_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const toggleWishlist = (propertyId: string) => {
    const exists = wishlistIds.includes(propertyId);
    if (exists) {
      setWishlistIds((prev) => prev.filter((id) => id !== propertyId));
      addToast('info', 'Removed from Wishlist');
    } else {
      setWishlistIds((prev) => [...prev, propertyId]);
      addToast('success', 'Saved to Wishlist');
    }
  };

  const isInWishlist = (propertyId: string) => wishlistIds.includes(propertyId);

  // Comparison State
  const [comparisonIds, setComparisonIds] = useState<string[]>(['prop-lunar-oasis', 'prop-horizon-cliff']);

  const addToComparison = (propertyId: string): boolean => {
    if (comparisonIds.includes(propertyId)) {
      addToast('info', 'Property is already in comparison');
      return true;
    }
    if (comparisonIds.length >= 4) {
      addToast('error', 'Comparison limit reached', 'You can compare up to 4 properties simultaneously.');
      return false;
    }
    setComparisonIds((prev) => [...prev, propertyId]);
    addToast('success', 'Added to comparison matrix');
    return true;
  };

  const removeFromComparison = (propertyId: string) => {
    setComparisonIds((prev) => prev.filter((id) => id !== propertyId));
    addToast('info', 'Removed from comparison');
  };

  const clearComparison = () => {
    setComparisonIds([]);
    addToast('info', 'Comparison cleared');
  };

  // Site Visits State
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura_site_visits');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return INITIAL_SITE_VISITS;
  });

  useEffect(() => {
    localStorage.setItem('aura_site_visits', JSON.stringify(siteVisits));
  }, [siteVisits]);

  const scheduleSiteVisit = (data: Omit<SiteVisit, 'id' | 'createdAt' | 'status'>) => {
    // Conflict check
    const hasConflict = checkSiteVisitConflict(siteVisits, data.propertyId, data.date, data.timeSlot);
    if (hasConflict) {
      addToast('error', 'Slot Unavailable', 'This time slot is already booked for this property. Please pick another time or date.');
      return { success: false, error: 'Time slot conflict detected.' };
    }

    const newVisit: SiteVisit = {
      ...data,
      id: `sv-${Date.now()}`,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    setSiteVisits((prev) => [newVisit, ...prev]);

    // Also auto-create a CRM lead for the agent
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      customerName: data.userName,
      email: data.userEmail,
      phone: data.userPhone,
      propertyId: data.propertyId,
      propertyTitle: data.propertyTitle,
      leadSource: 'site_visit',
      status: 'site_visit_scheduled',
      priority: 'high',
      assignedAgentId: data.agentId,
      assignedAgentName: data.agentName,
      notes: [
        {
          id: `n-${Date.now()}`,
          author: 'System',
          content: `Site visit scheduled for ${data.date} (${data.timeSlot}) - ${data.visitType === 'in_person' ? 'In-Person Tour' : 'Virtual Tour'}.`,
          createdAt: new Date().toLocaleDateString()
        }
      ],
      followUpDate: data.date,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setLeads((prev) => [newLead, ...prev]);

    // Create Notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Site Visit Confirmed',
      message: `Your visit for "${data.propertyTitle}" is confirmed for ${data.date} at ${data.timeSlot}.`,
      type: 'site_visit',
      link: '#dashboard-visits',
      isRead: false,
      createdAt: new Date().toLocaleDateString()
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast('success', 'Site Visit Scheduled!', `Confirmed for ${data.date} at ${data.timeSlot}`);
    return { success: true };
  };

  const cancelSiteVisit = (visitId: string) => {
    setSiteVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, status: 'cancelled' as const } : v))
    );
    addToast('info', 'Site visit cancelled');
  };

  const rescheduleSiteVisit = (visitId: string, newDate: string, newTimeSlot: string) => {
    const existing = siteVisits.find((v) => v.id === visitId);
    if (!existing) return { success: false, error: 'Visit not found' };

    const conflict = checkSiteVisitConflict(siteVisits, existing.propertyId, newDate, newTimeSlot, visitId);
    if (conflict) {
      addToast('error', 'Slot Unavailable', 'Selected slot is already reserved.');
      return { success: false, error: 'Slot conflict' };
    }

    setSiteVisits((prev) =>
      prev.map((v) =>
        v.id === visitId ? { ...v, date: newDate, timeSlot: newTimeSlot, status: 'confirmed' as const } : v
      )
    );
    addToast('success', 'Visit Rescheduled', `Updated to ${newDate} at ${newTimeSlot}`);
    return { success: true };
  };

  // Enquiries State
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura_enquiries');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return INITIAL_ENQUIRIES;
  });

  useEffect(() => {
    localStorage.setItem('aura_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  const submitEnquiry = (data: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => {
    const newEnquiry: Enquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toLocaleString()
    };

    setEnquiries((prev) => [newEnquiry, ...prev]);

    // Create lead automatically in CRM
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      customerName: data.customerName,
      email: data.customerEmail,
      phone: data.customerPhone,
      propertyId: data.propertyId,
      propertyTitle: data.propertyTitle,
      leadSource: 'website_enquiry',
      status: 'new',
      priority: 'high',
      assignedAgentId: 'agent-marcus',
      assignedAgentName: 'Marcus Vance',
      notes: [
        {
          id: `n-${Date.now()}`,
          author: 'System',
          content: `Inquiry message: "${data.message}" (Preferred contact: ${data.preferredContact})`,
          createdAt: new Date().toLocaleDateString()
        }
      ],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setLeads((prev) => [newLead, ...prev]);

    // Add notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Enquiry Received',
      message: `Your enquiry for ${data.propertyTitle} has been routed to Senior Dealer Marcus Vance.`,
      type: 'enquiry',
      isRead: false,
      createdAt: new Date().toLocaleDateString()
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast('success', 'Enquiry Dispatched!', 'A luxury property advisor will contact you within 2 business hours.');
  };

  // Leads & CRM
  const [leads, setLeads] = useState<Lead[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura_leads');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return INITIAL_LEADS;
  });

  useEffect(() => {
    localStorage.setItem('aura_leads', JSON.stringify(leads));
  }, [leads]);

  const updateLeadStatus = (leadId: string, status: Lead['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status, updatedAt: new Date().toISOString().split('T')[0] } : l))
    );
    addToast('success', 'Lead Status Updated', `Status changed to: ${status.replace(/_/g, ' ').toUpperCase()}`);
  };

  const addLeadNote = (leadId: string, content: string) => {
    const note = {
      id: `note-${Date.now()}`,
      author: currentUser.name,
      content,
      createdAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, notes: [note, ...l.notes], updatedAt: new Date().toISOString().split('T')[0] } : l
      )
    );
    addToast('success', 'CRM Note Added');
  };

  const assignLeadAgent = (leadId: string, agentId: string, agentName: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, assignedAgentId: agentId, assignedAgentName: agentName, updatedAt: new Date().toISOString().split('T')[0] } : l
      )
    );
    addToast('info', `Lead Assigned to ${agentName}`);
  };

  // Admin Property Management
  const addProperty = (propData: Omit<Property, 'id' | 'listedDate' | 'lastUpdatedDate' | 'viewCount' | 'likesCount' | 'savesCount' | 'priceHistory'>) => {
    const newProp: Property = {
      ...propData,
      id: `prop-${Date.now()}`,
      listedDate: new Date().toISOString().split('T')[0],
      lastUpdatedDate: new Date().toISOString().split('T')[0],
      viewCount: 1,
      likesCount: 0,
      savesCount: 0,
      priceHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          price: propData.price,
          event: 'Initial Listing Published'
        }
      ]
    };
    setProperties((prev) => [newProp, ...prev]);
    addToast('success', 'Property Published', `"${newProp.title}" is now active on the marketplace.`);
  };

  const updateProperty = (propertyId: string, updates: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === propertyId) {
          const updated = { ...p, ...updates, lastUpdatedDate: new Date().toISOString().split('T')[0] };
          if (updates.price && updates.price !== p.price) {
            updated.priceHistory = [
              ...(p.priceHistory || []),
              {
                date: new Date().toISOString().split('T')[0],
                price: updates.price,
                event: `Price adjusted from $${p.price.toLocaleString()} to $${updates.price.toLocaleString()}`
              }
            ];
          }
          return updated;
        }
        return p;
      })
    );
    addToast('success', 'Property Updated Successfully');
  };

  const deleteProperty = (propertyId: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    addToast('info', 'Property Removed from Database');
  };

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura_notifications');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('aura_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast('info', 'All notifications marked as read');
  };

  // Command Palette
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <RealEstateContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        currentUser,
        switchUserRole,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authMode,
        loginUser,
        logoutUser,
        properties,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        filteredProperties,
        selectedProperty,
        setSelectedProperty,
        activeView,
        setActiveView,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        comparisonIds,
        addToComparison,
        removeFromComparison,
        clearComparison,
        siteVisits,
        scheduleSiteVisit,
        cancelSiteVisit,
        rescheduleSiteVisit,
        enquiries,
        submitEnquiry,
        leads,
        updateLeadStatus,
        addLeadNote,
        assignLeadAgent,
        addProperty,
        updateProperty,
        deleteProperty,
        notifications,
        unreadNotifCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </RealEstateContext.Provider>
  );
}

export function useRealEstate() {
  const context = useContext(RealEstateContext);
  if (!context) {
    throw new Error('useRealEstate must be used within a RealEstateProvider');
  }
  return context;
}

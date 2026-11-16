import { Property, PropertyFilters, SiteVisit } from '../types/index.ts';

/**
 * Calculates monthly EMI, total interest, and total payable amount.
 * Formula: EMI = [P x r x (1+r)^n] / [(1+r)^n - 1]
 */
export function calculateEMI(principal: number, annualInterestRate: number, tenureYears: number) {
  if (principal <= 0 || tenureYears <= 0) {
    return { monthlyEMI: 0, totalInterest: 0, totalPayment: 0 };
  }

  const monthlyRate = (annualInterestRate / 100) / 12;
  const numberOfMonths = tenureYears * 12;

  if (monthlyRate === 0) {
    const monthlyEMI = Math.round(principal / numberOfMonths);
    return {
      monthlyEMI,
      totalInterest: 0,
      totalPayment: principal,
    };
  }

  const factor = Math.pow(1 + monthlyRate, numberOfMonths);
  const monthlyEMI = Math.round((principal * monthlyRate * factor) / (factor - 1));
  const totalPayment = monthlyEMI * numberOfMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyEMI,
    totalInterest,
    totalPayment,
  };
}

/**
 * Calculates Stamp Duty and Registration charges based on property value and region.
 */
export function calculateStampDuty(propertyPrice: number, region = 'standard', isFemaleBuyer = false) {
  if (propertyPrice <= 0) return { stampDuty: 0, registrationFee: 0, totalGovtCharges: 0, ratePct: 0 };

  let stampDutyPct = 5.0; // standard 5%
  if (region === 'luxury_metro') stampDutyPct = 6.0;
  if (region === 'rural') stampDutyPct = 4.0;
  if (isFemaleBuyer) stampDutyPct = Math.max(1, stampDutyPct - 1.0); // 1% concession

  const stampDuty = Math.round((propertyPrice * stampDutyPct) / 100);
  // Standard 1% or capped registration charge
  const registrationFee = Math.round(Math.min(propertyPrice * 0.01, 30000));
  const totalGovtCharges = stampDuty + registrationFee;

  return {
    stampDuty,
    registrationFee,
    totalGovtCharges,
    ratePct: stampDutyPct,
  };
}

/**
 * Calculates Price per Square Foot and Price per Square Meter
 */
export function calculatePricePerUnit(price: number, areaSqFt: number) {
  if (price <= 0 || areaSqFt <= 0) return { pricePerSqFt: 0, pricePerSqM: 0 };
  const pricePerSqFt = Math.round(price / areaSqFt);
  const pricePerSqM = Math.round(price / (areaSqFt * 0.092903));
  return { pricePerSqFt, pricePerSqM };
}

/**
 * Checks for site visit scheduling conflicts for the same property & agent.
 */
export function checkSiteVisitConflict(
  existingVisits: SiteVisit[],
  propertyId: string,
  dateStr: string,
  timeSlot: string,
  excludeVisitId?: string
): boolean {
  return existingVisits.some((visit) => {
    if (excludeVisitId && visit.id === excludeVisitId) return false;
    if (visit.status === 'cancelled') return false;
    return (
      visit.propertyId === propertyId &&
      visit.date === dateStr &&
      visit.timeSlot.trim().toLowerCase() === timeSlot.trim().toLowerCase()
    );
  });
}

/**
 * Filters a list of properties according to provided criteria.
 */
export function filterProperties(properties: Property[], filters: PropertyFilters): Property[] {
  return properties.filter((prop) => {
    // Buy / Rent filter
    if (filters.listingType && filters.listingType !== 'all') {
      if (prop.listingType !== filters.listingType) return false;
    }

    // Property Type
    if (filters.propertyType && filters.propertyType !== 'all') {
      if (prop.propertyType.toLowerCase() !== filters.propertyType.toLowerCase()) return false;
    }

    // City / Locality
    if (filters.city && filters.city !== 'all') {
      const matchCity = prop.city.toLowerCase().includes(filters.city.toLowerCase()) ||
        prop.state.toLowerCase().includes(filters.city.toLowerCase());
      if (!matchCity) return false;
    }

    // Budget constraints
    if (filters.minPrice !== undefined && prop.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && prop.price > filters.maxPrice) return false;

    // Bedrooms
    if (filters.bedrooms !== undefined && filters.bedrooms !== 'any') {
      if (prop.bedrooms < Number(filters.bedrooms)) return false;
    }

    // Area constraints
    if (filters.minAreaSqFt !== undefined && prop.areaSqFt < filters.minAreaSqFt) return false;
    if (filters.maxAreaSqFt !== undefined && prop.areaSqFt > filters.maxAreaSqFt) return false;

    // Ready to Move
    if (filters.readyToMoveOnly && prop.possessionStatus !== 'Ready to Move') return false;

    // Verified
    if (filters.verifiedOnly && !prop.isVerified) return false;

    // Featured
    if (filters.featuredOnly && !prop.isFeatured) return false;

    // Furnishing
    if (filters.furnishing && filters.furnishing !== 'all') {
      if (prop.furnishingStatus.toLowerCase() !== filters.furnishing.toLowerCase()) return false;
    }

    // Amenities
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((req) =>
        prop.amenities.some((a) => a.toLowerCase().includes(req.toLowerCase()))
      );
      if (!hasAllAmenities) return false;
    }

    // Free text query
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase().trim();
      const matchQuery =
        (prop.title?.toLowerCase().includes(query) ?? false) ||
        (prop.address?.toLowerCase().includes(query) ?? false) ||
        (prop.locality?.toLowerCase().includes(query) ?? false) ||
        (prop.city?.toLowerCase().includes(query) ?? false) ||
        (prop.propertyType?.toLowerCase().includes(query) ?? false) ||
        (prop.tagline?.toLowerCase().includes(query) ?? false);
      if (!matchQuery) return false;
    }

    return true;
  });
}

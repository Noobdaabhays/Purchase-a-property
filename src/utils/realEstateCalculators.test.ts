import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEMI,
  calculateStampDuty,
  calculatePricePerUnit,
  checkSiteVisitConflict,
  filterProperties
} from './realEstateCalculators.ts';
import { Property, SiteVisit } from '../types/index.ts';

test('calculateEMI accurately computes standard home loan EMI', () => {
  // Principal: $1,000,000, Rate: 6.5%, Tenure: 30 years
  const res = calculateEMI(1000000, 6.5, 30);
  assert.ok(res.monthlyEMI > 6000 && res.monthlyEMI < 6500, `Expected ~6320, got ${res.monthlyEMI}`);
  assert.equal(res.totalPayment, res.monthlyEMI * 360);
  assert.equal(res.totalInterest, res.totalPayment - 1000000);
});

test('calculateEMI handles 0 rate and edge cases gracefully', () => {
  const zeroRate = calculateEMI(120000, 0, 10);
  assert.equal(zeroRate.monthlyEMI, 1000);
  assert.equal(zeroRate.totalInterest, 0);

  const zeroPrincipal = calculateEMI(0, 7, 20);
  assert.equal(zeroPrincipal.monthlyEMI, 0);
});

test('calculateStampDuty computes appropriate regional rates and concessions', () => {
  const standard = calculateStampDuty(500000, 'standard', false);
  assert.equal(standard.stampDuty, 25000); // 5%
  assert.equal(standard.ratePct, 5.0);

  const femaleConcession = calculateStampDuty(500000, 'standard', true);
  assert.equal(femaleConcession.stampDuty, 20000); // 4%
  assert.equal(femaleConcession.ratePct, 4.0);

  const luxury = calculateStampDuty(2000000, 'luxury_metro', false);
  assert.equal(luxury.stampDuty, 120000); // 6%
});

test('calculatePricePerUnit handles sqft and conversion to sqM', () => {
  const res = calculatePricePerUnit(1000000, 2000);
  assert.equal(res.pricePerSqFt, 500);
  assert.ok(res.pricePerSqM > 5000, 'Metric sqM rate should be calculated');
});

test('checkSiteVisitConflict prevents double booking on same property, date and time', () => {
  const mockVisits: SiteVisit[] = [
    {
      id: 'sv-1',
      propertyId: 'prop-101',
      propertyTitle: 'Lunar Oasis Villa',
      propertyImage: '',
      propertyAddress: '1874 Forest Haven Rd',
      userId: 'u-1',
      userName: 'Alice',
      userEmail: 'alice@example.com',
      userPhone: '1234567890',
      agentId: 'ag-1',
      agentName: 'Marcus Cole',
      date: '2026-12-01',
      timeSlot: '10:00 AM - 11:30 AM',
      visitType: 'in_person',
      status: 'confirmed',
      createdAt: '2026-11-15'
    }
  ];

  // Exactly overlapping appointment
  const conflict = checkSiteVisitConflict(mockVisits, 'prop-101', '2026-12-01', '10:00 AM - 11:30 AM');
  assert.equal(conflict, true);

  // Different time slot
  const differentTime = checkSiteVisitConflict(mockVisits, 'prop-101', '2026-12-01', '02:00 PM - 03:30 PM');
  assert.equal(differentTime, false);

  // Different date
  const differentDate = checkSiteVisitConflict(mockVisits, 'prop-101', '2026-12-02', '10:00 AM - 11:30 AM');
  assert.equal(differentDate, false);

  // Different property
  const differentProp = checkSiteVisitConflict(mockVisits, 'prop-999', '2026-12-01', '10:00 AM - 11:30 AM');
  assert.equal(differentProp, false);
});

test('filterProperties handles combined filters accurately', () => {
  const mockProps: Partial<Property>[] = [
    {
      id: 'p1',
      title: 'Lunar Oasis Villa',
      listingType: 'buy',
      propertyType: 'Villa',
      city: 'Asheville',
      state: 'North Carolina',
      price: 3500000,
      bedrooms: 4,
      areaSqFt: 7480,
      possessionStatus: 'Ready to Move',
      isVerified: true,
      isFeatured: true,
      furnishingStatus: 'Furnished',
      amenities: ['Infinity Pool', 'Panoramic Views', 'Smart Automation'],
      tagline: 'Futuristic Desert Sanctuary'
    },
    {
      id: 'p2',
      title: 'Apex Commercial Tower Suite',
      listingType: 'rent',
      propertyType: 'Commercial',
      city: 'New York',
      state: 'NY',
      price: 15000,
      bedrooms: 0,
      areaSqFt: 3500,
      possessionStatus: 'Ready to Move',
      isVerified: true,
      isFeatured: false,
      furnishingStatus: 'Furnished',
      amenities: ['24/7 Security', 'High Speed Elevators'],
      tagline: 'Prime Midtown Commercial'
    }
  ];

  const fullProps = mockProps as Property[];

  // Filter for Buy only
  const buyOnly = filterProperties(fullProps, { listingType: 'buy' });
  assert.equal(buyOnly.length, 1);
  assert.equal(buyOnly[0].id, 'p1');

  // Filter with max price
  const lowBudget = filterProperties(fullProps, { maxPrice: 50000 });
  assert.equal(lowBudget.length, 1);
  assert.equal(lowBudget[0].id, 'p2');

  // Filter by query "oasis"
  const searchMatch = filterProperties(fullProps, { searchQuery: 'oasis' });
  assert.equal(searchMatch.length, 1);
  assert.equal(searchMatch[0].id, 'p1');
});

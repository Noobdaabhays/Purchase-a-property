import React, { useState } from 'react';
import {
  calculateEMI,
  calculateStampDuty,
  calculatePricePerUnit
} from '../utils/realEstateCalculators.ts';
import { Calculator, DollarSign, Percent, Calendar, ShieldCheck, TrendingUp } from 'lucide-react';

export function FinancialCalculators() {
  const [activeTab, setActiveTab] = useState<'emi' | 'stamp' | 'unit'>('emi');

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [tenureYears, setTenureYears] = useState(30);

  const emiResult = calculateEMI(loanAmount, interestRate, tenureYears);
  const principalPct = Math.round((loanAmount / (emiResult.totalPayment || 1)) * 100);
  const interestPct = 100 - principalPct;

  // Stamp Duty State
  const [propertyPrice, setPropertyPrice] = useState(3500000);
  const [region, setRegion] = useState('luxury_metro');
  const [isFemaleBuyer, setIsFemaleBuyer] = useState(false);

  const stampResult = calculateStampDuty(propertyPrice, region, isFemaleBuyer);

  // Price Per Unit State
  const [unitPrice, setUnitPrice] = useState(4200000);
  const [unitArea, setUnitArea] = useState(6200);

  const unitResult = calculatePricePerUnit(unitPrice, unitArea);
  const estimatedAnnualRental = Math.round(unitPrice * 0.048); // 4.8% gross luxury yield

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-[#4c2fbb] dark:text-purple-400 mx-auto flex items-center justify-center mb-3">
          <Calculator className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Luxury Real Estate Financial Suite
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-light">
          Precise algorithmic estimation for home mortgage EMIs, regional conveyance tariffs, and square-footage valuation.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.05] inline-flex gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('emi')}
            className={`px-5 py-2 rounded-xl transition-all ${
              activeTab === 'emi'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Home Loan EMI Calculator
          </button>
          <button
            onClick={() => setActiveTab('stamp')}
            className={`px-5 py-2 rounded-xl transition-all ${
              activeTab === 'stamp'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Stamp Duty & Escrow
          </button>
          <button
            onClick={() => setActiveTab('unit')}
            className={`px-5 py-2 rounded-xl transition-all ${
              activeTab === 'unit'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Valuation & Rental Yield
          </button>
        </div>
      </div>

      {/* EMI Calculator */}
      {activeTab === 'emi' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in">
          {/* Controls */}
          <div className="md:col-span-7 rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-slate-700 dark:text-slate-300">Loan Principal Amount</span>
                <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                  ${loanAmount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={200000}
                max={15000000}
                step={50000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-[#4c2fbb] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>$200k</span>
                <span>$15M</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-slate-700 dark:text-slate-300">Annual Interest Rate</span>
                <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                  {interestRate}%
                </span>
              </div>
              <input
                type="range"
                min={3.5}
                max={12}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-[#4c2fbb] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>3.5%</span>
                <span>12.0%</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-slate-700 dark:text-slate-300">Loan Tenure</span>
                <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                  {tenureYears} Years
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-[#4c2fbb] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>5 Years</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="md:col-span-5 rounded-3xl bg-purple-50/70 dark:bg-purple-950/40 backdrop-blur-xl border border-purple-200 dark:border-purple-900/60 p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 tracking-wider">
                Monthly Loan Installment
              </span>
              <div className="text-4xl font-bold font-mono tracking-tight text-slate-900 dark:text-white mt-2">
                ${emiResult.monthlyEMI.toLocaleString()}
                <span className="text-sm font-sans font-normal text-slate-500"> /mo</span>
              </div>

              {/* Visual Breakdown Bar */}
              <div className="mt-6 space-y-2">
                <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                  <div style={{ width: `${principalPct}%` }} className="bg-[#2e1d6d]" />
                  <div style={{ width: `${interestPct}%` }} className="bg-purple-400" />
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2e1d6d]" /> Principal: {principalPct}%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Total Interest: {interestPct}%
                  </span>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="mt-6 space-y-2.5 text-xs border-t border-purple-200 dark:border-purple-900/50 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Interest Payable:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ${emiResult.totalInterest.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Principal + Interest:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ${emiResult.totalPayment.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-6 leading-relaxed">
              *Estimates exclude property taxes, homeowner insurance, and HOA dues.
            </p>
          </div>
        </div>
      )}

      {/* Stamp Duty Calculator */}
      {activeTab === 'stamp' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in">
          <div className="md:col-span-7 rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] p-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold mb-2">Property Acquisition Value ($)</label>
              <input
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-lg font-mono font-bold text-slate-900 dark:text-white border-none outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2">Jurisdiction & Locality Tier</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white border-none outline-none cursor-pointer"
              >
                <option value="luxury_metro">Tier-1 Luxury Metro (6.0% Stamp Rate)</option>
                <option value="standard">Standard Urban Region (5.0% Stamp Rate)</option>
                <option value="rural">Rural / Coastal Enclave (4.0% Stamp Rate)</option>
              </select>
            </div>

            <label className="flex items-center gap-3 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={isFemaleBuyer}
                onChange={(e) => setIsFemaleBuyer(e.target.checked)}
                className="rounded text-[#4c2fbb]"
              />
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Female / Co-Owner Concession</span>
                <span className="text-[10px] text-slate-500">Applies 1.0% statutory conveyance duty concession where applicable.</span>
              </div>
            </label>
          </div>

          <div className="md:col-span-5 rounded-3xl bg-purple-50/70 dark:bg-purple-950/40 backdrop-blur-xl border border-purple-200 dark:border-purple-900/60 p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 tracking-wider">
                Total Regulatory & Conveyance Charges
              </span>
              <div className="text-4xl font-bold font-mono tracking-tight text-slate-900 dark:text-white mt-2">
                ${stampResult.totalGovtCharges.toLocaleString()}
              </div>

              <div className="mt-6 space-y-3 text-xs border-t border-purple-200 dark:border-purple-900/50 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Stamp Duty ({stampResult.ratePct}%):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ${stampResult.stampDuty.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registration & Registry Fee:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ${stampResult.registrationFee.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-6 leading-relaxed">
              Official escrow figures calculated dynamically based on municipal registrar guidelines.
            </p>
          </div>
        </div>
      )}

      {/* Valuation & Rental Yield */}
      {activeTab === 'unit' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in">
          <div className="md:col-span-7 rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] p-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold mb-2">Property Value ($)</label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-lg font-mono font-bold text-slate-900 dark:text-white border-none outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2">Total Carpet Area (sq.ft)</label>
              <input
                type="number"
                value={unitArea}
                onChange={(e) => setUnitArea(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-lg font-mono font-bold text-slate-900 dark:text-white border-none outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-5 rounded-3xl bg-purple-50/70 dark:bg-purple-950/40 backdrop-blur-xl border border-purple-200 dark:border-purple-900/60 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 tracking-wider">
                  Price Per Square Foot
                </span>
                <div className="text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white mt-1">
                  ${unitResult.pricePerSqFt}
                  <span className="text-xs font-sans text-slate-500 font-normal"> / sq.ft</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 tracking-wider">
                  Price Per Square Meter
                </span>
                <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white mt-1">
                  ${unitResult.pricePerSqM}
                  <span className="text-xs font-sans text-slate-500 font-normal"> / m²</span>
                </div>
              </div>

              <div className="pt-3 border-t border-purple-200 dark:border-purple-900/50">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 tracking-wider">
                  Projected Annual Rental Yield (4.8%)
                </span>
                <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  ${estimatedAnnualRental.toLocaleString()}
                  <span className="text-xs font-sans font-normal text-slate-500"> / year</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import {
  Clock,
  Briefcase,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  FileSpreadsheet,
  Building,
  CreditCard,
  PieChart,
} from 'lucide-react';

export function Screen09PracticeLedger() {
  const {
    currentEngagement,
    timesheets,
    journalEntries,
    arAging,
    openTimesheetModal,
  } = useAuditStore();

  const [activeTab, setActiveTab] = useState<'timesheets' | 'ledger' | 'ar'>('timesheets');

  // Filter timesheets for current engagement
  const engagementTimesheets = timesheets.filter(
    (t) => t.engagementId === currentEngagement.id
  );

  // Calculate engagement profitability
  const totalHoursLogged = engagementTimesheets.reduce((acc, t) => acc + t.hours, 0);
  const totalStaffCostQAR = engagementTimesheets.reduce(
    (acc, t) => acc + t.hours * t.chargeOutRateQAR,
    0
  );
  const contractedFee = currentEngagement.contractedFeeQAR;
  const grossProfitabilityQAR = contractedFee - totalStaffCostQAR;
  const profitMarginPercent = Math.round((grossProfitabilityQAR / contractedFee) * 100);

  // Firm Ledger totals
  const totalDebits = journalEntries.reduce((acc, j) => acc + j.debitQAR, 0);
  const totalCredits = journalEntries.reduce((acc, j) => acc + j.creditQAR, 0);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Practice Management, Time Realization & Firm Books
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Module 5: Real-time engagement profitability, tiered staff charge-out rate tracking, double-entry operational books, and client AR aging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openTimesheetModal}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Log Billable Hours</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('timesheets')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'timesheets'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Engagement Time Realization & Profitability Meter</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'ledger'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Firm Operational Double-Entry Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('ar')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'ar'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-4 h-4 text-purple-600" />
          <span>Client Accounts Receivable (AR) Aging</span>
        </button>
      </div>

      {/* TAB 1: Time Realization & Profitability */}
      {activeTab === 'timesheets' && (
        <div className="space-y-6">
          {/* Real-time Profitability Meter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                Contracted Audit Fee
              </span>
              <div className="text-2xl font-black font-mono text-slate-900 mt-1">
                QAR {contractedFee.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                {currentEngagement.clientLegalName}
              </span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                Total Staff Hours Logged
              </span>
              <div className="text-2xl font-black font-mono text-blue-700 mt-1">
                {totalHoursLogged.toFixed(1)} hrs
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                {engagementTimesheets.length} Work Sessions Logged
              </span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                Total Charged Staff Cost
              </span>
              <div className="text-2xl font-black font-mono text-slate-900 mt-1">
                QAR {totalStaffCostQAR.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                At Tiered Charge-Out Rates
              </span>
            </div>

            <div
              className={`p-4 rounded-xl border shadow-sm ${
                grossProfitabilityQAR >= 0
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-red-50/70 border-red-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-600">
                  Engagement Profitability
                </span>
                <span
                  className={`text-xs font-mono font-bold ${
                    profitMarginPercent >= 0 ? 'text-emerald-800' : 'text-red-800'
                  }`}
                >
                  {profitMarginPercent}% Margin
                </span>
              </div>
              <div
                className={`text-2xl font-black font-mono mt-1 ${
                  grossProfitabilityQAR >= 0 ? 'text-emerald-900' : 'text-red-900'
                }`}
              >
                QAR {grossProfitabilityQAR.toLocaleString()}
              </div>
              <span className="text-[10px] font-mono mt-1 block text-slate-600">
                Formula: Fee − Σ(Hours × Rate)
              </span>
            </div>
          </div>

          {/* Tiered Charge-Out Rate Table Indicator */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono block">
              Tiered Hourly Charge-Out Rates Schedule (QAR/hr)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Partner Tier</span>
                <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
                  1,000 QAR/hr
                </span>
                <span className="text-[10px] text-slate-400">High-risk review & opinion</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Manager Tier</span>
                <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
                  750 QAR/hr
                </span>
                <span className="text-[10px] text-slate-400">Materiality & SRM oversight</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Senior Auditor Tier</span>
                <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
                  500 QAR/hr
                </span>
                <span className="text-[10px] text-slate-400">Substantive testing & sampling</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Associate Tier</span>
                <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
                  200 QAR/hr
                </span>
                <span className="text-[10px] text-slate-400">Vouching & document checks</span>
              </div>
            </div>
          </div>

          {/* Timesheet Entries Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
                Logged Timesheet Sessions for {currentEngagement.clientLegalName}
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {engagementTimesheets.length} Records
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Auditor & Tier</th>
                  <th className="py-2.5 px-4">Section / FSLI</th>
                  <th className="py-2.5 px-4 text-right">Hours</th>
                  <th className="py-2.5 px-4 text-right">Rate (QAR)</th>
                  <th className="py-2.5 px-4 text-right">Total Cost (QAR)</th>
                  <th className="py-2.5 px-4">Description / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {engagementTimesheets.map((ts) => (
                  <tr key={ts.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 text-slate-500 text-[11px]">{ts.date}</td>
                    <td className="py-2.5 px-4 font-sans font-semibold text-slate-900">
                      {ts.staffName} ({ts.role})
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-blue-700">{ts.fsliCode}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                      {ts.hours.toFixed(1)} hrs
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-600">
                      QAR {ts.chargeOutRateQAR}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                      QAR {(ts.hours * ts.chargeOutRateQAR).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-sans text-slate-600 text-[11px]">
                      {ts.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Double-Entry Ledger */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Firm Operational Double-Entry Journal Ledger
              </h2>
              <p className="text-xs text-slate-500">
                Operating expenses, office tenancy, staff wages, and client audit fee retainers.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-emerald-700 font-bold">
                Total Debits: QAR {totalDebits.toLocaleString()}
              </span>
              <span>=</span>
              <span className="text-emerald-700 font-bold">
                Total Credits: QAR {totalCredits.toLocaleString()}
              </span>
            </div>
          </div>

          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Account Code & Name</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Debit (QAR)</th>
                <th className="py-2.5 px-3 text-right">Credit (QAR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {journalEntries.map((je) => (
                <tr key={je.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 text-slate-500 text-[11px]">{je.date}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{je.account}</td>
                  <td className="py-2.5 px-3 text-slate-700 font-sans">{je.description}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {je.debitQAR > 0 ? `QAR ${je.debitQAR.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {je.creditQAR > 0 ? `QAR ${je.creditQAR.toLocaleString()}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: Client AR Aging Schedule */}
      {activeTab === 'ar' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Client Accounts Receivable (AR) Aging Schedule (QAR)
              </h2>
              <p className="text-xs text-slate-500">
                Tracks collection status of 50% advance fees and 50% final release billing.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">MOCI Standard Aging</span>
          </div>

          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px]">
              <tr>
                <th className="py-2.5 px-3 font-sans">Client Legal Name</th>
                <th className="py-2.5 px-3">Engagement Code</th>
                <th className="py-2.5 px-3 text-right">Total Due (QAR)</th>
                <th className="py-2.5 px-3 text-right">50% Advance (QAR)</th>
                <th className="py-2.5 px-3 text-right">50% Final (QAR)</th>
                <th className="py-2.5 px-3 text-right">Current</th>
                <th className="py-2.5 px-3 text-right">30 Days Overdue</th>
                <th className="py-2.5 px-3 text-center font-sans">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {arAging.map((ar) => (
                <tr key={ar.engagementCode} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-sans font-semibold text-slate-900">
                    {ar.clientName}
                  </td>
                  <td className="py-3 px-3 text-blue-700">{ar.engagementCode}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    QAR {ar.totalDueQAR.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700">
                    QAR {ar.advanceDueQAR.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700">
                    QAR {ar.finalDueQAR.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-semibold">
                    QAR {ar.currentQAR.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-red-700 font-semibold">
                    {ar.days30QAR > 0 ? `QAR ${ar.days30QAR.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-3 px-3 text-center font-sans">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        ar.status === 'Current'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ar.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

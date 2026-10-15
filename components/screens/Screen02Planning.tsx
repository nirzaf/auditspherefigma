'use client';

import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import {
  Calculator,
  Calendar,
  FolderTree,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Lock,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

export function Screen02Planning() {
  const { currentEngagement, updateMateriality, partnerApproveMateriality, navigateToScreen } =
    useAuditStore();

  const mat = currentEngagement.materiality;
  const isApproved = mat.partnerApproved;

  // Local state for rounding tool slider
  const [roundingOffset, setRoundingOffset] = useState<number>(mat.managerRoundingOffsetPercent || 0);

  const handleBenchmarkChange = (
    type: 'Normalized Profit Before Tax' | 'Total Revenue' | 'Total Assets' | 'Equity / Net Assets'
  ) => {
    let base = 3000000;
    let pct = 5.0;

    if (type === 'Total Revenue') {
      base = 42850000;
      pct = 1.0;
    } else if (type === 'Total Assets') {
      base = 49000000;
      pct = 0.8;
    } else if (type === 'Equity / Net Assets') {
      base = 22000000;
      pct = 1.5;
    }

    updateMateriality({
      benchmarkType: type,
      benchmarkBaseQAR: base,
      benchmarkPercent: pct,
    });
  };

  const handleRoundingChange = (val: number) => {
    setRoundingOffset(val);
    updateMateriality({
      managerRoundingOffsetPercent: val,
    });
  };

  const exceedsFivePercent = Math.abs(roundingOffset) > 5.0;

  return (
    <div className="space-y-6">
      {/* Top Split Panel: Resource/Gantt & 5-Folder Provisioner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Resource & Timeline Gantt (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Resource Allocation & Statutory Milestones
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Audit Period: {currentEngagement.statutoryYearEnd}
            </span>
          </div>

          {/* Team Assignment Matrix */}
          <div>
            <span className="text-[11px] font-semibold text-slate-600 block mb-2">
              Assigned Engagement Team & Charge-Out Rates:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {currentEngagement.assignedTeam.map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-[10px] shrink-0 font-mono">
                      {m.avatar}
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-slate-900 truncate">{m.name}</div>
                      <div className="text-[10px] text-slate-500">{m.role}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-emerald-700 font-semibold flex justify-between">
                    <span>Rate:</span>
                    <span>QAR {m.chargeOutRateQAR}/hr</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Milestones Tracker */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-600 block mb-2">
              Statutory Milestones & Reporting Schedule:
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 font-mono block">1. Year-End</span>
                <span className="font-bold text-slate-800 text-[11px] block mt-0.5 font-mono">
                  31 Dec 2026
                </span>
                <span className="text-[9px] text-emerald-600 font-medium">Closed</span>
              </div>
              <div className="p-2 bg-blue-50/60 border border-blue-200 rounded-lg">
                <span className="text-[10px] text-blue-600 font-mono block">2. Fieldwork</span>
                <span className="font-bold text-blue-900 text-[11px] block mt-0.5 font-mono">
                  {currentEngagement.milestones.fieldworkStart}
                </span>
                <span className="text-[9px] text-blue-600 font-medium">In Progress</span>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 font-mono block">3. Draft Report</span>
                <span className="font-bold text-slate-800 text-[11px] block mt-0.5 font-mono">
                  {currentEngagement.milestones.draftReportDate}
                </span>
                <span className="text-[9px] text-slate-400 font-medium">Scheduled</span>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 font-mono block">4. Final Report</span>
                <span className="font-bold text-slate-800 text-[11px] block mt-0.5 font-mono">
                  {currentEngagement.milestones.finalReportDate}
                </span>
                <span className="text-[9px] text-slate-400 font-medium">Statutory AGM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: 5-Folder Directory Provisioner (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                5-Folder Directory Provisioner
              </h2>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Auto-Provisioned
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium text-slate-800">01_Administration & Planning</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                Ready (4 docs)
              </span>
            </div>

            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium text-slate-800">02_Trial Balance & Schedules</span>
              </div>
              <span className="text-[10px] font-mono text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">
                Ingested (12 docs)
              </span>
            </div>

            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-medium text-slate-800">03_Fieldwork & Testing</span>
              </div>
              <span className="text-[10px] font-mono text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">
                Active (28 docs)
              </span>
            </div>

            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between opacity-70">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-600">04_Drafts & Deliverables</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                Locked
              </span>
            </div>

            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between opacity-70">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-600">05_Final Signed Archive</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                Locked (Phase 7)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas: Dynamic 3-Tier Materiality Calculator */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Dynamic 3-Tier Materiality Calculator (ISA 320)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Computes Planning Materiality (PM), Performance Materiality / Tolerable Error (TE), and Summary of Audit Differences (SAD).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded font-mono ${
                isApproved
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {isApproved ? 'PARTNER APPROVED' : 'DRAFT PLANNING'}
            </span>
          </div>
        </div>

        {/* Benchmark Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
            Trial Balance Benchmark Selection (Radio Selector):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { label: 'Normalized Profit Before Tax', range: '5% – 10%', base: 3000000 },
              { label: 'Total Revenue', range: '0.5% – 2%', base: 42850000 },
              { label: 'Total Assets', range: '0.5% – 1%', base: 49000000 },
              { label: 'Equity / Net Assets', range: '1% – 2%', base: 22000000 },
            ].map((b) => (
              <button
                key={b.label}
                onClick={() => handleBenchmarkChange(b.label as any)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  mat.benchmarkType === b.label
                    ? 'bg-blue-50/80 border-blue-500 text-blue-900 ring-1 ring-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{b.label}</span>
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      mat.benchmarkType === b.label
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-slate-400'
                    }`}
                  >
                    {mat.benchmarkType === b.label && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    )}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-mono">
                  Base: QAR {b.base.toLocaleString()}
                </div>
                <div className="text-[10px] text-blue-700 mt-0.5 font-mono">Guide: {b.range}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 3 Formula Compute Cards (Side-by-Side) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card A: Planning Materiality (PM) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              Card A: Planning Materiality (PM)
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 mt-2">
              QAR {mat.adjustedPlanningMaterialityQAR.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Base (QAR {mat.benchmarkBaseQAR.toLocaleString()}) × {mat.benchmarkPercent}%
              {mat.managerRoundingOffsetPercent !== 0 && (
                <span className="font-mono text-blue-600 ml-1">
                  ({mat.managerRoundingOffsetPercent > 0 ? '+' : ''}
                  {mat.managerRoundingOffsetPercent}%)
                </span>
              )}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200 text-[10px] text-slate-500">
              Primary threshold for aggregate misstatements in financial statements.
            </div>
          </div>

          {/* Card B: Tolerable Error / Performance Materiality (TE) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                Card B: Tolerable Error (TE)
              </span>
              <span className="text-xs font-mono font-bold text-blue-700">
                {mat.tolerableErrorPercent}% of PM
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 mt-2">
              QAR {mat.tolerableErrorQAR.toLocaleString()}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mb-1">
                <span>Range: 50%</span>
                <span>Active: {mat.tolerableErrorPercent}%</span>
                <span>75%</span>
              </div>
              <input
                type="range"
                min="50"
                max="75"
                step="5"
                value={mat.tolerableErrorPercent}
                onChange={(e) =>
                  updateMateriality({ tolerableErrorPercent: parseInt(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
            <div className="mt-2 text-[10px] text-slate-500">
              Performance threshold for scoping substantive test sample sizes.
            </div>
          </div>

          {/* Card C: Summary of Audit Differences (SAD) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                Card C: Trivial Error Cutoff (SAD)
              </span>
              <span className="text-xs font-mono font-bold text-blue-700">
                {mat.sadPercent}% of PM
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 mt-2">
              QAR {mat.sadQAR.toLocaleString()}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mb-1">
                <span>Range: 3%</span>
                <span>Active: {mat.sadPercent}%</span>
                <span>5%</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="5.0"
                step="0.5"
                value={mat.sadPercent}
                onChange={(e) =>
                  updateMateriality({ sadPercent: parseFloat(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
            <div className="mt-2 text-[10px] text-slate-500">
              Clearly trivial threshold; items below this need not be accumulated.
            </div>
          </div>
        </div>

        {/* Manager Practical Rounding Tool (Restricted to ±5.0%) */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            exceedsFivePercent ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Manager Practical Rounding Tool (Max ±5.0% Tolerance Band)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Allows practical adjustment for reporting presentation without distorting benchmark precision.
              </p>
            </div>
            <div className="font-mono font-bold text-xs">
              Offset: <span className={exceedsFivePercent ? 'text-red-700' : 'text-blue-700'}>
                {roundingOffset > 0 ? `+${roundingOffset}%` : `${roundingOffset}%`}
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-4">
            <span className="text-xs font-mono text-slate-500">-5.0%</span>
            <input
              type="range"
              min="-5.0"
              max="5.0"
              step="0.5"
              value={roundingOffset}
              onChange={(e) => handleRoundingChange(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-500">+5.0%</span>
          </div>

          {exceedsFivePercent && (
            <div className="mt-2 flex items-center gap-2 text-xs text-red-700 font-medium">
              <AlertTriangle className="w-4 h-4" />
              <span>Strict Rule Violation: Manager rounding cannot exceed ±5.0% under firm policy.</span>
            </div>
          )}
        </div>

        {/* Partner Sign-Off Drawer / Action Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <div className="text-xs">
              <span className="font-semibold text-slate-800 block">
                Partner Materiality Sign-Off Gate (ISA 320)
              </span>
              <span className="text-slate-500">
                {isApproved
                  ? `Approved by ${mat.approvedBy} on ${mat.approvedAt}`
                  : 'Requires Partner sign-off to unlock Phase 3 Substantive Fieldwork.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isApproved ? (
              <button
                onClick={partnerApproveMateriality}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>[Partner Approve Planning & Materiality]</span>
              </button>
            ) : (
              <button
                onClick={() => navigateToScreen('phase-3')}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
              >
                <span>Proceed to Phase 3: Fieldwork Execution</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import { ConfirmationItem } from '@/types/audit';
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building,
  MailCheck,
  Send,
  Lock,
  ArrowRight,
  PlusCircle,
  TrendingDown,
  Info,
} from 'lucide-react';

export function Screen04Review() {
  const {
    currentEngagement,
    openReviewNoteModal,
    resolveReviewNote,
    updateConfirmationStatus,
    openHoldingLetterModal,
    navigateToScreen,
  } = useAuditStore();

  const [activeTab, setActiveTab] = useState<'notes' | 'srm' | 'confirmations'>('notes');

  const openNotes = currentEngagement.reviewNotes.filter((n) => n.status !== 'Resolved');
  const resolvedNotes = currentEngagement.reviewNotes.filter((n) => n.status === 'Resolved');

  // Critical pending confirmation
  const criticalPending = currentEngagement.confirmations.find(
    (c) => c.isCritical && c.status === 'Pending'
  );

  return (
    <div className="space-y-6">
      {/* Critical Holding Letter Blocker Banner */}
      {criticalPending && (
        <div className="p-4 rounded-xl bg-red-900 text-white border border-red-700 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-800 flex items-center justify-center shrink-0 text-red-200">
              <Lock className="w-5 h-5 text-red-300" />
            </div>
            <div>
              <div className="font-bold text-xs uppercase tracking-wider font-mono text-red-200 flex items-center gap-2">
                <span>CRITICAL BLOCKER: Bank Confirmation Pending</span>
                <span className="bg-red-950 px-2 py-0.5 rounded text-[10px] border border-red-800">
                  ISA 505 / ISA 700 Hard Lock
                </span>
              </div>
              <p className="text-xs text-red-100 mt-1">
                Partner report sign-off is locked because critical confirmation from{' '}
                <strong>{criticalPending.recipientName}</strong> (Balance: QAR{' '}
                {criticalPending.balanceQAR.toLocaleString()}) remains pending response.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => openHoldingLetterModal(criticalPending)}
              className="px-4 py-2 rounded-lg bg-white text-red-900 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-[0.98]"
            >
              <Send className="w-3.5 h-3.5 text-red-700" />
              <span>Auto-Generate Pending Confirmation / Holding Letter</span>
            </button>
          </div>
        </div>
      )}

      {/* Screen Title & Navigation Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Manager Review, Review Notes & Confirmations Tracker
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Phase 4 / Module 4: Enforces audit rework loops, compiles the Summary Review Memorandum (SRM), and tracks third-party circularizations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateToScreen('phase-5')}
              disabled={!!criticalPending}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                !criticalPending
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Partner Sign-Off Station (Phase 5)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Inline Review Notes & Rework Loop ({openNotes.length} Open)</span>
          </button>

          <button
            onClick={() => setActiveTab('srm')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'srm'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Summary Review Memorandum (SRM) Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('confirmations')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'confirmations'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MailCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Third-Party Confirmations & Circularizations</span>
            {criticalPending && (
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW A: Inline Review & Rework Loop */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Active Audit Review Notes & Rework Items
              </h2>
              <p className="text-xs text-slate-500">
                FSLIs under rework remain blocked from partner sign-off until the preparer satisfies manager comments.
              </p>
            </div>
            <button
              onClick={openReviewNoteModal}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Initiate Rework Loop / Add Review Note</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {note.procedureRef} · {note.status.toUpperCase()}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1">{note.fsliName}</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{note.createdAt}</span>
                </div>

                <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 text-xs text-amber-950 leading-relaxed">
                  {note.noteText}
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500">
                    <span>Raised by: </span>
                    <strong className="text-slate-800">{note.raisedBy}</strong>
                    <span className="mx-1">→</span>
                    <span>Assigned: </span>
                    <strong className="text-slate-800">{note.assignedTo}</strong>
                  </div>

                  <button
                    onClick={() => resolveReviewNote(note.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                  >
                    Mark as Resolved
                  </button>
                </div>
              </div>
            ))}

            {openNotes.length === 0 && (
              <div className="col-span-2 p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                All manager review notes have been successfully addressed and resolved.
              </div>
            )}
          </div>

          {resolvedNotes.length > 0 && (
            <div className="pt-4">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono block mb-2">
                Resolved Review Notes Archive ({resolvedNotes.length})
              </span>
              <div className="space-y-2">
                {resolvedNotes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between opacity-80"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{n.fsliName}</span>
                      <span className="mx-2">·</span>
                      <span className="line-clamp-1">{n.noteText}</span>
                    </div>
                    <span className="text-emerald-700 font-mono font-bold text-[10px] bg-emerald-100 px-2 py-0.5 rounded">
                      RESOLVED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW B: Summary Review Memorandum (SRM) Engine */}
      {activeTab === 'srm' && (
        <div className="space-y-6">
          {/* Table of Adjusting Journal Entries (AJEs) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Table of Proposed Adjusting Journal Entries (AJEs)
                </h3>
                <p className="text-xs text-slate-500">
                  Substantive audit adjustments identified during fieldwork.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700">ISA 450 Schedule</span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Entry No. & Description</th>
                  <th className="py-2.5 px-3">Debit Account (QAR)</th>
                  <th className="py-2.5 px-3">Credit Account (QAR)</th>
                  <th className="py-2.5 px-3 text-right">Amount (QAR)</th>
                  <th className="py-2.5 px-3 text-center">Client Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">AJE-01: Inventory NRV Markdown</div>
                    <div className="text-[11px] text-slate-500 font-sans">
                      IAS 2 provision for luxury apparel exceeding 360-day turnover.
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-800">5120 COGS - Inventory Write-down</td>
                  <td className="py-3 px-3 text-slate-800">1220 Provision for NRV</td>
                  <td className="py-3 px-3 text-right font-bold text-red-700">QAR 180,000</td>
                  <td className="py-3 px-3 text-center font-sans">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Booked by Client
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">AJE-02: Port Tariff & Freight Accrual</div>
                    <div className="text-[11px] text-slate-500 font-sans">
                      Cut-off accrual for December 2026 container customs clearing.
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-800">5140 Inbound Freight Expenses</td>
                  <td className="py-3 px-3 text-slate-800">2150 Accrued Port Charges</td>
                  <td className="py-3 px-3 text-right font-bold text-red-700">QAR 42,000</td>
                  <td className="py-3 px-3 text-center font-sans">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Booked by Client
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Schedule of Unadjusted Differences vs SAD & PM */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Schedule of Unadjusted Differences (SUD) vs SAD & PM Thresholds
                </h3>
                <p className="text-xs text-slate-500">
                  Evaluates whether aggregate uncorrected misstatements exceed Planning Materiality (ISA 450).
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span>
                  SAD Cutoff: <strong>QAR {currentEngagement.materiality.sadQAR.toLocaleString()}</strong>
                </span>
                <span>·</span>
                <span>
                  PM Limit: <strong>QAR {currentEngagement.materiality.adjustedPlanningMaterialityQAR.toLocaleString()}</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Unadjusted Difference 1:</span>
                <span className="font-bold text-slate-900 block mt-1">
                  Reclassification of Prepaid Tenancy
                </span>
                <span className="font-mono text-sm font-bold text-slate-800 mt-1 block">
                  QAR 18,500
                </span>
                <span className="text-[10px] text-blue-700 font-mono mt-1 block">
                  Exceeds SAD (QAR 6,000) · Accumulated
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Unadjusted Difference 2:</span>
                <span className="font-bold text-slate-900 block mt-1">
                  Depreciation Useful Life Timing Discrepancy
                </span>
                <span className="font-mono text-sm font-bold text-slate-800 mt-1 block">
                  QAR 24,000
                </span>
                <span className="text-[10px] text-blue-700 font-mono mt-1 block">
                  Exceeds SAD (QAR 6,000) · Accumulated
                </span>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-800 text-[11px] block">Total Aggregate Unadjusted:</span>
                <span className="font-mono text-2xl font-black text-emerald-900 block mt-1">
                  QAR 42,500
                </span>
                <div className="text-[10px] text-emerald-700 font-mono mt-1 font-semibold">
                  Well Below Planning Materiality (QAR 150,000) → Clean Opinion Allowable
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW C: Third-Party Confirmations Dashboard */}
      {activeTab === 'confirmations' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Third-Party Independent Confirmations Grid (ISA 505)
              </h2>
              <p className="text-xs text-slate-500">
                Direct external verification of cash, debt facilities, corporate receivables, legal contingencies, and consignment inventory.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500">
                Critical Pending: {criticalPending ? '1 Overdue' : '0'}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Recipient Institution</th>
                  <th className="py-2.5 px-3 text-right">Balance (QAR)</th>
                  <th className="py-2.5 px-3 text-center">Criticality</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3">Last Follow-Up</th>
                  <th className="py-2.5 px-3 text-right">Simulate Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentEngagement.confirmations.map((conf) => (
                  <tr key={conf.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-900">
                      <span className="font-mono text-slate-700">{conf.type}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {conf.recipientName}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {conf.balanceQAR > 0 ? `QAR ${conf.balanceQAR.toLocaleString()}` : 'N/A (Legal)'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {conf.isCritical ? (
                        <span className="text-[10px] font-bold text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded font-mono">
                          CRITICAL GATE
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          conf.status === 'Received'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : conf.status === 'Pending'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}
                      >
                        {conf.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {conf.lastFollowUp}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {conf.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => updateConfirmationStatus(conf.id, 'Received')}
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold transition-colors"
                            >
                              Receive Circularization
                            </button>
                            <button
                              onClick={() => openHoldingLetterModal(conf)}
                              className="px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-800 text-[10px] font-semibold transition-colors"
                            >
                              Holding Letter
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => updateConfirmationStatus(conf.id, 'Pending')}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-medium transition-colors"
                          >
                            Reset to Pending
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

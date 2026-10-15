'use client';

import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import {
  Briefcase,
  FileText,
  FileCheck2,
  Receipt,
  Layers,
  Send,
  Lock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export function Screen06Deliverables() {
  const {
    currentEngagement,
    freezeClientUploads,
    dispatchDeliverablesToClient,
    navigateToScreen,
  } = useAuditStore();

  const [previewDoc, setPreviewDoc] = useState<string | null>('card-1');

  const del = currentEngagement.deliverables;
  const isDispatched = del.auditorReportStatus === 'Dispatched';

  return (
    <div className="space-y-6">
      {/* Top Header & Portal Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Commercial Deliverables Bundle & Final Fee Release
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Phase 6 / Module 4: Assembly of the mandatory 5-part statutory audit bundle, upload privilege freeze, and client portal dispatch.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Freeze Client Uploads Toggle */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-xs font-semibold text-slate-700">Freeze Client Uploads:</span>
            <button
              onClick={() => freezeClientUploads(!del.clientUploadsFrozen)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                del.clientUploadsFrozen ? 'bg-red-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  del.clientUploadsFrozen ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Dispatch 5-Part Bundle Button */}
          {!isDispatched ? (
            <button
              onClick={dispatchDeliverablesToClient}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>[Dispatch 5-Part Bundle to Client Portal]</span>
            </button>
          ) : (
            <button
              onClick={() => navigateToScreen('phase-7')}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
            >
              <span>Phase 7: Compliance Archive</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {isDispatched && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>
              5-Part Statutory Bundle dispatched to Client CFO on {del.dispatchedAt}. Client upload privileges permanently frozen.
            </span>
          </div>
          <button
            onClick={() => navigateToScreen('client-portal')}
            className="text-emerald-700 underline font-semibold hover:text-emerald-900"
          >
            Preview in Client Portal →
          </button>
        </div>
      )}

      {/* The Mandatory 5-Part Deliverables Assembly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Card 1: Independent Auditor's Report & Certified Financial Statements */}
        <div
          onClick={() => setPreviewDoc('card-1')}
          className={`bg-white rounded-xl border p-4 shadow-sm cursor-pointer transition-all ${
            previewDoc === 'card-1'
              ? 'border-blue-500 ring-1 ring-blue-500'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {del.auditorReportStatus.toUpperCase()}
            </span>
          </div>
          <h3 className="font-bold text-xs text-slate-900 mt-3 leading-snug">
            1. Independent Auditor&apos;s Report & Statements
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Certified IFRS statements with partner signature & firm seal.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>ISA 700 / 705</span>
            <span className="text-blue-600 font-medium">Inspect PDF</span>
          </div>
        </div>

        {/* Card 2: Management Letter */}
        <div
          onClick={() => setPreviewDoc('card-2')}
          className={`bg-white rounded-xl border p-4 shadow-sm cursor-pointer transition-all ${
            previewDoc === 'card-2'
              ? 'border-blue-500 ring-1 ring-blue-500'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
              {del.managementLetterStatus.toUpperCase()}
            </span>
          </div>
          <h3 className="font-bold text-xs text-slate-900 mt-3 leading-snug">
            2. Formal Management Letter (ML)
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Deficiency matrix: Deficiency ➔ Impact ➔ Recommendation.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>ISA 265 Internal Control</span>
            <span className="text-blue-600 font-medium">Inspect</span>
          </div>
        </div>

        {/* Card 3: Letter of Representation (LOR) */}
        <div
          onClick={() => setPreviewDoc('card-3')}
          className={`bg-white rounded-xl border p-4 shadow-sm cursor-pointer transition-all ${
            previewDoc === 'card-3'
              ? 'border-blue-500 ring-1 ring-blue-500'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
              {del.lorStatus.toUpperCase()}
            </span>
          </div>
          <h3 className="font-bold text-xs text-slate-900 mt-3 leading-snug">
            3. Letter of Representation (LOR)
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Formatted client letterhead draft with populated year-end figures.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>ISA 580 Management LOR</span>
            <span className="text-blue-600 font-medium">Inspect</span>
          </div>
        </div>

        {/* Card 4: Management Correspondences Audit Trail */}
        <div
          onClick={() => setPreviewDoc('card-4')}
          className={`bg-white rounded-xl border p-4 shadow-sm cursor-pointer transition-all ${
            previewDoc === 'card-4'
              ? 'border-blue-500 ring-1 ring-blue-500'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
              COMPILED
            </span>
          </div>
          <h3 className="font-bold text-xs text-slate-900 mt-3 leading-snug">
            4. Audit Trail Correspondences
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Chronological queries, circularizations & resolution log.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>ISA 230 Trail</span>
            <span className="text-blue-600 font-medium">Inspect</span>
          </div>
        </div>

        {/* Card 5: Final Balance Fee Note */}
        <div
          onClick={() => setPreviewDoc('card-5')}
          className={`bg-white rounded-xl border p-4 shadow-sm cursor-pointer transition-all ${
            previewDoc === 'card-5'
              ? 'border-blue-500 ring-1 ring-blue-500'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              FINAL 50%
            </span>
          </div>
          <h3 className="font-bold text-xs text-slate-900 mt-3 leading-snug">
            5. Final Balance Fee Note
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 font-mono font-bold text-emerald-700">
            QAR {(currentEngagement.contractedFeeQAR / 2).toLocaleString()} Due
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>INV-2026-FINAL</span>
            <span className="text-blue-600 font-medium">Inspect</span>
          </div>
        </div>
      </div>

      {/* Selected Deliverable Live Inspection View */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        {previewDoc === 'card-1' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-mono">
                  INDEPENDENT AUDITOR&apos;S REPORT TO THE SHAREHOLDERS OF {currentEngagement.clientLegalName.toUpperCase()}
                </h3>
                <span className="text-xs text-slate-500">
                  Standards: International Standards on Auditing (ISA) & IFRS
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                {currentEngagement.partnerSignOff.opinionType}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg text-xs text-slate-800 space-y-3 font-serif leading-relaxed">
              <p>
                <strong>Report on the Audit of the Financial Statements:</strong>
                <br />
                We have audited the financial statements of{' '}
                <strong>{currentEngagement.clientLegalName}</strong>, which comprise the statement of financial position as at{' '}
                {currentEngagement.statutoryYearEnd}, and the statement of profit or loss and other comprehensive income,
                statement of changes in equity and statement of cash flows for the year then ended.
              </p>

              <div className="p-3 bg-white border border-slate-200 rounded font-sans">
                <div className="text-[11px] font-bold text-slate-900 uppercase font-mono">Opinion Statement:</div>
                <p className="text-xs text-slate-800 mt-1">
                  In our opinion, the accompanying financial statements present fairly, in all material respects, the financial position of the Company as at {currentEngagement.statutoryYearEnd}, and its financial performance and its cash flows for the year then ended in accordance with International Financial Reporting Standards (IFRSs).
                </p>
              </div>

              {currentEngagement.partnerSignOff.firmSealAffixed && (
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 font-sans">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono">SIGNED FOR AND ON BEHALF OF:</span>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">
                      STE Audit & Assurance Partners
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Tariq Al-Mansoor, FCA (Audit Partner)
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">
                      OFFICIAL QATAR AUDIT SEAL AFFIXED
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Timestamp: {currentEngagement.partnerSignOff.signOffTimestamp || 'Active'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {previewDoc === 'card-2' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-mono pb-2 border-b border-slate-200">
              MANAGEMENT LETTER (ML) — OBSERVATION & RECOMMENDATION MATRIX (ISA 265)
            </h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Deficiency Observation</th>
                    <th className="py-2.5 px-3">Operational & Financial Impact</th>
                    <th className="py-2.5 px-3">Auditor Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      Slow-Moving Luxury Apparel NRV Policy
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      Holding period over 360 days risked inventory overstatement by QAR 180,000.
                    </td>
                    <td className="py-3 px-3 text-blue-700">
                      Implement quarterly automated aging provisioning tied to POS turnover.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      Container Port Freight Cut-off Accruals
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      Three shipments in December lacked recorded customs clearance liabilities.
                    </td>
                    <td className="py-3 px-3 text-blue-700">
                      Mandate matching shipping port delivery manifests directly to GL accruals.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {previewDoc === 'card-5' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 font-mono">
                FINAL BALANCE PROFESSIONAL FEE INVOICE (50%)
              </h3>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                QAR {(currentEngagement.contractedFeeQAR / 2).toLocaleString()}.00
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Per commercial agreement terms, the final 50% professional audit fee balance is due upon release of certified financial statements and audit opinion.
            </p>
          </div>
        )}

        {previewDoc !== 'card-1' && previewDoc !== 'card-2' && previewDoc !== 'card-5' && (
          <div className="p-4 text-xs text-slate-600 font-mono">
            Full formatted document ready for dispatch to client CFO.
          </div>
        )}
      </div>
    </div>
  );
}

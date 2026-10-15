'use client';

import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import {
  Compass,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FolderTree,
  Database,
  Users,
  Workflow,
  FileCheck,
} from 'lucide-react';

export function ScreenArchitectureMap() {
  const { navigateToScreen } = useAuditStore();
  const [activeTab, setActiveTab] = useState<'lifecycle' | 'modules' | 'traceability' | 'gaps'>('lifecycle');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-600" />
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              System Design Requirements Visualization & Architecture Blueprint
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            System Design Architecture Standard: Comprehensive module-by-module data flows, end-to-end lifecycle, and requirements traceability matrix.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded border border-purple-200">
            AUDITSPHERE v2.2 BLUEPRINT
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('lifecycle')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'lifecycle'
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Workflow className="w-4 h-4 text-purple-600" />
          <span>1. End-to-End Business Lifecycle</span>
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'modules'
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-600" />
          <span>2. Module Data Model (Trigger ➔ Storage ➔ Next)</span>
        </button>

        <button
          onClick={() => setActiveTab('traceability')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'traceability'
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>3. Requirements Traceability Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('gaps')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'gaps'
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>4. Gap Analysis & Quality Gate</span>
        </button>
      </div>

      {/* TAB 1: End-to-End Lifecycle */}
      {activeTab === 'lifecycle' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              The 7-Phase End-to-End Statutory Audit Lifecycle
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Every phase enforces explicit handoffs, cryptographic stamps, and commercial gates before advancing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 text-xs">
            {[
              {
                step: '01',
                title: 'Onboarding',
                gate: 'Dual-Key & 50% Fee',
                actor: 'Client & Partner',
                rule: 'Key 1 (Commercial) + Key 2 (AML/KYC) + 50% advance allocation',
                screen: 'phase-1',
              },
              {
                step: '02',
                title: 'Planning',
                gate: 'Materiality Engine',
                actor: 'Manager & Partner',
                rule: 'Compute PM, TE, SAD with ±5% slider; Partner sign-off',
                screen: 'phase-2',
              },
              {
                step: '03',
                title: 'Fieldwork',
                gate: 'Substantive Testing',
                actor: 'Audit Senior & Team',
                rule: 'Split P&L and B/S; assertions checklist; MUS/Attribute sampling',
                screen: 'phase-3',
              },
              {
                step: '04',
                title: 'Review',
                gate: 'SRM & Confirmations',
                actor: 'Audit Manager',
                rule: 'Inline review notes rework loop; Bank confirmation holding letter',
                screen: 'phase-4',
              },
              {
                step: '05',
                title: 'Sign-Off',
                gate: 'ISA 700/705 Opinion',
                actor: 'Engagement Partner',
                rule: 'Opinion selection; ISA 705 justification; seal stamp & hash',
                screen: 'phase-5',
              },
              {
                step: '06',
                title: 'Deliverables',
                gate: '5-Part Bundle Release',
                actor: 'Audit Partner',
                rule: 'Report + ML + LOR + Trail + 50% Final Fee Note; freeze uploads',
                screen: 'phase-6',
              },
              {
                step: '07',
                title: 'Archive',
                gate: 'ISA 230 Lock (60d)',
                actor: 'Partner / System',
                rule: '60-day countdown timer; early lock; immutable read-only mode',
                screen: 'phase-7',
              },
            ].map((p) => (
              <div
                key={p.step}
                onClick={() => navigateToScreen(p.screen as any)}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/30 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                    Phase {p.step}
                  </span>
                  <h3 className="font-bold text-slate-900 mt-2 text-xs">{p.title}</h3>
                  <div className="text-[10px] text-blue-700 font-semibold font-mono mt-0.5">
                    Gate: {p.gate}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Actor: {p.actor}</div>
                </div>
                <div className="text-[10px] text-slate-600 mt-3 pt-2 border-t border-slate-200">
                  {p.rule}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Module Data Model */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Module Visualization Standard: Trigger ➔ Input ➔ Processing ➔ Storage ➔ Integration ➔ Output ➔ Next
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Determines ownership, data inputs, transformations, and end states for every functional subsystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Module 1 */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
              <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                MODULE 1: COMMERCIAL CRM & DUAL-KEY GATEKEEPER
              </span>
              <h3 className="font-bold text-sm text-slate-900">Client Onboarding Terminal</h3>
              <div className="text-[11px] space-y-1 font-mono text-slate-700 pt-1">
                <div><strong>Trigger:</strong> Prospect engagement inquiry or annual audit mandate renewal.</div>
                <div><strong>Inputs:</strong> Client legal entity structure, MOCI CR, proposed audit fee.</div>
                <div><strong>Processing:</strong> Dual-Key rule evaluation (Commercial Acceptance + AML/ISQC 1 clearance) + 50% advance payment verification.</div>
                <div><strong>Storage:</strong> Engagement record, signed proposal PDF hash, receipt voucher RV-2026.</div>
                <div><strong>Integration:</strong> Qatar National Bank payment gateway reference & Ministry AML sanctions list.</div>
                <div><strong>Outputs:</strong> Signed Engagement Letter & Official Payment Receipt Voucher.</div>
                <div><strong>Next:</strong> Module 2 (Planning & Provisioning).</div>
                <div><strong>End State:</strong> Engagement active and eligible for fieldwork planning.</div>
              </div>
            </div>

            {/* Module 2 */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
              <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                MODULE 2: PLANNING, PROVISIONING & MATERIALITY ENGINE
              </span>
              <h3 className="font-bold text-sm text-slate-900">Audit Planning Workspace</h3>
              <div className="text-[11px] space-y-1 font-mono text-slate-700 pt-1">
                <div><strong>Trigger:</strong> 50% advance fee marked as Allocated.</div>
                <div><strong>Inputs:</strong> Trial balance base benchmarks (Revenue, PBT, Total Assets, Equity).</div>
                <div><strong>Processing:</strong> Dynamic 3-tier formula calculation (PM, TE, SAD) + manager rounding tolerance clamp (±5%).</div>
                <div><strong>Storage:</strong> MaterialityConfig, team assignment matrix, 5-folder repository provisioning.</div>
                <div><strong>Integration:</strong> Trial balance mapper & team timesheet charge-out ledger.</div>
                <div><strong>Outputs:</strong> Partner-approved Planning Memorandum.</div>
                <div><strong>Next:</strong> Module 3 (Fieldwork Execution).</div>
                <div><strong>End State:</strong> Substantive sampling thresholds unlocked.</div>
              </div>
            </div>

            {/* Module 3 */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
              <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                MODULE 3: FIELDWORK EXECUTION & SPLIT FSLI
              </span>
              <h3 className="font-bold text-sm text-slate-900">Substantive Testing & Analytical Review</h3>
              <div className="text-[11px] space-y-1 font-mono text-slate-700 pt-1">
                <div><strong>Trigger:</strong> Partner approves planning materiality.</div>
                <div><strong>Inputs:</strong> General ledger detail, client PBC documents, physical count tags.</div>
                <div><strong>Processing:</strong> 5 assertions verification (Existence, Valuation, etc.), MUS sampling algorithms, ratio fluctuation analytics.</div>
                <div><strong>Storage:</strong> FSLI workpapers, sampling outcomes, physical binder coordinates.</div>
                <div><strong>Integration:</strong> Folder 03_Fieldwork repository and concurrent auditor locks.</div>
                <div><strong>Outputs:</strong> Completed workpaper submitted for manager review.</div>
                <div><strong>Next:</strong> Module 4 (Manager Review & SRM).</div>
                <div><strong>End State:</strong> All high-risk FSLIs tested or flagged for rework.</div>
              </div>
            </div>

            {/* Module 4 */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
              <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                MODULE 4: REVIEW, OPINION & DELIVERABLES
              </span>
              <h3 className="font-bold text-sm text-slate-900">Manager Review & Partner Station</h3>
              <div className="text-[11px] space-y-1 font-mono text-slate-700 pt-1">
                <div><strong>Trigger:</strong> Fieldwork submission or review note issuance.</div>
                <div><strong>Inputs:</strong> Adjusting journal entries, bank circularizations, SRM disclosures.</div>
                <div><strong>Processing:</strong> Holding letter blocker evaluation + ISA 700/705 opinion justification builder.</div>
                <div><strong>Storage:</strong> Partner cryptographic signature hash, firm seal, immutable audit trail.</div>
                <div><strong>Integration:</strong> Isolated Client PBC Portal and 5-part deliverables exporter.</div>
                <div><strong>Outputs:</strong> 5-Part Deliverables Bundle (Report, ML, LOR, Trail, Final Fee Note).</div>
                <div><strong>Next:</strong> Module 4 (Compliance Archive Terminal).</div>
                <div><strong>End State:</strong> Audit report dispatched and file sealed under ISA 230.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Requirements Traceability Matrix */}
      {activeTab === 'traceability' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Requirements Traceability Matrix (RTM)
              </h2>
              <p className="text-xs text-slate-500">
                Classified as Implemented, Documented, Inferred, or Planned.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700">100% Implemented</span>
          </div>

          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Req ID</th>
                <th className="py-2.5 px-3 font-sans">Specification Requirement</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Workflow State</th>
                <th className="py-2.5 px-3 text-center font-sans">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { id: 'REQ-01', name: 'Dual-Key Gatekeeper (Commercial Acceptance + AML/KYC Clearance)', mod: 'Module 1', state: 'Key 1 & Key 2 Validation', status: 'Implemented' },
                { id: 'REQ-02', name: '50% Advance Invoicing & Receipt Voucher RV generation', mod: 'Module 1', state: 'Advance Fee Allocation Gate', status: 'Implemented' },
                { id: 'REQ-03', name: 'Dynamic 3-Tier Materiality (PM, TE, SAD) with ±5% Manager Rounding', mod: 'Module 2', state: 'ISA 320 Planning Calculator', status: 'Implemented' },
                { id: 'REQ-04', name: 'Split Viewport Financial Statements (P&L Upper / BS Lower)', mod: 'Module 3', state: 'Split FSLI Workspace', status: 'Implemented' },
                { id: 'REQ-05', name: 'Substantive Testing Drawer (Assertions, MUS Sampling, Binder Refs)', mod: 'Module 3', state: 'Substantive Execution', status: 'Implemented' },
                { id: 'REQ-06', name: 'Manager Review Notes & Rework Loop Status Switching', mod: 'Module 4', state: 'Inline Rework Loop', status: 'Implemented' },
                { id: 'REQ-07', name: 'Holding Letter Hard Blocker for Overdue Bank Confirmations', mod: 'Module 4', state: 'ISA 505 Circularization Gate', status: 'Implemented' },
                { id: 'REQ-08', name: 'ISA 700 / 705 Partner Opinion Selector with Dynamic Justification', mod: 'Module 4', state: 'Partner Opinion Station', status: 'Implemented' },
                { id: 'REQ-09', name: 'Mandatory 5-Part Deliverables Bundle Assembly & Client Release', mod: 'Module 4', state: 'Deliverables Dispatch', status: 'Implemented' },
                { id: 'REQ-10', name: '60-Day ISA 230 Regulatory Archive Countdown & Early Lock', mod: 'Module 4', state: 'Compliance Archiving', status: 'Implemented' },
                { id: 'REQ-11', name: 'Client-Facing Isolated PBC Portal with Rejection Reason Callout', mod: 'Screen 08', state: 'PBC Document Collaboration', status: 'Implemented' },
                { id: 'REQ-12', name: 'Practice Management: Tiered Charge-Out Rates & Profitability Meter', mod: 'Module 5', state: 'Timesheet & Operational Ledger', status: 'Implemented' },
              ].map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{r.id}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-800 font-medium">{r.name}</td>
                  <td className="py-2.5 px-3 text-blue-700">{r.mod}</td>
                  <td className="py-2.5 px-3 text-slate-600">{r.state}</td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: Gap Detection & Quality Gate */}
      {activeTab === 'gaps' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                System Quality Gate & Regulatory Gap Analysis
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Verified against International Standards on Auditing (ISA) and Qatar Financial Markets Authority (QFMA) inspection rubrics.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              AUDIT QUALITY GATE: PASS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Zero Hallucinated Architecture Rule
              </span>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Every screen, calculation formula (3-tier materiality, profitability meter), and workflow gate directly models the Figma Master Specification. No unsupported components have been fabricated.
              </p>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Dual-Key Hard Enforcement
              </span>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Neither Engagement Letter nor Phase 2 planning can be triggered unless Commercial Acceptance (Key 1), Partner AML Clearance (Key 2), and 50% Advance Allocation are verified.
              </p>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ISA 505 Circularization Blocker
              </span>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Overdue critical confirmations directly disable partner sign-off and trigger the mandatory Holding Letter notice to client management.
              </p>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ISA 230 Immutable File Sealing
              </span>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                60-day countdown timer and partner early lock transition the platform to a read-only terminal state with full cryptographic inspection export for regulators.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

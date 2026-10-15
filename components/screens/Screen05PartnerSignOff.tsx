'use client';

import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import { OpinionType } from '@/types/audit';
import {
  FileCheck2,
  ShieldCheck,
  CheckSquare,
  Square,
  PenTool,
  Stamp,
  ArrowRight,
  AlertOctagon,
  FileText,
} from 'lucide-react';

export function Screen05PartnerSignOff() {
  const {
    currentEngagement,
    updatePartnerSignOff,
    executeFinalSignOff,
    navigateToScreen,
  } = useAuditStore();

  const signOff = currentEngagement.partnerSignOff;
  const isSigned = !!signOff.firmSealAffixed;

  const [confirmedSRM, setConfirmedSRM] = useState(true);
  const [confirmedHighRisk, setConfirmedHighRisk] = useState(true);
  const [selectedFsliMod, setSelectedFsliMod] = useState<string>(
    signOff.affectedFSLIs[0] || 'Inventory - Valuation (IAS 2)'
  );

  const opinionOptions: OpinionType[] = [
    'Clean / Unqualified Opinion',
    'Qualified Opinion',
    'Disclaimer of Opinion',
    'Adverse Opinion',
  ];

  const isModified = signOff.opinionType !== 'Clean / Unqualified Opinion';

  const highRiskFSLIs = currentEngagement.fsliList.filter((f) => f.riskLevel === 'High');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Partner Sign-Off & Opinion Selector Station
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Phase 5 / Module 4: Engagement Partner ISA 700 / 705 opinion determination, official firm seal affixing, and cryptographic sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-3 py-1 rounded font-mono ${
              isSigned
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {isSigned ? 'SIGNED & SEALED' : 'PENDING PARTNER SIGN-OFF'}
          </span>
          {isSigned && (
            <button
              onClick={() => navigateToScreen('phase-6')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>View Deliverables (Phase 6)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Split View: Left (Partner Inspection) & Right (Opinion Selector & Sign) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Partner Audit Inspection View (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Partner Inspection Checklist (ISA 220)
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Mandatory supervisory review of high-risk audit areas and unadjusted differences.
            </p>
          </div>

          {/* High-Risk FSLIs Focus */}
          <div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono block mb-2">
              High-Risk FSLIs Under Direct Partner Review:
            </span>
            <div className="space-y-2">
              {highRiskFSLIs.map((f) => (
                <div
                  key={f.id}
                  className="p-3 bg-red-50/50 rounded-lg border border-red-200 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">
                      {f.code} {f.name}
                    </span>
                    <span className="font-mono font-bold text-red-800 text-[11px]">
                      QAR {f.currentYearBalanceQAR.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Auditor: {f.assignedAuditor} · Status: <span className="font-semibold">{f.testingStatus}</span>
                  </div>
                </div>
              ))}

              {highRiskFSLIs.length === 0 && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500">
                  No high-risk FSLIs flagged on this engagement.
                </div>
              )}
            </div>
          </div>

          {/* Partner Mandatory Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div
              onClick={() => setConfirmedHighRisk(!confirmedHighRisk)}
              className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer text-xs"
            >
              {confirmedHighRisk ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              )}
              <span className="text-slate-800 font-medium">
                I confirm review of all significant risks, fraud inquiries, and substantive testing workpapers.
              </span>
            </div>

            <div
              onClick={() => setConfirmedSRM(!confirmedSRM)}
              className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer text-xs"
            >
              {confirmedSRM ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              )}
              <span className="text-slate-800 font-medium">
                I confirm review of the Summary Review Memorandum (SRM) and agree with unadjusted difference evaluations.
              </span>
            </div>
          </div>

          {/* Audit Partner Details */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Audit Partner:</span>
              <span className="font-bold text-slate-900">{signOff.partnerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Professional License:</span>
              <span className="font-mono text-slate-800 font-medium">QFMA / MOCI Licensed</span>
            </div>
          </div>
        </div>

        {/* Right Panel: ISA 700 / 705 Opinion Selection Engine (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  ISA 700 / 705 Opinion Selection Engine
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Select the appropriate audit opinion based on fieldwork evidence and materiality evaluations.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-700">Restricted to Partner</span>
            </div>
          </div>

          {/* Opinion Radio Selector */}
          <div className="grid grid-cols-2 gap-2.5">
            {opinionOptions.map((op) => (
              <button
                key={op}
                onClick={() => updatePartnerSignOff({ opinionType: op })}
                className={`p-3 rounded-lg border text-left transition-all ${
                  signOff.opinionType === op
                    ? 'bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-600'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{op}</span>
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      signOff.opinionType === op ? 'border-blue-600 bg-blue-600' : 'border-slate-400'
                    }`}
                  >
                    {signOff.opinionType === op && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    )}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  {op.includes('Clean')
                    ? 'True & fair view per IFRS'
                    : op.includes('Qualified')
                    ? 'Except for effects of matter (ISA 705)'
                    : op.includes('Disclaimer')
                    ? 'Unable to obtain evidence'
                    : 'Pervasively misstated'}
                </span>
              </button>
            ))}
          </div>

          {/* Dynamic Qualification Text Builder (Triggers if Modified Opinion) */}
          {isModified && (
            <div className="p-4 bg-amber-50/70 border border-amber-300 rounded-xl space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-xs text-amber-900 uppercase tracking-wider font-mono">
                  Dynamic Qualification Text Builder (ISA 705)
                </h4>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-900 mb-1">
                  Target FSLI Account(s) Affected:
                </label>
                <select
                  value={selectedFsliMod}
                  onChange={(e) => {
                    setSelectedFsliMod(e.target.value);
                    updatePartnerSignOff({ affectedFSLIs: [e.target.value] });
                  }}
                  className="w-full p-2 bg-white border border-amber-300 rounded text-xs font-medium"
                >
                  <option value="Merchandise Inventory - Valuation (IAS 2)">
                    Merchandise Inventory - Valuation (IAS 2)
                  </option>
                  <option value="Cost of Goods Sold (COGS) - Customs Tariffs">
                    Cost of Goods Sold (COGS) - Customs Tariffs
                  </option>
                  <option value="Contract Assets & Unbilled Variation Claims (IFRS 15)">
                    Contract Assets & Unbilled Variation Claims (IFRS 15)
                  </option>
                  <option value="Trade Receivables - IFRS 9 ECL Provision">
                    Trade Receivables - IFRS 9 ECL Provision
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-900 mb-1">
                  Textual Justification for Modification (ISA 705):
                </label>
                <textarea
                  value={signOff.isa705Justification}
                  onChange={(e) =>
                    updatePartnerSignOff({ isa705Justification: e.target.value })
                  }
                  placeholder="State clear reason why evidence was not available or why GAAP departure exists..."
                  rows={3}
                  className="w-full p-2.5 bg-white border border-amber-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Live Preview Pane */}
              <div className="p-3 bg-white rounded border border-amber-200">
                <div className="text-[10px] font-mono text-amber-800 font-bold uppercase tracking-wider mb-1">
                  Live Report Preview: Basis for {signOff.opinionType}
                </div>
                <p className="text-xs text-slate-800 italic leading-relaxed">
                  &ldquo;{signOff.isa705Justification || 'Enter textual justification above to preview statutory opinion clause.'}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Authorization & Digital Signature Module */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider font-mono">
                  Authorization & Cryptographic Signing
                </h4>
              </div>
              <button
                onClick={() =>
                  updatePartnerSignOff({ firmSealAffixed: !signOff.firmSealAffixed })
                }
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                  signOff.firmSealAffixed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                <Stamp className="w-3.5 h-3.5" />
                <span>{signOff.firmSealAffixed ? 'Seal Affixed' : 'Affix Stamp & Seal'}</span>
              </button>
            </div>

            {/* Signature Stamp Box */}
            <div className="p-3 bg-white border border-dashed border-slate-300 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">PARTNER DIGITAL SIGNATURE</span>
                <div className="font-serif italic text-base text-slate-900 font-bold mt-1">
                  {signOff.partnerName}
                </div>
                {signOff.partnerSignatureHash && (
                  <span className="text-[10px] font-mono text-emerald-700 block mt-0.5 truncate max-w-xs">
                    Hash: {signOff.partnerSignatureHash}
                  </span>
                )}
              </div>

              <div className="w-20 h-14 border border-slate-300 rounded bg-slate-50 flex flex-col items-center justify-center text-[9px] font-mono text-slate-500">
                <span className="font-bold text-slate-700">STE QATAR</span>
                <span>AUDIT SEAL</span>
                {signOff.firmSealAffixed && (
                  <span className="text-emerald-600 font-bold">AFFIXED</span>
                )}
              </div>
            </div>

            {/* Execute Final Sign-Off Action Button */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                {isSigned
                  ? `Signed on ${signOff.signOffTimestamp}`
                  : 'Unlocks Phase 6 Deliverables Bundle'}
              </span>

              <button
                onClick={executeFinalSignOff}
                disabled={!confirmedHighRisk || !confirmedSRM}
                className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-all ${
                  confirmedHighRisk && confirmedSRM
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Execute Final Sign-Off & Unlock Reporting</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

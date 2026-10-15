'use client';

import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import {
  FileText,
  CheckCircle,
  Clock,
  ArrowRight,
  Receipt,
  FileCheck2,
  ExternalLink,
  Info,
} from 'lucide-react';

export function Screen01Onboarding() {
  const {
    currentEngagement,
    toggleCommercialKey,
    togglePartnerKYC,
    allocateAdvancePayment,
    openReceiptModal,
    navigateToScreen,
  } = useAuditStore();

  const [paymentRefInput, setPaymentRefInput] = useState(
    currentEngagement.advanceInvoice.paymentRef || 'QNB-TRF-8819203'
  );

  const commercialApproved = currentEngagement.commercialKey.status === 'Approved';
  const partnerKycApproved = currentEngagement.partnerKyc.status === 'Unconditional Approval';
  const dualKeyCleared = commercialApproved && partnerKycApproved;
  const advanceAllocated = currentEngagement.advanceInvoice.status === 'Allocated';

  const handleAllocate = () => {
    allocateAdvancePayment(paymentRefInput);
  };

  return (
    <div className="space-y-6">
      {/* Client Context Breadcrumb & Top Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="text-slate-700 font-semibold">{currentEngagement.clientLegalName}</span>
              <span>/</span>
              <span>Commercial Onboarding</span>
              <span>/</span>
              <span className="font-mono text-blue-600 font-semibold">{currentEngagement.code}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1 tracking-tight">
              Client Onboarding & Dual-Key Gatekeeper
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Entity Structure: <span className="font-mono text-slate-700">{currentEngagement.entityStructure}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium">
              {currentEngagement.industryTag}
            </span>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-medium block">Contracted Audit Fee</span>
              <span className="text-base font-bold font-mono text-slate-900">
                QAR {currentEngagement.contractedFeeQAR.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Proposal Dispatch Widget */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 block text-[11px]">Commercial Proposal Format</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              {currentEngagement.proposalType}
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">
              Revision: {currentEngagement.proposalRev}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 block text-[11px]">Dispatch Channel & Timestamp</span>
            <span className="font-semibold text-slate-800 mt-0.5 block flex items-center gap-1.5">
              <span>{currentEngagement.proposalChannel}</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-mono">
                Delivered
              </span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">
              {currentEngagement.proposalDispatchedAt}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 block text-[11px]">Payment Terms Agreement</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              50% Advance on Acceptance / 50% on Final Draft
            </span>
            <span className="text-[10px] text-blue-600 font-medium mt-1 block">
              ISA 210 Compliant Engagement
            </span>
          </div>
        </div>
      </div>

      {/* Central Component: Dual-Key Acceptance Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Dual-Key Gatekeeper Clearance
            </h2>
            <p className="text-xs text-slate-500">
              Both Key 1 (Commercial Acceptance) and Key 2 (Partner AML/KYC Clearance) must be active to unlock Engagement Letter generation.
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-500">ISA 210 & ISQC 1 Gate</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Key 1 — Client Commercial Acceptance */}
          <div
            className={`rounded-xl border p-5 transition-all bg-white shadow-sm ${
              commercialApproved
                ? 'border-emerald-200 hover:border-emerald-300'
                : 'border-amber-200 bg-amber-50/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    commercialApproved
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Key 1: Client Commercial Acceptance</h3>
                  <span className="text-[11px] text-slate-500">Proposal Quotation Approval</span>
                </div>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                  commercialApproved
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {currentEngagement.commercialKey.status}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Quotation Rev:</span>
                <span className="font-mono text-slate-800 font-semibold">{currentEngagement.proposalRev}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Accepted Fee (QAR):</span>
                <span className="font-mono text-slate-900 font-bold">
                  QAR {currentEngagement.commercialKey.acceptedFeeQAR.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Authorized Signatory:</span>
                <span className="text-slate-800 font-medium">
                  {currentEngagement.commercialKey.authorizedSignatory}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Acceptance Timestamp:</span>
                <span className="font-mono text-slate-700 text-[11px]">
                  {currentEngagement.commercialKey.acceptedAt}
                </span>
              </div>
              {currentEngagement.commercialKey.attachmentName && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500">Signed Document:</span>
                  <span className="text-blue-600 font-medium flex items-center gap-1 hover:underline cursor-pointer">
                    <ExternalLink className="w-3 h-3" />
                    {currentEngagement.commercialKey.attachmentName}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">Simulate Client Response:</span>
              <button
                onClick={toggleCommercialKey}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  commercialApproved
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {commercialApproved ? 'Revoke Client Acceptance' : 'Approve Client Acceptance (Key 1)'}
              </button>
            </div>
          </div>

          {/* Card 2: Key 2 — Partner Risk Clearance (AML/KYC) */}
          <div
            className={`rounded-xl border p-5 transition-all bg-white shadow-sm ${
              partnerKycApproved
                ? 'border-emerald-200 hover:border-emerald-300'
                : 'border-amber-200 bg-amber-50/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    partnerKycApproved
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Key 2: Partner AML/KYC Risk Clearance</h3>
                  <span className="text-[11px] text-slate-500">ISQC 1 / ISA 220 Independence</span>
                </div>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                  partnerKycApproved
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {currentEngagement.partnerKyc.status}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle
                    className={`w-3.5 h-3.5 ${
                      currentEngagement.partnerKyc.uboVerified
                        ? 'text-emerald-600'
                        : 'text-slate-300'
                    }`}
                  />
                  <span>UBO Registry Verified</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle
                    className={`w-3.5 h-3.5 ${
                      currentEngagement.partnerKyc.amlSanctionsCleared
                        ? 'text-emerald-600'
                        : 'text-slate-300'
                    }`}
                  />
                  <span>AML Sanctions Cleared</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle
                    className={`w-3.5 h-3.5 ${
                      currentEngagement.partnerKyc.isqc1IndependenceCleared
                        ? 'text-emerald-600'
                        : 'text-slate-300'
                    }`}
                  />
                  <span>ISA 220 Independence</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle
                    className={`w-3.5 h-3.5 ${
                      currentEngagement.partnerKyc.conflictCleared
                        ? 'text-emerald-600'
                        : 'text-slate-300'
                    }`}
                  />
                  <span>Conflict of Interest Nil</span>
                </div>
              </div>

              {currentEngagement.partnerKyc.partnerSignatureHash && (
                <div className="pt-2 text-[10px] text-slate-500 font-mono bg-slate-50 p-2 rounded border border-slate-200">
                  <div>Partner: {currentEngagement.partnerKyc.partnerName}</div>
                  <div className="truncate text-emerald-700">
                    Hash Stamp: {currentEngagement.partnerKyc.partnerSignatureHash}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">Partner Action:</span>
              <button
                onClick={togglePartnerKYC}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  partnerKycApproved
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {partnerKycApproved ? 'Revoke Partner Clearance' : 'Approve AML/KYC Clearance (Key 2)'}
              </button>
            </div>
          </div>
        </div>

        {/* The Gatekeeper Rule Banner */}
        <div
          className={`mt-4 p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
            dualKeyCleared
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                dualKeyCleared ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'
              }`}
            >
              {dualKeyCleared ? '✓' : '!'}
            </div>
            <div>
              <div className="font-bold text-xs uppercase tracking-wider font-mono">
                {dualKeyCleared
                  ? 'Eligible for Statutory Engagement Letter Generation'
                  : 'Gatekeeper Rule Active: Engagement Letter Blocked'}
              </div>
              <p className="text-xs mt-0.5 opacity-90">
                {dualKeyCleared
                  ? 'Both commercial client acceptance and partner AML/ISQC 1 risk clearance have been validated.'
                  : 'Blocked: Requires both commercial acceptance (Key 1) and partner AML clearance (Key 2) before engagement letter can be executed.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              disabled={!dualKeyCleared}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                dualKeyCleared
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Generate Signed Engagement Letter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lower Sub-Section: Financial Advance Gate (50% Advance Invoicing) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                50% Advance Invoicing & Payment Allocation Gate
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Per firm credit policy, Phase 2 (Audit Planning Workspace) and the external Client PBC Portal remain locked until the 50% advance invoice is marked as Allocated.
            </p>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded font-mono ${
              advanceAllocated
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {advanceAllocated ? 'PAID & ALLOCATED' : 'PAYMENT PENDING'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Advance Invoice Number</span>
            <span className="font-mono font-bold text-slate-900 mt-0.5 block text-sm">
              {currentEngagement.advanceInvoice.invoiceNo}
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">50% Statutory Retainer</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Due Amount (QAR)</span>
            <span className="font-mono font-bold text-emerald-700 mt-0.5 block text-sm">
              QAR {currentEngagement.advanceInvoice.amountQAR.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">
              Remaining 50% on final draft
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Bank Reference Code</span>
            <div className="mt-1 flex items-center gap-1.5">
              <input
                type="text"
                value={paymentRefInput}
                onChange={(e) => setPaymentRefInput(e.target.value)}
                placeholder="e.g. QNB-TRF-8819203"
                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono font-medium focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">
              Cheque No. / Bank Transfer Ref
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-slate-500 block text-[11px]">Allocation Status</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {advanceAllocated ? '100% Reconciled to QNB' : 'Awaiting Bank Credit'}
              </span>
            </div>
            {advanceAllocated ? (
              <button
                onClick={openReceiptModal}
                className="mt-2 text-blue-600 hover:text-blue-800 text-[11px] font-semibold flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Receipt Voucher ({currentEngagement.advanceInvoice.receiptVoucherNo})</span>
              </button>
            ) : (
              <button
                onClick={handleAllocate}
                className="mt-2 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors"
              >
                Mark as Allocated
              </button>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-blue-500 shrink-0" />
            <span>
              {advanceAllocated && dualKeyCleared
                ? 'All Phase 1 requirements satisfied. Phase 2 Planning workspace is unlocked.'
                : 'Complete both Dual-Keys and mark the 50% advance as Allocated to proceed.'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openReceiptModal}
              disabled={!advanceAllocated}
              className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                advanceAllocated
                  ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>[Generate Official Payment Receipt Voucher]</span>
            </button>

            <button
              onClick={() => navigateToScreen('phase-2')}
              disabled={!dualKeyCleared || !advanceAllocated}
              className={`px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                dualKeyCleared && advanceAllocated
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Proceed to Phase 2: Audit Planning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

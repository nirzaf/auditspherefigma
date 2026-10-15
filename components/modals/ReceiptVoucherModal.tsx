'use client';

import React from 'react';
import { useAuditStore } from '@/lib/store';
import { Printer, CheckCircle, ShieldCheck } from 'lucide-react';

export function ReceiptVoucherModal() {
  const { receiptModalOpen, closeReceiptModal, currentEngagement } = useAuditStore();

  if (!receiptModalOpen) return null;

  const inv = currentEngagement.advanceInvoice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm tracking-tight">Official Payment Receipt Voucher</h3>
          </div>
          <button
            onClick={closeReceiptModal}
            className="text-slate-400 hover:text-white text-lg font-mono"
          >
            ✕
          </button>
        </div>

        {/* Voucher Body (Printable Paper Style) */}
        <div className="p-8 text-slate-800 space-y-6">
          {/* Firm Header */}
          <div className="flex items-start justify-between border-b pb-4 border-slate-200">
            <div>
              <div className="text-lg font-black tracking-tight text-slate-900">
                STE AUDIT & ASSURANCE PARTNERS
              </div>
              <div className="text-xs text-slate-500">
                Licensed Audit Firm · MOCI Reg. No. 49201 · Doha, State of Qatar
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Al-Fardan Office Tower, Floor 18, West Bay
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono">
                ORIGINAL ALLOCATED
              </span>
              <div className="text-xs font-mono font-bold text-slate-900 mt-2">
                {inv.receiptVoucherNo || 'RV-2026-0442'}
              </div>
              <div className="text-[11px] text-slate-500">{inv.paidAt || '2026-11-18 10:20 AST'}</div>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-4 gap-2 py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Received From:</span>
              <span className="col-span-3 font-bold text-slate-900">
                {currentEngagement.clientLegalName}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">The Sum Of:</span>
              <span className="col-span-3 font-mono font-bold text-emerald-700 text-sm">
                QAR {inv.amountQAR.toLocaleString()}.00 (Ten Thousand Qatari Riyals Only)
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Being Settlement Of:</span>
              <span className="col-span-3 text-slate-700">
                50% Advance Professional Audit Fee for Statutory Financial Audit for the year ending{' '}
                <strong className="text-slate-900">{currentEngagement.statutoryYearEnd}</strong> per
                Dispatched Invoice <span className="font-mono">{inv.invoiceNo}</span>.
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Payment Mode & Ref:</span>
              <span className="col-span-3 font-mono text-slate-800">
                Direct Bank Transfer · Ref: <span className="font-bold">{inv.paymentRef || 'QNB-TRF-8819203'}</span>
              </span>
            </div>
          </div>

          {/* Signature & Seal Block */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Prepared & Verified By</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Financial Controller (STE)</div>
              <div className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5 font-mono">
                <CheckCircle className="w-3 h-3" /> 100% Funds Reconciled
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="w-24 h-16 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center bg-slate-50 text-[10px] text-slate-400 font-mono">
                <span className="font-bold text-slate-600">STE AUDIT</span>
                <span>OFFICIAL SEAL</span>
                <span className="text-[8px] text-emerald-600 font-bold">QATAR</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1">Authorized Stamp</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            System Gate: Phase 2 Planning is permanently unlocked.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Voucher
            </button>
            <button
              onClick={closeReceiptModal}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

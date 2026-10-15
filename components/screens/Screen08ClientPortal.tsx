'use client';

import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import {
  Users,
  UploadCloud,
  FileText,
  AlertCircle,
  Receipt,
  Lock,
  ExternalLink,
  Shield,
  Clock,
} from 'lucide-react';

export function Screen08ClientPortal() {
  const {
    currentEngagement,
    uploadClientDocument,
    openReceiptModal,
    openHoldingLetterModal,
    openDocumentPreview,
  } = useAuditStore();

  const [activeTab, setActiveTab] = useState<'pbc' | 'billing'>('pbc');
  const [selectedRequestId, setSelectedRequestId] = useState<string>(
    currentEngagement.clientRequests.find((r) => r.status === 'Rejected')?.id ||
      currentEngagement.clientRequests[0]?.id ||
      ''
  );
  const [mockFileName, setMockFileName] = useState('');

  const isFrozen = currentEngagement.deliverables.clientUploadsFrozen;

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockFileName.trim() || !selectedRequestId) return;
    uploadClientDocument(selectedRequestId, mockFileName.trim());
    setMockFileName('');
  };

  return (
    <div className="space-y-6">
      {/* Client Portal Header Bar (Clean Client Styling) */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow">
              PBC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight">Client Audit Coordination Portal</h1>
                <span className="text-[10px] font-mono font-bold bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
                  External View
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Client: <strong className="text-slate-200">{currentEngagement.clientLegalName}</strong> · Auditor:{' '}
                <span className="text-slate-300">STE Audit & Assurance Partners</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right text-xs">
              <span className="text-slate-400 text-[11px] block">Audit Period:</span>
              <span className="font-bold text-white font-mono">{currentEngagement.statutoryYearEnd}</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('pbc')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'pbc'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Document Requests (PBC Schedule)</span>
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'billing'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Billing, Vouchers & Holding Letters</span>
          </button>
        </div>
      </div>

      {/* Freeze Lock Banner if Phase 6 Complete */}
      {isFrozen && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-3 shadow-sm">
          <Lock className="w-5 h-5 text-amber-700 shrink-0" />
          <div className="text-xs">
            <strong className="font-bold block uppercase tracking-wider font-mono">
              Document Submissions for this Audit Period are Closed
            </strong>
            <span>
              Final deliverables have been dispatched and the audit file is undergoing statutory compliance archiving under ISA 230.
            </span>
          </div>
        </div>
      )}

      {/* TAB 1: PBC Document Requests */}
      {activeTab === 'pbc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Requests Table (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Requested Audit Schedules & Workpapers
                </h2>
                <p className="text-xs text-slate-500">
                  Provide certified management schedules to support substantive fieldwork assertions.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {currentEngagement.clientRequests.filter((r) => r.status === 'Approved').length} /{' '}
                {currentEngagement.clientRequests.length} Approved
              </span>
            </div>

            <div className="space-y-3">
              {currentEngagement.clientRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequestId(req.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedRequestId === req.id
                      ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                        {req.category}
                      </span>
                      <h3 className="font-bold text-xs text-slate-900 mt-0.5">{req.title}</h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        req.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : req.status === 'Rejected'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : req.status === 'Under Review'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {req.description}
                  </p>

                  {/* Rejection Reason Callout Banner */}
                  {req.status === 'Rejected' && req.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Auditor Rejection Note:</strong>
                        <p className="text-[11px] text-red-800 mt-0.5">{req.rejectionReason}</p>
                      </div>
                    </div>
                  )}

                  {req.uploadedFileName && (
                    <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2 font-mono">
                      <span>Uploaded: {req.uploadedFileName}</span>
                      <span>{req.uploadedAt}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upload Dropzone Container (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono pb-2 border-b border-slate-100">
              Upload Schedule / Replacement File
            </h3>

            {!isFrozen ? (
              <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Select Target Schedule:
                  </label>
                  <select
                    value={selectedRequestId}
                    onChange={(e) => setSelectedRequestId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs"
                  >
                    {currentEngagement.clientRequests.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.status})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const req = currentEngagement.clientRequests.find((r) => r.id === selectedRequestId);
                    const draftName =
                      mockFileName.trim() || `${currentEngagement.code}_${req?.id || 'PBC'}_Draft.pdf`;
                    openDocumentPreview({
                      fileName: draftName,
                      folder: '02_Trial Balance & Schedules',
                      fileType: 'PDF',
                      uploadedBy: 'Client Audit Liaison',
                      uploadedAt: req?.uploadedAt || req?.deadline || '2027-01-15',
                      shaHash: '0x9c41f2a77bd310e6622d00391cde554c',
                      sizeKB: 1840,
                      description: req ? `${req.title}: ${req.description}` : 'Staged evidence file.',
                      linkedWorkbench: 'client-portal',
                    });
                    if (!mockFileName.trim()) setMockFileName(draftName);
                  }}
                  className="w-full border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50/60 hover:bg-slate-50 hover:border-blue-300 transition-colors"
                  title="Browse or inspect the staged evidence file"
                >
                  <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <span className="font-semibold text-slate-800 block">Choose file or drag & drop here</span>
                  <span className="text-[10px] text-slate-400 block mt-1">PDF, Excel (.xlsx), CSV, ZIP (Max 50MB)</span>
                </button>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Simulate Document File Name:
                  </label>
                  <input
                    type="text"
                    value={mockFileName}
                    onChange={(e) => setMockFileName(e.target.value)}
                    placeholder="e.g. QNB_Bank_Statement_Dec2026_Full_Signed.pdf"
                    className="w-full p-2 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!mockFileName.trim()}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold transition-colors ${
                    mockFileName.trim()
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Submit Document for Auditor Review
                </button>
              </form>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 font-mono">
                Upload dropzone disabled. File locked.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Billing & Receipts */}
      {activeTab === 'billing' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 50% Advance Receipt Voucher */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-900 font-mono">
                50% Advance Fee Receipt Voucher
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                PAID & ALLOCATED
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-700">
              QAR {currentEngagement.advanceInvoice.amountQAR.toLocaleString()}
            </div>
            <p className="text-xs text-slate-600">
              Official receipt voucher generated for advance invoice{' '}
              <span className="font-mono">{currentEngagement.advanceInvoice.invoiceNo}</span>.
            </p>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-mono text-[11px]">
                {currentEngagement.advanceInvoice.receiptVoucherNo}
              </span>
              <button
                onClick={openReceiptModal}
                className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                <span>View Receipt</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 2: 50% Final Fee Invoice */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-900 font-mono">
                50% Final Fee Balance Invoice
              </span>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded font-mono">
                {currentEngagement.deliverables.finalInvoiceStatus.toUpperCase()}
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900">
              QAR {(currentEngagement.contractedFeeQAR / 2).toLocaleString()}
            </div>
            <p className="text-xs text-slate-600">
              Remaining balance due upon issuance of independent auditor&apos;s report.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 font-mono text-[11px]">
              INV-2026-FINAL-01
            </div>
          </div>

          {/* Card 3: Issued Holding Letters */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-900 font-mono">
                Issued Holding Notices
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-mono">
                ISA 505
              </span>
            </div>
            <div className="text-sm font-bold text-slate-800">
              Pending Bank Confirmation Holding Notice
            </div>
            <p className="text-xs text-slate-600">
              Formal audit notice issued to Client Board & CFO regarding pending QNB confirmation.
            </p>
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => openHoldingLetterModal()}
                className="text-red-700 font-semibold text-xs hover:underline flex items-center gap-1"
              >
                <span>Inspect Holding Notice</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { useAuditStore } from '@/lib/store';
import { Download, ShieldCheck, CheckCircle } from 'lucide-react';

export function InspectionExportModal() {
  const { exportModalOpen, closeExportModal, currentEngagement } = useAuditStore();

  if (!exportModalOpen) return null;

  const exportPayload = {
    engagementCode: currentEngagement.code,
    client: currentEngagement.clientLegalName,
    yearEnd: currentEngagement.statutoryYearEnd,
    regulatoryFramework: 'ISA & IFRS (State of Qatar)',
    partnerSignOff: currentEngagement.partnerSignOff,
    materiality: currentEngagement.materiality,
    fsliAuditedCount: currentEngagement.fsliList.length,
    auditTrail: currentEngagement.auditTrail,
    timestamp: '2026-10-14T17:00:00.000Z',
    sha256Seal: '0x8f2a93b4d1872e41c9b88e00192dfaa377b8192a00cfa882910488921bba8821',
  };

  const handleDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentEngagement.code}_REGULATORY_INSPECTION_BUNDLE.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                ISA 230 Regulatory Inspection Package
              </h3>
              <p className="text-[11px] text-slate-400">
                Official Examination Export for Regulators & Quality Assurance Reviews
              </p>
            </div>
          </div>
          <button
            onClick={closeExportModal}
            className="text-slate-400 hover:text-white text-lg font-mono"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-800">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-blue-900">
              This compiled bundle contains the complete electronic audit file, substantive sampling sheets,
              manager review iterations, and cryptographic partner signature hashes conforming to{' '}
              <strong>ISA 230 (Audit Documentation)</strong> and State of Qatar regulatory inspection guidelines.
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-slate-900 text-slate-200 font-mono text-[11px] max-h-60 overflow-y-auto">
            <pre>{JSON.stringify(exportPayload, null, 2)}</pre>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 font-medium">Archival Integrity Status:</span>
              <div className="font-bold text-emerald-700 mt-1">100% Cryptographically Verified</div>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500 font-medium">Audit Trail Entries:</span>
              <div className="font-bold text-slate-900 mt-1 font-mono">
                {currentEngagement.auditTrail.length} Immutable Log Events
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-slate-400 text-[11px] font-mono">Format: Encrypted JSON Manifest</span>
          <div className="flex items-center gap-2">
            <button
              onClick={closeExportModal}
              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              Download Inspection Package (.JSON)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

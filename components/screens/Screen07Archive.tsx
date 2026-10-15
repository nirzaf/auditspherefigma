'use client';

import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import {
  Archive,
  Lock,
  Unlock,
  Clock,
  Download,
  ShieldCheck,
  FileCheck,
  CheckCircle,
} from 'lucide-react';

export function Screen07Archive() {
  const {
    currentEngagement,
    toggleArchiveLock,
    openExportModal,
  } = useAuditStore();

  const isLocked = currentEngagement.isPermanentlyArchived;
  const remainingDays = currentEngagement.archiveRemainingDays;
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleExecuteLock = () => {
    toggleArchiveLock();
    setShowConfirmModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Read-Only Terminal Banner when Locked */}
      {isLocked && (
        <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono text-amber-300 tracking-wider">
                FILE PERMANENTLY LOCKED (ISA 230 COMPLIANCE) — READ ONLY
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Audit file assembly sealed under ISA 230. All workpapers, sampling sheets, and review logs are immutable.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openExportModal}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-[0.98]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Generate Complete Inspection Export for Regulators</span>
            </button>
            <button
              onClick={toggleArchiveLock}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              title="Partner Regulatory Override"
            >
              <Unlock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Archival Countdown Terminal */}
      <div
        className={`bg-white rounded-xl border p-6 shadow-sm transition-all ${
          isLocked ? 'border-slate-400 bg-slate-50/50' : 'border-slate-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Archive className="w-5 h-5 text-blue-600" />
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                ISA 230 Regulatory Archive & File Lock Terminal
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Under International Standard on Auditing (ISA 230), the auditor shall assemble audit documentation in an audit file and complete the administrative process of assembling the final audit file on a timely basis (ordinarily not more than 60 days after the auditor&apos;s report date).
            </p>
          </div>

          {/* 60-Day Digital Countdown Timer Widget */}
          <div className="flex items-center gap-4 bg-slate-900 text-white p-4 rounded-xl border border-slate-800 shadow-md">
            <div className="w-14 h-14 rounded-full border-4 border-blue-500 flex items-center justify-center font-mono font-black text-lg text-blue-400 shrink-0">
              {isLocked ? '0' : remainingDays}
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                {isLocked ? 'STATUS: IMMUTABLY SEALED' : 'COUNTDOWN TO MANDATORY LOCK'}
              </div>
              <div className="text-sm font-bold text-slate-100 font-mono mt-0.5">
                {isLocked
                  ? 'Regulatory Lock Enforced'
                  : `${remainingDays} Days Remaining (ISA 230)`}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Anchored to Partner Report Sign-Off Date
              </div>
            </div>
          </div>
        </div>

        {/* Lock Controls & Partner Early Trigger */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono block">
              Partner Authorized Early Archive Lock Trigger
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Once commercial deliverables are dispatched and client confirmation receipts are returned, the Partner may immediately execute an authorized early archive lock before the statutory 60-day limit.
            </p>

            <div className="pt-2">
              {!isLocked ? (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Execute Authorized Early Archive Lock</span>
                </button>
              ) : (
                <span className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Audit File Sealed by Partner Tariq Al-Mansoor, FCA
                </span>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono block">
              Regulator Quality Assurance Inspection
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generates an immutable inspection bundle conforming to State of Qatar Ministry of Commerce and Industry (MOCI) and Qatar Financial Markets Authority (QFMA) oversight standards.
            </p>

            <div className="pt-2">
              <button
                onClick={openExportModal}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Generate Complete Inspection Export for Regulators</span>
              </button>
            </div>
          </div>
        </div>

        {/* Full Immutable Audit Trail Log */}
        <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Immutable Chronological Audit Trail Log (ISA 230)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {currentEngagement.auditTrail.length} Certified Events
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Phase</th>
                  <th className="py-2.5 px-3">Auditor / Actor</th>
                  <th className="py-2.5 px-3">Action Recorded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {currentEngagement.auditTrail.map((at) => (
                  <tr key={at.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">{at.timestamp}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                        {at.phase}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{at.performedBy}</td>
                    <td className="py-2.5 px-3 text-slate-700">{at.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Early Lock */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-300 overflow-hidden animate-in fade-in duration-150">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-sm">Confirm Permanent File Lock</h4>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6 text-xs text-slate-800 space-y-3">
              <p>
                Locking the file enforces permanent immutable read-only status under ISA 230. No further modifications, deletions, or additional workpapers can be uploaded without authorized quality partner clearance.
              </p>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Partner Confirmation Passcode:
                </label>
                <input
                  type="password"
                  placeholder="Enter partner PIN..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteLock}
                  className="px-4 py-1.5 rounded bg-slate-900 text-white font-bold"
                >
                  Authorize File Lock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

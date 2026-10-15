'use client';

import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import { AlertCircle, Send, FileText } from 'lucide-react';

export function HoldingLetterModal() {
  const {
    holdingLetterModalOpen,
    closeHoldingLetterModal,
    dispatchHoldingLetter,
    selectedConfirmationForHolding,
    currentEngagement,
  } = useAuditStore();

  const [letterNotes, setLetterNotes] = useState(
    'Please instruct Qatar National Bank (QNB) Corporate Operations to expedite their direct confirmation response to our West Bay offices. In accordance with ISA 505, our final Independent Auditor\'s Report and opinion cannot be executed without direct confirmation of all material deposit accounts, credit lines, and pledged collateral.'
  );

  if (!holdingLetterModalOpen) return null;

  const targetConf =
    selectedConfirmationForHolding ||
    currentEngagement.confirmations.find((c) => c.isCritical && c.status === 'Pending') ||
    currentEngagement.confirmations[0];

  const handleDispatch = () => {
    dispatchHoldingLetter(targetConf ? targetConf.recipientName : 'Client Management', letterNotes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-red-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="bg-red-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-300" />
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                Mandatory Holding Letter Generator (ISA 505 / ISA 700)
              </h3>
              <p className="text-[11px] text-red-200">
                Holding Audit Sign-Off in Suspense Pending Overdue Confirmation
              </p>
            </div>
          </div>
          <button
            onClick={closeHoldingLetterModal}
            className="text-red-300 hover:text-white text-lg font-mono"
          >
            ✕
          </button>
        </div>

        {/* Letter Preview Body */}
        <div className="p-6 space-y-4 text-xs text-slate-800">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5">
            <FileText className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-red-800">
              <strong>Regulatory Hard Blocker Triggered:</strong> Target institution{' '}
              <strong className="underline">{targetConf?.recipientName}</strong> (Balance: QAR{' '}
              {targetConf?.balanceQAR.toLocaleString()}) has not returned the statutory audit circularization.
              Under ISA 505, partner report issuance is legally blocked until a formal Holding Notice is served or confirmation received.
            </div>
          </div>

          <div className="space-y-3 font-sans border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div className="text-slate-500 font-mono text-[10px]">
              DATE: 28 January 2027 | REF: HL-ISA505-
              {currentEngagement.code}
            </div>
            <div>
              <div className="font-bold text-slate-900">TO: The Board of Directors & Chief Financial Officer</div>
              <div className="text-slate-700">{currentEngagement.clientLegalName}</div>
              <div className="text-slate-500 text-[11px]">Doha, State of Qatar</div>
            </div>

            <div className="font-bold text-slate-900 pt-1">
              SUBJECT: URGENT AUDIT HOLDING NOTICE — OUTSTANDING THIRD-PARTY CONFIRMATION ({targetConf?.recipientName})
            </div>

            <p className="text-slate-700 leading-relaxed">
              We write to formally advise that fieldwork for the statutory financial statement audit of{' '}
              <strong>{currentEngagement.clientLegalName}</strong> for the year ended{' '}
              <strong>{currentEngagement.statutoryYearEnd}</strong> has reached the partner sign-off milestone.
              However, despite initial circularization and follow-ups, we have not received direct confirmation from{' '}
              <strong>{targetConf?.recipientName}</strong>.
            </p>

            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-700">
                Specific Client Directive & Follow-Up Instructions:
              </label>
              <textarea
                value={letterNotes}
                onChange={(e) => setLetterNotes(e.target.value)}
                rows={3}
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="pt-2 text-[11px] text-slate-600">
              Sincerely,
              <br />
              <strong>Tariq Al-Mansoor, FCA</strong>
              <br />
              Senior Audit Partner, STE Audit & Assurance Partners (Qatar)
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Dispatch will log formal notice to client portal & audit trail.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={closeHoldingLetterModal}
              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDispatch}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch Holding Letter to Client Management
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

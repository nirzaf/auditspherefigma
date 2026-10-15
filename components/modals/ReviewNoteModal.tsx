'use client';

import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import { AlertTriangle, CornerDownRight } from 'lucide-react';

export function ReviewNoteModal() {
  const { reviewNoteModalOpen, closeReviewNoteModal, addReviewNote, currentEngagement } = useAuditStore();

  const [selectedFsliId, setSelectedFsliId] = useState<string>(
    currentEngagement.fsliList[0]?.id || ''
  );
  const [reasonText, setReasonText] = useState('');
  const [error, setError] = useState('');

  if (!reviewNoteModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonText.trim()) {
      setError('A mandatory rejection reason and clear rework instruction is required under ISA review standards.');
      return;
    }
    addReviewNote(selectedFsliId, reasonText.trim());
    setReasonText('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-amber-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm tracking-tight">Initiate Audit Rework Loop & Review Note</h3>
          </div>
          <button
            onClick={closeReviewNoteModal}
            className="text-slate-400 hover:text-white text-lg font-mono"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-800">
          <p className="text-slate-600">
            Raising a review note will immediately change the FSLI status to{' '}
            <strong className="text-amber-700">Under Rework</strong> and assign an action item to the preparer.
          </p>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Target Financial Statement Line Item (FSLI):
            </label>
            <select
              value={selectedFsliId}
              onChange={(e) => setSelectedFsliId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500"
            >
              {currentEngagement.fsliList.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.code} — {f.name} (Assigned: {f.assignedAuditor})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mandatory Reviewer Finding & Rework Instructions:
            </label>
            <textarea
              value={reasonText}
              onChange={(e) => {
                setReasonText(e.target.value);
                if (error) setError('');
              }}
              rows={4}
              placeholder="e.g. Sample #14 lacks vendor commercial invoice. Inquire with client for warehouse goods receipt and recalculate NRV provision..."
              className="w-full p-3 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
            {error && <p className="text-red-600 text-[11px] mt-1 font-medium">{error}</p>}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-800 flex items-start gap-2">
            <CornerDownRight className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              The FSLI workprogram cannot be submitted for Partner Sign-Off until all manager review notes are resolved.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeReviewNoteModal}
              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              Issue Review Note & Rework
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

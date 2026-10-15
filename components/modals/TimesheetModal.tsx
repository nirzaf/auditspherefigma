'use client';

import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import { Clock } from 'lucide-react';

export function TimesheetModal() {
  const { timesheetModalOpen, closeTimesheetModal, addTimesheetEntry, currentEngagement } = useAuditStore();

  const [staffName, setStaffName] = useState('Sarah Ahmed, CPA');
  const [role, setRole] = useState<'Partner' | 'Manager' | 'Senior' | 'Associate'>('Senior');
  const [fsliCode, setFsliCode] = useState('PL-101');
  const [hours, setHours] = useState('4.5');
  const [notes, setNotes] = useState('Vouching revenue contracts against warehouse shipments.');

  if (!timesheetModalOpen) return null;

  const rateTable = {
    Partner: 1000,
    Manager: 750,
    Senior: 500,
    Associate: 200,
  };

  const currentRate = rateTable[role];
  const parsedHours = parseFloat(hours) || 0;
  const costQAR = parsedHours * currentRate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTimesheetEntry({
      staffName,
      role,
      engagementId: currentEngagement.id,
      fsliCode,
      hours: parsedHours,
      chargeOutRateQAR: currentRate,
      date: new Date().toISOString().split('T')[0],
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm tracking-tight">Log Billable Audit Hours (Module 5)</h3>
          </div>
          <button
            onClick={closeTimesheetModal}
            className="text-slate-400 hover:text-white text-lg font-mono"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-800">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Staff Member & Tier:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="p-2 border border-slate-300 rounded-lg text-xs"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
              >
                <option value="Partner">Partner (QAR 1,000/hr)</option>
                <option value="Manager">Manager (QAR 750/hr)</option>
                <option value="Senior">Senior (QAR 500/hr)</option>
                <option value="Associate">Associate (QAR 200/hr)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Assigned FSLI / Section:
            </label>
            <select
              value={fsliCode}
              onChange={(e) => setFsliCode(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              <option value="PL-101">PL-101 Revenue from Contracts</option>
              <option value="PL-102">PL-102 Cost of Goods Sold (COGS)</option>
              <option value="PL-103">PL-103 Administrative Expenses</option>
              <option value="BS-201">BS-201 Property, Plant & Equipment</option>
              <option value="BS-202">BS-202 Merchandise Inventory</option>
              <option value="BS-203">BS-203 Trade Receivables & ECL</option>
              <option value="BS-204">BS-204 Cash & Bank Balances</option>
              <option value="GEN">GEN General Planning & Reporting</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Hours Logged:
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="24"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 font-mono">
              <span>Rate: QAR {currentRate}/hr</span>
              <span className="font-bold text-blue-700">Cost: QAR {costQAR.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Procedure Description / Timesheet Notes:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeTimesheetModal}
              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              Record Timesheet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import { FSLIRow, AuditAssertion } from '@/types/audit';
import {
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  CheckSquare,
  Square,
  Plus,
  Paperclip,
  FolderArchive,
  ArrowRight,
  Calculator,
  ShieldAlert,
  X,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';

export function Screen03Fieldwork() {
  const {
    currentEngagement,
    selectedFSLI,
    activeDrawer,
    openWorkprogramDrawer,
    openAnalyticalDrawer,
    closeDrawer,
    toggleAssertion,
    updateSampling,
    addCustomProcedure,
    submitFSLIForReview,
    updatePhysicalBinderRef,
    navigateToScreen,
    openDocumentPreview,
  } = useAuditStore();

  const [activeEvidenceTab, setActiveEvidenceTab] = useState<'digital' | 'physical'>('digital');
  const [newProcTitle, setNewProcTitle] = useState('');
  const [newProcRef, setNewProcRef] = useState('');
  const [showAddProc, setShowAddProc] = useState(false);

  // Split FSLIs into P&L and Balance Sheet
  const plList = currentEngagement.fsliList.filter((f) => f.category === 'PL');
  const bsList = currentEngagement.fsliList.filter((f) => f.category === 'BS');

  const handleAddProcedure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFSLI || !newProcTitle.trim()) return;
    addCustomProcedure(selectedFSLI.id, newProcTitle.trim(), newProcRef.trim());
    setNewProcTitle('');
    setNewProcRef('');
    setShowAddProc(false);
  };

  return (
    <div className="space-y-6 relative">
      {/* Top Section Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Fieldwork Execution & Split FSLI Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Split-screen financial statement table under ISA 330 & 500. Select any line item to execute substantive workprograms or analytical reviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-mono block">Performance Materiality (TE)</span>
            <span className="text-xs font-mono font-bold text-slate-900">
              QAR {currentEngagement.materiality.tolerableErrorQAR.toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => navigateToScreen('phase-4')}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Manager Review (Phase 4)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Split Financial Statement Tables Container */}
      <div className="space-y-6">
        {/* UPPER VIEWPORT: Profit & Loss (P&L) Statement */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider font-mono">
                Upper Viewport: Statement of Profit or Loss (IFRS / IAS 1)
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              31 Dec 2026 CY vs 31 Dec 2025 PY (QAR)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">FSLI Code & Name</th>
                  <th className="py-2.5 px-4 font-semibold text-right">CY Balance (QAR)</th>
                  <th className="py-2.5 px-4 font-semibold text-right">PY Comparative (QAR)</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Variance (%)</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Inherent Risk</th>
                  <th className="py-2.5 px-4 font-semibold">Active Concurrency</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Action Triggers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {plList.map((fsli) => (
                  <FSLITableRow
                    key={fsli.id}
                    fsli={fsli}
                    onOpenWorkprogram={() => openWorkprogramDrawer(fsli.id)}
                    onOpenAnalytical={() => openAnalyticalDrawer(fsli.id)}
                    isSelected={selectedFSLI?.id === fsli.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LOWER VIEWPORT: Balance Sheet (B/S) Statement */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-800 text-white px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider font-mono">
                Lower Viewport: Statement of Financial Position (Balance Sheet)
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Assets, Liabilities & Equity (QAR)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">FSLI Code & Name</th>
                  <th className="py-2.5 px-4 font-semibold text-right">CY Balance (QAR)</th>
                  <th className="py-2.5 px-4 font-semibold text-right">PY Comparative (QAR)</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Variance (%)</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Inherent Risk</th>
                  <th className="py-2.5 px-4 font-semibold">Active Concurrency</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Action Triggers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bsList.map((fsli) => (
                  <FSLITableRow
                    key={fsli.id}
                    fsli={fsli}
                    onOpenWorkprogram={() => openWorkprogramDrawer(fsli.id)}
                    onOpenAnalytical={() => openAnalyticalDrawer(fsli.id)}
                    isSelected={selectedFSLI?.id === fsli.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DRAWER 1: Substantive Workprogram Execution */}
      {activeDrawer === 'workprogram' && selectedFSLI && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[620px] bg-white border-l border-slate-300 shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  {selectedFSLI.code}
                </span>
                <span className="text-xs text-slate-400">Substantive Workprogram</span>
              </div>
              <h3 className="font-bold text-sm text-slate-100 mt-1 truncate max-w-md">
                {selectedFSLI.name}
              </h3>
            </div>
            <button
              onClick={closeDrawer}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-800">
            {/* Status & Assigned Lead */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 text-[11px] block">Assigned Auditor</span>
                <span className="font-semibold text-slate-900">{selectedFSLI.assignedAuditor}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[11px] block">Testing Status</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                    selectedFSLI.testingStatus === 'Ready for Review'
                      ? 'bg-blue-100 text-blue-800'
                      : selectedFSLI.testingStatus === 'Under Rework'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {selectedFSLI.testingStatus}
                </span>
              </div>
            </div>

            {/* 1. Audit Assertions Checklist */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider font-mono">
                  1. ISA 500 Procedural Assertions Checklist
                </h4>
                <span className="text-[10px] text-slate-500">
                  {selectedFSLI.assertions.filter((a) => a.tested).length} /{' '}
                  {selectedFSLI.assertions.length} Tested
                </span>
              </div>

              <div className="space-y-2">
                {selectedFSLI.assertions.map((assertion) => (
                  <div
                    key={assertion.id}
                    onClick={() => toggleAssertion(selectedFSLI.id, assertion.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      assertion.tested
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {assertion.tested ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="font-bold text-slate-900">{assertion.name}</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono ${
                          assertion.tested ? 'text-emerald-700 font-semibold' : 'text-slate-400'
                        }`}
                      >
                        {assertion.tested ? 'Substantiated' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 pl-6">
                      {assertion.notes}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Custom Ad-Hoc Audit Procedure Row */}
              <div className="mt-3">
                {!showAddProc ? (
                  <button
                    onClick={() => setShowAddProc(true)}
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-semibold active:scale-[0.98] transition-transform"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Custom Ad-Hoc Audit Procedure</span>
                  </button>
                ) : (
                  <form onSubmit={handleAddProcedure} className="p-3 bg-slate-50 border border-blue-200 rounded-lg space-y-2">
                    <span className="font-bold text-[11px] text-slate-800">New Ad-Hoc Risk Procedure:</span>
                    <input
                      type="text"
                      placeholder="Procedure title / specific testing instruction..."
                      value={newProcTitle}
                      onChange={(e) => setNewProcTitle(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded text-xs"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Working paper ref (e.g. WP-PL-101-AD)"
                        value={newProcRef}
                        onChange={(e) => setNewProcRef(e.target.value)}
                        className="w-1/2 p-2 bg-white border border-slate-300 rounded text-xs font-mono"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                      >
                        Add Procedure
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddProc(false)}
                        className="px-3 py-2 bg-slate-200 text-slate-700 rounded text-xs font-medium hover:bg-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {selectedFSLI.customProcedures.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {selectedFSLI.customProcedures.map((cp) => (
                      <div
                        key={cp.id}
                        className="p-2 bg-slate-50 border border-slate-200 rounded text-[11px] flex items-center justify-between"
                      >
                        <span className="font-medium text-slate-800">{cp.title}</span>
                        <span className="font-mono text-blue-600 font-semibold">{cp.reference}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 2. Built-in Sampling Engine Tool */}
            {selectedFSLI.sampling && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-blue-600" />
                    <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider font-mono">
                      2. Statistical Sampling Engine (ISA 530)
                    </h4>
                  </div>
                  <select
                    value={selectedFSLI.sampling.method}
                    onChange={(e) =>
                      updateSampling(selectedFSLI.id, { method: e.target.value as any })
                    }
                    className="p-1 bg-white border border-slate-300 rounded text-[11px] font-mono font-medium"
                  >
                    <option value="Monetary Unit Sampling (MUS)">Monetary Unit Sampling (MUS)</option>
                    <option value="Systematic Random">Systematic Random</option>
                    <option value="Attribute Sampling">Attribute Sampling</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-500">Population Value:</span>
                    <div className="font-mono font-bold text-slate-900">
                      QAR {selectedFSLI.sampling.populationValueQAR.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-500">Sample Units Selected:</span>
                    <div className="font-mono font-bold text-blue-700">
                      {selectedFSLI.sampling.sampleSize} Sample Items
                    </div>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-500">Exceptions Identified:</span>
                    <div className="font-mono font-bold text-amber-700">
                      {selectedFSLI.sampling.exceptionsFound} Errors
                    </div>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-500">Tolerable Misstatement:</span>
                    <div className="font-mono font-bold text-slate-900">
                      QAR {selectedFSLI.sampling.tolerableMisstatementQAR.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="p-2 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900 font-mono">
                  <strong>Auditor Conclusion:</strong> {selectedFSLI.sampling.conclusion}
                </div>
              </div>
            )}

            {/* 3. Hybrid Evidence Cross-Reference Module */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="flex border-b border-slate-200 bg-slate-50">
                <button
                  onClick={() => setActiveEvidenceTab('digital')}
                  className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    activeEvidenceTab === 'digital'
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Tab A: Digital Evidence Dropzone ({selectedFSLI.digitalEvidenceCount})</span>
                </button>
                <button
                  onClick={() => setActiveEvidenceTab('physical')}
                  className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    activeEvidenceTab === 'physical'
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FolderArchive className="w-3.5 h-3.5" />
                  <span>Tab B: Physical Binder Index Tracker</span>
                </button>
              </div>

              <div className="p-4 bg-white">
                {activeEvidenceTab === 'digital' ? (
                  <div className="space-y-3">
                    <button
                      onClick={() =>
                        openDocumentPreview({
                          fileName: `${selectedFSLI.code}_Vouching_Schedule_Dec2026.xlsx`,
                          folder: '03_Fieldwork & Testing',
                          fileType: 'XLSX',
                          uploadedBy: selectedFSLI.assignedAuditor,
                          uploadedAt: '2027-01-18 12:00 AST',
                          shaHash: '0x4d91c2f83a7710bd552e00913fde881a',
                          sizeKB: 2240,
                          description: `Substantive vouching schedule for ${selectedFSLI.name}, auto-linked to Folder 03_Fieldwork & Testing.`,
                          linkedWorkbench: 'fieldwork',
                        })
                      }
                      className="w-full border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 hover:border-blue-300 transition-colors"
                      title="Upload digital workpapers"
                    >
                      <Paperclip className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <span className="font-semibold text-slate-700 block">
                        Drag and drop digital workpapers (PDF, Excel TB, PBC links)
                      </span>
                      <span className="text-[10px] text-slate-400">Auto-linked to Folder 03_Fieldwork</span>
                    </button>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-200">
                        <span className="font-medium text-slate-800">
                          {selectedFSLI.code}_Vouching_Schedule_Dec2026.xlsx
                        </span>
                        <button
                          onClick={() =>
                            openDocumentPreview({
                              fileName: `${selectedFSLI.code}_Vouching_Schedule_Dec2026.xlsx`,
                              folder: '03_Fieldwork & Testing',
                              fileType: 'XLSX',
                              uploadedBy: selectedFSLI.assignedAuditor,
                              uploadedAt: '2027-01-18 12:00 AST',
                              shaHash: '0x4d91c2f83a7710bd552e00913fde881a',
                              sizeKB: 2240,
                              description: `Substantive vouching schedule for ${selectedFSLI.name} with recalculation references.`,
                              linkedWorkbench: 'fieldwork',
                            })
                          }
                          className="text-blue-600 font-mono text-[10px] hover:underline"
                        >
                          View Attachment
                        </button>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-200">
                        <span className="font-medium text-slate-800">
                          {selectedFSLI.code}_Signed_Vendor_Invoices_Bundle.pdf
                        </span>
                        <button
                          onClick={() =>
                            openDocumentPreview({
                              fileName: `${selectedFSLI.code}_Signed_Vendor_Invoices_Bundle.pdf`,
                              folder: '03_Fieldwork & Testing',
                              fileType: 'PDF',
                              uploadedBy: selectedFSLI.assignedAuditor,
                              uploadedAt: '2027-01-19 09:45 AST',
                              shaHash: '0x77b8192a00cfa882910488921bba8821',
                              sizeKB: 5180,
                              description: `Signed vendor invoice bundle supporting ${selectedFSLI.name} existence testing.`,
                              linkedWorkbench: 'fieldwork',
                            })
                          }
                          className="text-blue-600 font-mono text-[10px] hover:underline"
                        >
                          View Attachment
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Physical Binder Location & Shelf Reference:
                    </label>
                    <input
                      type="text"
                      value={selectedFSLI.physicalBinderRef || ''}
                      onChange={(e) => updatePhysicalBinderRef(selectedFSLI.id, e.target.value)}
                      placeholder="e.g. Box Index: X-1, Shelf B, Box 3"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-[10px] text-slate-500">
                      Cross-referenced during State of Qatar Ministry audit file inspections.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Drawer Footer Action */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-500 font-mono">
              Ready for submission to Manager Review
            </span>
            <button
              onClick={() => submitFSLIForReview(selectedFSLI.id)}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
            >
              Submit Completed Workpaper for Review
            </button>
          </div>
        </div>
      )}

      {/* DRAWER 2: Analytical Review & ISA 570 Going Concern */}
      {activeDrawer === 'analytical' && selectedFSLI && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[620px] bg-white border-l border-slate-300 shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-200">
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  ISA 520 / 570
                </span>
                <span className="text-xs text-slate-400">Analytical Review & Going Concern</span>
              </div>
              <h3 className="font-bold text-sm text-slate-100 mt-1 truncate max-w-md">
                {selectedFSLI.name} ({selectedFSLI.code})
              </h3>
            </div>
            <button
              onClick={closeDrawer}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-800">
            {/* Variance Bar */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[11px] block">Period-on-Period Fluctuation:</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black font-mono text-slate-900">
                  {selectedFSLI.variancePercent > 0 ? `+${selectedFSLI.variancePercent}%` : `${selectedFSLI.variancePercent}%`}
                </span>
                <div className="text-right font-mono text-xs text-slate-600">
                  <div>CY: QAR {selectedFSLI.currentYearBalanceQAR.toLocaleString()}</div>
                  <div>PY: QAR {selectedFSLI.priorYearBalanceQAR.toLocaleString()}</div>
                </div>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full ${
                    Math.abs(selectedFSLI.variancePercent) > 15 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.abs(selectedFSLI.variancePercent) * 3)}%` }}
                />
              </div>
            </div>

            {/* Core Financial Ratios */}
            <div>
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider font-mono mb-2">
                Key Analytical Financial Ratios
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-slate-500 text-[11px]">Current Ratio:</span>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">1.84x</div>
                  <span className="text-[10px] text-emerald-600 font-medium">Sound liquidity</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-slate-500 text-[11px]">Gross Profit Margin:</span>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">32.46%</div>
                  <span className="text-[10px] text-slate-500 font-mono">PY: 35.34% (-2.88%)</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-slate-500 text-[11px]">Inventory Turnover Days:</span>
                  <div className="font-mono font-bold text-amber-700 text-sm mt-0.5">184 Days</div>
                  <span className="text-[10px] text-amber-600 font-medium">Elevated holding period</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-slate-500 text-[11px]">Operating Cash Flow Coverage:</span>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">2.12x</div>
                  <span className="text-[10px] text-emerald-600 font-medium">Positive coverage</span>
                </div>
              </div>
            </div>

            {/* ISA 570 Going Concern Checklist */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider font-mono">
                  ISA 570 Going Concern Assessment
                </h4>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No operating losses or negative operating cash flows identified.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bank loan covenants at QNB remain in 100% compliance.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Subsequent retail sales through Jan 2027 corroborate continued viability.</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-600 font-mono border-t border-slate-200">
                Auditor Conclusion: No material uncertainty exists regarding the entity&apos;s ability to continue as a going concern for at least 12 months from report date.
              </div>
            </div>
          </div>

          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end shrink-0">
            <button
              onClick={closeDrawer}
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
            >
              Close Analytical Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FSLITableRow({
  fsli,
  onOpenWorkprogram,
  onOpenAnalytical,
  isSelected,
}: {
  fsli: FSLIRow;
  onOpenWorkprogram: () => void;
  onOpenAnalytical: () => void;
  isSelected: boolean;
}) {
  const isPositiveVariance = fsli.variancePercent >= 0;

  return (
    <tr
      className={`hover:bg-slate-50/80 transition-colors ${
        isSelected ? 'bg-blue-50/50' : ''
      }`}
    >
      {/* Code & Name */}
      <td className="py-3 px-4 font-medium text-slate-900">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-slate-500 font-semibold">{fsli.code}</span>
          <span className="font-semibold text-slate-800">{fsli.name}</span>
        </div>
      </td>

      {/* CY Balance */}
      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
        QAR {fsli.currentYearBalanceQAR.toLocaleString()}
      </td>

      {/* PY Balance */}
      <td className="py-3 px-4 text-right font-mono text-slate-500">
        QAR {fsli.priorYearBalanceQAR.toLocaleString()}
      </td>

      {/* Variance */}
      <td className="py-3 px-4 text-right font-mono font-semibold">
        <span
          className={`inline-flex items-center gap-1 ${
            Math.abs(fsli.variancePercent) > 20
              ? 'text-red-700'
              : Math.abs(fsli.variancePercent) > 10
              ? 'text-amber-700'
              : 'text-slate-700'
          }`}
        >
          {isPositiveVariance ? (
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
          )}
          <span>{isPositiveVariance ? `+${fsli.variancePercent}%` : `${fsli.variancePercent}%`}</span>
        </span>
      </td>

      {/* Inherent Risk */}
      <td className="py-3 px-4 text-center">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
            fsli.riskLevel === 'High'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : fsli.riskLevel === 'Medium'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {fsli.riskLevel} Risk
        </span>
      </td>

      {/* Concurrency Indicator */}
      <td className="py-3 px-4">
        {fsli.concurrentAuditor ? (
          <div
            className="flex items-center gap-1.5 text-[11px] text-slate-600"
            title={fsli.concurrentAuditor.action}
          >
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[9px] font-mono shrink-0 shadow-sm">
              {fsli.concurrentAuditor.avatar}
            </div>
            <span className="truncate max-w-[140px] text-blue-700 font-medium">
              {fsli.concurrentAuditor.name}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 font-mono">Idle</span>
        )}
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={onOpenAnalytical}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-all active:scale-[0.97]"
            title="Open Analytical Review & Going Concern"
          >
            AR Analytical
          </button>
          <button
            onClick={onOpenWorkprogram}
            className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-all active:scale-[0.97] shadow-sm"
            title="Open Substantive Audit Workprogram"
          >
            Audit Workprogram
          </button>
        </div>
      </td>
    </tr>
  );
}

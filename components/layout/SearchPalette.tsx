'use client';

import React, { useMemo, useState } from 'react';
import { useAuditStore, ScreenView } from '@/lib/store';
import { Search, FileSpreadsheet, AlertTriangle, FolderTree, Users, ArrowRight } from 'lucide-react';

export interface SearchHit {
  key: string;
  kind: 'FSLI' | 'Review Note' | 'Confirmation' | 'Document' | 'Task' | 'Phase';
  title: string;
  detail: string;
  go: () => void;
}

export function buildSearchHits(query: string, store: ReturnType<typeof useAuditStore>): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const { currentEngagement, workflowTasks, navigateToScreen, openWorkprogramDrawer, openAnalyticalDrawer, openDocumentPreview } = store;
  const hits: SearchHit[] = [];

  currentEngagement.fsliList.forEach((f) => {
    if (`${f.code} ${f.name} ${f.assignedAuditor}`.toLowerCase().includes(q)) {
      hits.push({
        key: `fsli-${f.id}`,
        kind: 'FSLI',
        title: `${f.code} — ${f.name}`,
        detail: `${f.testingStatus} · QAR ${f.currentYearBalanceQAR.toLocaleString()}`,
        go: () => {
          navigateToScreen('phase-3');
          openAnalyticalDrawer(f.id);
        },
      });
      hits.push({
        key: `fsli-wp-${f.id}`,
        kind: 'FSLI',
        title: `${f.code} Workprogram`,
        detail: `${f.assertions.filter((a) => a.tested).length}/${f.assertions.length} assertions tested`,
        go: () => {
          navigateToScreen('phase-3');
          openWorkprogramDrawer(f.id);
        },
      });
    }
  });

  currentEngagement.reviewNotes.forEach((n) => {
    if (`${n.fsliName} ${n.noteText} ${n.raisedBy}`.toLowerCase().includes(q)) {
      hits.push({
        key: `note-${n.id}`,
        kind: 'Review Note',
        title: `${n.fsliName} — ${n.status}`,
        detail: n.noteText.slice(0, 80),
        go: () => navigateToScreen('phase-4'),
      });
    }
  });

  currentEngagement.confirmations.forEach((c) => {
    if (`${c.type} ${c.recipientName}`.toLowerCase().includes(q)) {
      hits.push({
        key: `conf-${c.id}`,
        kind: 'Confirmation',
        title: `${c.type} — ${c.recipientName}`,
        detail: `${c.status}${c.isCritical ? ' · CRITICAL GATE' : ''}`,
        go: () => navigateToScreen('phase-4'),
      });
    }
  });
  currentEngagement.clientRequests.forEach((r) => {
    if (`${r.title} ${r.description} ${r.status}`.toLowerCase().includes(q)) {
      hits.push({
        key: `pbc-${r.id}`,
        kind: 'Document',
        title: `PBC — ${r.title}`,
        detail: `${r.status} · due ${r.deadline}`,
        go: () => {
          navigateToScreen('client-portal');
          if (r.uploadedFileName) {
            openDocumentPreview({
              fileName: r.uploadedFileName,
              folder: '02_Trial Balance & Schedules',
              fileType: 'PDF',
              uploadedBy: 'Client Audit Liaison',
              uploadedAt: r.uploadedAt || r.deadline,
              shaHash: '0x9c41f2a77bd310e6622d00391cde554c',
              sizeKB: 1840,
              description: `Client-uploaded ${r.title} schedule reviewed against the general ledger.`,
              linkedWorkbench: 'client-portal',
            });
          }
        },
      });
    }
  });

  workflowTasks
    .filter((t) => t.engagementId === currentEngagement.id)
    .forEach((t) => {
      if (`${t.title} ${t.owner} ${t.group}`.toLowerCase().includes(q)) {
        const screens = ['phase-1', 'phase-2', 'phase-3', 'phase-4', 'phase-5', 'phase-6', 'phase-7'];
        const target = (screens[t.phase - 1] || 'phase-3') as ScreenView;
        hits.push({
          key: `task-${t.id}`,
          kind: 'Task',
          title: `${t.title}`,
          detail: `${t.status} · ${t.owner} · Phase ${t.phase}`,
          go: () => navigateToScreen(target),
        });
      }
    });

  return hits.slice(0, 12);
}

const kindIcon = {
  FSLI: FileSpreadsheet,
  'Review Note': AlertTriangle,
  Confirmation: FolderTree,
  Document: FolderTree,
  Task: Users,
  Phase: ArrowRight,
};

export function SearchPalette({ query, onNavigate }: { query: string; onNavigate: () => void }) {
  const store = useAuditStore();
  const hits = useMemo(() => buildSearchHits(query, store), [query, store]);
  const [activeIdx, setActiveIdx] = useState(0);

  if (query.trim().length < 2) return null;

  const choose = (hit: SearchHit) => {
    hit.go();
    onNavigate();
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-[420px] max-w-[90vw] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1.5 flex items-center gap-1.5">
        <Search className="w-3 h-3" />
        {hits.length === 0 ? `No results for "${query}"` : `${hits.length} result${hits.length > 1 ? 's' : ''}`}
      </div>
      <div className="space-y-1 max-h-80 overflow-y-auto">
        {hits.map((hit, idx) => {
          const Icon = kindIcon[hit.kind];
          return (
            <button
              key={hit.key}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={() => choose(hit)}
              className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-start gap-2.5 ${
                idx === activeIdx
                  ? 'bg-blue-600/25 border border-blue-500/40 text-white'
                  : 'hover:bg-slate-800 text-slate-300 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="font-semibold text-slate-100 truncate">{hit.title}</div>
                <div className="text-[11px] text-slate-400 truncate">{hit.detail}</div>
                <span className="text-[10px] font-mono text-slate-500">{hit.kind}</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="px-3 py-1.5 text-[10px] text-slate-500 font-mono">Click a result to jump to its workbench</div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import { PracticeTemplate } from '@/types/audit';
import { getPhaseMeta, roleBadgeClass } from '@/lib/workflow-meta';
import {
  Layers,
  ShieldCheck,
  CheckCircle2,
  Pin,
  Rocket,
  Users,
  Clock,
  GitBranch,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Info,
  Lock,
} from 'lucide-react';

export function ScreenPracticeTemplates() {
  const { practiceTemplates, instantiateTemplate, engagements, currentEngagement, navigateToScreen } =
    useAuditStore();

  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(practiceTemplates[0]?.id || null);
  const [selectedEngagement, setSelectedEngagement] = useState<string>(currentEngagement.id);

  const approvedCount = practiceTemplates.filter((t) => t.status === 'Approved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Firm Practice Management</span>
              <span>/</span>
              <span className="font-mono text-blue-600 font-semibold">Reusable Templates</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Reusable Practice Templates
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              Administrator-approved, versioned task templates by engagement type and industry. A template revision is
              pinned to each engagement; later template edits never silently rewrite existing work, and templates can
              never remove mandatory domain gates.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-medium block">Approved Templates</span>
              <span className="text-lg font-bold font-mono text-slate-900">
                {approvedCount}/{practiceTemplates.length}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <span>
            Instantiating a template pins that exact revision to the engagement. Tasks marked with a{' '}
            <strong className="inline-flex items-center gap-1 text-amber-700">
              <ShieldCheck className="w-3 h-3" /> Gate
            </strong>{' '}
            badge mirror mandatory regulatory clearances — they still require the authorized domain command.
          </span>
        </div>
      </div>

      {/* Template library */}
      <div className="space-y-3">
        {practiceTemplates.map((tpl) => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            expanded={expandedTemplate === tpl.id}
            onToggle={() => setExpandedTemplate(expandedTemplate === tpl.id ? null : tpl.id)}
            engagements={engagements}
            selectedEngagement={selectedEngagement}
            setSelectedEngagement={setSelectedEngagement}
            onInstantiate={() => instantiateTemplate(tpl.id, selectedEngagement)}
          />
        ))}
      </div>

      {/* Link back to the workflow dashboard */}
      <div className="flex justify-end">
        <button
          onClick={() => navigateToScreen('workflow-dashboard')}
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          Back to Engagement Workflow <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}


// ---------------------------------------------------------------------------
// Individual template card with grouped task breakdown
// ---------------------------------------------------------------------------
function TemplateCard({
  template,
  expanded,
  onToggle,
  engagements,
  selectedEngagement,
  setSelectedEngagement,
  onInstantiate,
}: {
  template: PracticeTemplate;
  expanded: boolean;
  onToggle: () => void;
  engagements: { id: string; clientLegalName: string; code: string }[];
  selectedEngagement: string;
  setSelectedEngagement: (id: string) => void;
  onInstantiate: () => void;
}) {
  const totalTasks = template.groups.reduce((acc, g) => acc + g.tasks.length, 0);
  const totalHours = template.groups.reduce(
    (acc, g) => acc + g.tasks.reduce((a, t) => a + t.effortHours, 0),
    0
  );
  const gateCount = template.groups.reduce(
    (acc, g) => acc + g.tasks.filter((t) => t.isGate).length,
    0
  );
  const isPinnedToSelected = template.pinnedToEngagementIds.includes(selectedEngagement);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Template header */}
      <button onClick={onToggle} className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50/60 transition-colors">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
          template.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
        }`}>
          <Layers className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-slate-900">{template.name}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono uppercase ${
              template.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}>
              {template.status === 'Approved' ? <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" />Approved</span> : 'Draft'}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              <GitBranch className="w-2.5 h-2.5" />
              {template.revision}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 flex-wrap">
            <span>{template.engagementType}</span>
            <span>· {template.industry}</span>
            <span className="font-mono">· {totalTasks} tasks</span>
            <span className="font-mono">· {totalHours}h est.</span>
            <span className="inline-flex items-center gap-1 font-mono text-amber-600">
              <ShieldCheck className="w-3 h-3" />{gateCount} gates
            </span>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end shrink-0">
          <span className="text-[10px] text-slate-400 font-mono">Pinned to</span>
          <span className="text-xs font-bold text-slate-700 font-mono">{template.pinnedToEngagementIds.length} engagement(s)</span>
        </div>

        {expanded ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
      </button>
      {/* Expanded breakdown */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/40 p-4 space-y-4">
          {/* Approval metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Created</span>
              <span className="font-mono text-slate-700">{template.createdAt}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Approved By</span>
              <span className="text-slate-700">{template.approvedBy || '— pending approval —'}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Approved At</span>
              <span className="font-mono text-slate-700">{template.approvedAt || '—'}</span>
            </div>
          </div>

          {/* Task groups */}
          <div className="space-y-3">
            {template.groups.map((group) => {
              const meta = getPhaseMeta(group.phase);
              return (
                <div key={group.id} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                  <div className={`flex items-center gap-2 px-3 py-2 ${meta.softBg} border-b border-slate-200`}>
                    <span className={`text-[11px] font-bold uppercase tracking-wider font-mono ${meta.accent}`}>
                      Phase {group.phase} · {group.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 ml-auto">{group.tasks.length} tasks</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {group.tasks.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 px-3 py-2">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border font-mono shrink-0 ${roleBadgeClass(item.ownerRole)}`}>
                          {item.ownerRole}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-medium text-slate-800">{item.title}</span>
                            {item.isGate && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-mono uppercase">
                                <ShieldCheck className="w-2.5 h-2.5" />Gate
                              </span>
                            )}
                            {item.clientRequest && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200 font-mono uppercase">
                                <Users className="w-2.5 h-2.5" />Client
                              </span>
                            )}
                          </div>
                          {item.isGate && item.gateLabel && (
                            <span className="text-[10px] text-amber-700 font-mono">↳ {item.gateLabel}</span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0 hidden sm:inline">
                          day {item.dueOffsetDays >= 0 ? `+${item.dueOffsetDays}` : item.dueOffsetDays}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0 inline-flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />{item.effortHours}h
                        </span>
                        {item.dependsOnGroupTaskIds.length > 0 && (
                          <span className="text-[9px] font-mono text-slate-400 shrink-0 hidden md:inline" title={`Depends on ${item.dependsOnGroupTaskIds.join(', ')}`}>
                            ⧉ {item.dependsOnGroupTaskIds.length} dep
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Instantiation controls */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <label className="text-[11px] font-semibold text-slate-600">Pin to engagement:</label>
              <select
                value={selectedEngagement}
                onChange={(e) => setSelectedEngagement(e.target.value)}
                className="p-1.5 bg-white border border-slate-300 rounded-lg text-[11px] font-medium max-w-[240px]"
              >
                {engagements.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.clientLegalName} ({eng.code})
                  </option>
                ))}
              </select>
              {isPinnedToSelected && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                  <Pin className="w-2.5 h-2.5" />Already pinned
                </span>
              )}
            </div>
            <button
              onClick={onInstantiate}
              disabled={template.status !== 'Approved'}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                template.status === 'Approved'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              title={template.status !== 'Approved' ? 'Only administrator-approved templates may be instantiated' : 'Instantiate pinned tasks'}
            >
              {template.status === 'Approved' ? <Rocket className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>Instantiate to Engagement</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

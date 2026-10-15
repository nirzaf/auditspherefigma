'use client';

import React, { useMemo, useState } from 'react';
import { useAuditStore } from '@/lib/store';
import { AuditPhaseId, WorkflowTask } from '@/types/audit';
import {
  PHASE_META,
  getPhaseMeta,
  TASK_STATUS_META,
  KANBAN_COLUMNS,
  roleBadgeClass,
} from '@/lib/workflow-meta';
import {
  LayoutGrid,
  ListChecks,
  Columns3,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CircleDot,
  CheckCircle2,
  Users,
  Building2,
  Info,
  Bot,
  Ban,
  Repeat,
  Layers,
} from 'lucide-react';
import { PROHIBITED_ACTIONS } from '@/lib/workflow-data';

type ViewMode = 'tracker' | 'list' | 'kanban' | 'calendar';
type QueueFilter =
  | 'my-tasks'
  | 'team-work'
  | 'waiting-client'
  | 'under-review'
  | 'rework'
  | 'overdue'
  | 'completed';

const QUEUE_FILTERS: { id: QueueFilter; label: string }[] = [
  { id: 'my-tasks', label: 'My Tasks' },
  { id: 'team-work', label: 'Team Work' },
  { id: 'waiting-client', label: 'Waiting for Client' },
  { id: 'under-review', label: 'Under Review' },
  { id: 'rework', label: 'Rework' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'completed', label: 'Completed' },
];

// "Today" reference for overdue computation (demo baseline aligned to fieldwork).
const TODAY = '2027-01-20';

function isOverdue(task: WorkflowTask): boolean {
  return task.status !== 'completed' && task.dueDate < TODAY;
}

function queueMatches(task: WorkflowTask, filter: QueueFilter, currentUser: string): boolean {
  switch (filter) {
    case 'my-tasks':
      return task.owner === currentUser;
    case 'team-work':
      return task.ownerRole !== 'Client';
    case 'waiting-client':
      return task.status === 'waiting-client' || task.clientRequest;
    case 'under-review':
      return task.status === 'under-review';
    case 'rework':
      return task.status === 'rework';
    case 'overdue':
      return isOverdue(task);
    case 'completed':
      return task.status === 'completed';
    default:
      return true;
  }
}

interface PhaseReadiness {
  phase: AuditPhaseId;
  total: number;
  completed: number;
  percent: number;
  gateTotal: number;
  gateCleared: number;
  gateReady: boolean;
  blockers: string[];
  nextAction: string | null;
  responsibleRole: string;
  dueDate: string | null;
  status: 'complete' | 'active' | 'upcoming';
}

export function ScreenWorkflowDashboard() {
  const {
    currentEngagement,
    workflowTasks,
    activeWorkflowPhase,
    setActiveWorkflowPhase,
    updateWorkflowTaskStatus,
    navigateToWorkbench,
    navigateToScreen,
    userRole,
    automationRules,
    toggleAutomationRule,
    recurringPlans,
    advanceRecurringPlan,
  } = useAuditStore();

  const [viewMode, setViewMode] = useState<ViewMode>('tracker');
  const [queueFilter, setQueueFilter] = useState<QueueFilter>('my-tasks');
  const [expandedPhase, setExpandedPhase] = useState<AuditPhaseId | null>(currentEngagement.currentPhase);
  const [showAutomation, setShowAutomation] = useState(false);
  const [showRecurring, setShowRecurring] = useState(false);

  // The current user is modelled from the active role switcher.
  const currentUser =
    userRole === 'PREPARER'
      ? 'Zaid Al-Kuwari'
      : userRole === 'APPROVER / PARTNER'
      ? 'Tariq Al-Mansoor, FCA'
      : 'Rashid Kamal, ACCA';

  const engTasks = useMemo(
    () => workflowTasks.filter((t) => t.engagementId === currentEngagement.id),
    [workflowTasks, currentEngagement.id]
  );

  // Derive per-phase readiness from server-side-style task records. Phase
  // readiness is computed from records, not mutable task flags, and is kept
  // distinct from mandatory gate satisfaction (Section 6.7).
  const phaseReadiness = useMemo<Record<AuditPhaseId, PhaseReadiness>>(() => {
    const result = {} as Record<AuditPhaseId, PhaseReadiness>;
    for (let p = 1 as AuditPhaseId; p <= 7; p = (p + 1) as AuditPhaseId) {
      const tasks = engTasks.filter((t) => t.phase === p);
      const total = tasks.length;
      const completed = tasks.filter((t) => t.status === 'completed').length;
      const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
      const gateTasks = tasks.filter((t) => t.isGate);
      const gateTotal = gateTasks.length;
      const gateCleared = gateTasks.filter((t) => t.status === 'completed').length;
      const blockers: string[] = [];
      if (tasks.some((t) => t.status === 'rework')) blockers.push('Rework required on one or more items');
      if (tasks.some((t) => t.status === 'waiting-client')) blockers.push('Waiting for client evidence');
      if (tasks.some((t) => isOverdue(t))) blockers.push('Overdue task(s) past due date');
      const nextTask = tasks.find((t) => t.status !== 'completed');
      const earliestDue = tasks
        .filter((t) => t.status !== 'completed')
        .map((t) => t.dueDate)
        .sort()[0];
      result[p] = {
        phase: p,
        total,
        completed,
        percent,
        gateTotal,
        gateCleared,
        gateReady: gateTotal > 0 && gateCleared === gateTotal,
        blockers,
        nextAction: nextTask ? nextTask.title : null,
        responsibleRole: getPhaseMeta(p).responsibleRole,
        dueDate: earliestDue || null,
        status:
          total > 0 && completed === total ? 'complete' : p === currentEngagement.currentPhase ? 'active' : 'upcoming',
      };
    }
    return result;
  }, [engTasks, currentEngagement.currentPhase]);

  const overallPercent =
    engTasks.length === 0
      ? 0
      : Math.round((engTasks.filter((t) => t.status === 'completed').length / engTasks.length) * 100);

  const queuedTasks = useMemo(
    () => engTasks.filter((t) => queueMatches(t, queueFilter, currentUser)),
    [engTasks, queueFilter, currentUser]
  );

  const queueCount = (filter: QueueFilter) =>
    engTasks.filter((t) => queueMatches(t, filter, currentUser)).length;

  return (
    <div className="space-y-6">
      {/* Header — engagement context, overall progress, view switch */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="text-slate-700 font-semibold">{currentEngagement.clientLegalName}</span>
              <span>/</span>
              <span>Engagement Workflow</span>
              <span>/</span>
              <span className="font-mono text-blue-600 font-semibold">{currentEngagement.code}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1 tracking-tight flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-blue-600" />
              Seven-Phase Engagement Workflow
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              A Karbon-style task orchestration layer projected over the authoritative 11-state lifecycle.
              Task completion is tracked separately from mandatory regulatory gate clearance.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Overall task progress */}
            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-medium block">Task Completion</span>
              <span className="text-lg font-bold font-mono text-slate-900">{overallPercent}%</span>
            </div>
            <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${overallPercent}%` }} />
            </div>

            {/* View mode switch */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {(
                [
                  { m: 'tracker', icon: LayoutGrid, label: 'Tracker' },
                  { m: 'list', icon: ListChecks, label: 'Work Queue' },
                  { m: 'kanban', icon: Columns3, label: 'Kanban' },
                  { m: 'calendar', icon: CalendarDays, label: 'Calendar' },
                ] as { m: ViewMode; icon: typeof LayoutGrid; label: string }[]
              ).map(({ m, icon: Icon, label }) => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  title={`${label} view`}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
                    viewMode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Two-layer authority reminder banner */}
        <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <span>
            Display phases are a <strong>presentation projection</strong> of the canonical lifecycle. Completing a
            UI checklist item never substitutes for a verified acceptance, finance, review, Partner, release or
            archive command executed by the authorized domain service.
          </span>
        </div>
      </div>

      {viewMode === 'tracker' && (
        <PhaseTracker
          readiness={phaseReadiness}
          engTasks={engTasks}
          expandedPhase={expandedPhase}
          setExpandedPhase={setExpandedPhase}
          activeWorkflowPhase={activeWorkflowPhase}
          setActiveWorkflowPhase={setActiveWorkflowPhase}
          onUpdateStatus={updateWorkflowTaskStatus}
          onOpenWorkbench={navigateToWorkbench}
          currentPhase={currentEngagement.currentPhase}
        />
      )}

      {viewMode === 'list' && (
        <WorkQueue
          filters={QUEUE_FILTERS}
          queueFilter={queueFilter}
          setQueueFilter={setQueueFilter}
          queueCount={queueCount}
          tasks={queuedTasks}
          onUpdateStatus={updateWorkflowTaskStatus}
          onOpenWorkbench={navigateToWorkbench}
        />
      )}

      {viewMode === 'kanban' && (
        <KanbanBoard
          tasks={engTasks}
          onUpdateStatus={updateWorkflowTaskStatus}
          onOpenWorkbench={navigateToWorkbench}
        />
      )}

      {viewMode === 'calendar' && (
        <CalendarView tasks={engTasks} onOpenWorkbench={navigateToWorkbench} />
      )}

      {/* Safe automation boundary (Section 6.6) */}
      <AutomationPanel
        rules={automationRules}
        onToggle={toggleAutomationRule}
        open={showAutomation}
        setOpen={setShowAutomation}
      />

      {/* Recurring engagements (Section 6.5) */}
      <RecurringPanel
        plans={recurringPlans}
        onAdvance={advanceRecurringPlan}
        open={showRecurring}
        setOpen={setShowRecurring}
        onOpenTemplates={() => navigateToScreen('practice-templates')}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared status chip
// ---------------------------------------------------------------------------
function TaskStatusChip({ status }: { status: WorkflowTask['status'] }) {
  const meta = TASK_STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border font-mono ${meta.chip}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function GateBadge() {
  return (
    <span
      title="This task mirrors a mandatory regulatory gate. Completing the checklist does not clear the authoritative gate."
      className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-mono uppercase"
    >
      <ShieldCheck className="w-2.5 h-2.5" />
      Gate
    </span>
  );
}

function TaskRow({
  task,
  onUpdateStatus,
  onOpenWorkbench,
}: {
  task: WorkflowTask;
  onUpdateStatus: (id: string, status: WorkflowTask['status']) => void;
  onOpenWorkbench: (w: NonNullable<WorkflowTask['linksToWorkbench']>) => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-2.5 rounded-lg border bg-white transition-colors ${
        task.status === 'completed' ? 'border-emerald-100' : 'border-slate-200'
      }`}
    >
      <button
        onClick={() => onUpdateStatus(task.id, task.status === 'completed' ? 'in-progress' : 'completed')}
        title={task.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
          task.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-blue-400'
        }`}
      >
        {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
      </button>

      <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-[9px] font-mono shrink-0" title={`${task.owner} (${task.ownerRole})`}>
        {task.ownerAvatar}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-xs font-medium ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
            {task.title}
          </span>
          {task.isGate && <GateBadge />}
        </div>
        {task.isGate && task.gateLabel && (
          <span className="text-[10px] text-amber-700 font-mono">↳ authoritative gate: {task.gateLabel}</span>
        )}
      </div>

      <span className="text-[10px] font-mono text-slate-400 shrink-0 hidden sm:inline">{task.dueDate}</span>
      <TaskStatusChip status={task.status} />
      {task.linksToWorkbench && (
        <button onClick={() => onOpenWorkbench(task.linksToWorkbench!)} className="text-blue-600 hover:text-blue-800 shrink-0" title="Open workbench">
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}


// ---------------------------------------------------------------------------
// Seven-phase tracker with expandable phase checklists (Section 6.2)
// ---------------------------------------------------------------------------
function PhaseTracker({
  readiness,
  engTasks,
  expandedPhase,
  setExpandedPhase,
  activeWorkflowPhase,
  setActiveWorkflowPhase,
  onUpdateStatus,
  onOpenWorkbench,
  currentPhase,
}: {
  readiness: Record<AuditPhaseId, PhaseReadiness>;
  engTasks: WorkflowTask[];
  expandedPhase: AuditPhaseId | null;
  setExpandedPhase: (p: AuditPhaseId | null) => void;
  activeWorkflowPhase: AuditPhaseId | 'all';
  setActiveWorkflowPhase: (p: AuditPhaseId | 'all') => void;
  onUpdateStatus: (id: string, status: WorkflowTask['status']) => void;
  onOpenWorkbench: (w: NonNullable<WorkflowTask['linksToWorkbench']>) => void;
  currentPhase: AuditPhaseId;
}) {
  return (
    <div className="space-y-3">
      {/* Phase filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Filter:</span>
        <button
          onClick={() => setActiveWorkflowPhase('all')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors ${
            activeWorkflowPhase === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Phases
        </button>
        {PHASE_META.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveWorkflowPhase(p.id)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors ${
              activeWorkflowPhase === p.id ? `${p.softBg} ${p.accent} ${p.ring}` : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {p.short}
          </button>
        ))}
      </div>
      {PHASE_META.filter((p) => activeWorkflowPhase === 'all' || activeWorkflowPhase === p.id).map((meta) => {
        const r = readiness[meta.id];
        const isExpanded = expandedPhase === meta.id;
        const phaseTasks = engTasks.filter((t) => t.phase === meta.id);
        return (
          <div
            key={meta.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
              meta.id === currentPhase ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-200'
            }`}
          >
            <button
              onClick={() => setExpandedPhase(isExpanded ? null : meta.id)}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50/60 transition-colors"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                r.status === 'complete' ? 'bg-emerald-100 text-emerald-700' : meta.id === currentPhase ? `${meta.softBg} ${meta.accent}` : 'bg-slate-100 text-slate-500'
              }`}>
                {r.status === 'complete' ? <CheckCircle2 className="w-5 h-5" /> : meta.id}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-slate-900">{meta.title}</span>
                  {meta.id === currentPhase && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white font-mono uppercase">Current</span>
                  )}
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border font-mono ${roleBadgeClass(meta.responsibleRole)}`}>
                    <Users className="w-2.5 h-2.5" />
                    {meta.responsibleRole}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                  <span>{meta.subtitle}</span>
                  {r.dueDate && <span className="font-mono">· Next due {r.dueDate}</span>}
                </div>
              </div>

              <div className="hidden md:flex flex-col items-end gap-1 w-40 shrink-0">
                <div className="flex items-center justify-between w-full text-[10px] text-slate-500 font-mono">
                  <span>{r.completed}/{r.total} done</span>
                  <span className="font-bold text-slate-700">{r.percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${meta.barBg} transition-all`} style={{ width: `${r.percent}%` }} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono">
                  <ShieldCheck className={`w-3 h-3 ${r.gateReady ? 'text-emerald-500' : 'text-amber-500'}`} />
                  <span className={r.gateReady ? 'text-emerald-600' : 'text-amber-600'}>
                    Gates {r.gateCleared}/{r.gateTotal} cleared
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                {r.blockers.length > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 font-mono">
                    <AlertTriangle className="w-3 h-3" />
                    {r.blockers.length} blocker{r.blockers.length > 1 ? 's' : ''}
                  </span>
                ) : r.status === 'complete' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> Clear
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md bg-slate-50 text-slate-500 border border-slate-200 font-mono">
                    <CircleDot className="w-3 h-3" /> On track
                  </span>
                )}
              </div>

              {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
            </button>
            {/* Expanded phase checklist */}
            {isExpanded && (
              <div className="border-t border-slate-100 bg-slate-50/40 p-4 space-y-3">
                {(r.blockers.length > 0 || r.nextAction) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {r.blockers.length > 0 && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider font-mono flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Blockers
                        </span>
                        <ul className="mt-1 space-y-0.5 text-[11px] text-red-700 list-disc list-inside">
                          {r.blockers.map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                      </div>
                    )}
                    {r.nextAction && (
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider font-mono flex items-center gap-1">
                          <ArrowRight className="w-3 h-3" /> Next permitted action
                        </span>
                        <p className="mt-1 text-[11px] text-blue-800 font-medium">{r.nextAction}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-1.5">
                  {phaseTasks.map((task) => (
                    <TaskRow key={task.id} task={task} onUpdateStatus={onUpdateStatus} onOpenWorkbench={onOpenWorkbench} />
                  ))}
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => onOpenWorkbench(meta.workbench)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    Open {meta.short} workbench <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


// ---------------------------------------------------------------------------
// Work queue — list filters (Section 6.4)
// ---------------------------------------------------------------------------
function WorkQueue({
  filters,
  queueFilter,
  setQueueFilter,
  queueCount,
  tasks,
  onUpdateStatus,
  onOpenWorkbench,
}: {
  filters: { id: QueueFilter; label: string }[];
  queueFilter: QueueFilter;
  setQueueFilter: (f: QueueFilter) => void;
  queueCount: (f: QueueFilter) => number;
  tasks: WorkflowTask[];
  onUpdateStatus: (id: string, status: WorkflowTask['status']) => void;
  onOpenWorkbench: (w: NonNullable<WorkflowTask['linksToWorkbench']>) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Work Queues</h2>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setQueueFilter(f.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors flex items-center gap-1.5 ${
                queueFilter === f.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
              <span className={`text-[10px] font-mono px-1 rounded ${queueFilter === f.id ? 'bg-blue-500' : 'bg-slate-100 text-slate-500'}`}>
                {queueCount(f.id)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-1.5">
        {tasks.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">No tasks match this queue filter.</div>
        ) : (
          tasks.map((task) => (
            <TaskRow key={task.id} task={task} onUpdateStatus={onUpdateStatus} onOpenWorkbench={onOpenWorkbench} />
          ))
        )}
      </div>
    </div>
  );
}


// ---------------------------------------------------------------------------
// Kanban board — columnar status view (Section 6.4)
// ---------------------------------------------------------------------------
function KanbanBoard({
  tasks,
  onUpdateStatus,
  onOpenWorkbench,
}: {
  tasks: WorkflowTask[];
  onUpdateStatus: (id: string, status: WorkflowTask['status']) => void;
  onOpenWorkbench: (w: NonNullable<WorkflowTask['linksToWorkbench']>) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
        <Columns3 className="w-4 h-4 text-blue-600" />
        <h2 className="text-sm font-bold text-slate-900">Kanban Board</h2>
        <span className="text-[11px] text-slate-400">Click a card&apos;s checkbox to toggle completion</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {KANBAN_COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status);
          const meta = TASK_STATUS_META[col.status];
          return (
            <div key={col.status} className="flex flex-col min-w-0">
              <div className="flex items-center justify-between px-2 py-1.5 rounded-t-lg bg-slate-50 border border-slate-200 border-b-0">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                  <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                  {col.title}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{colTasks.length}</span>
              </div>
              <div className="flex-1 space-y-2 p-2 rounded-b-lg bg-slate-50/40 border border-slate-200 min-h-[120px]">
                {colTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => onUpdateStatus(task.id, task.status === 'completed' ? 'not-started' : 'completed')}
                    className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-1.5">
                      <div className={`w-3.5 h-3.5 mt-0.5 rounded border-2 flex items-center justify-center shrink-0 ${
                        task.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                      }`}>
                        {task.status === 'completed' && <CheckCircle2 className="w-2.5 h-2.5" />}
                      </div>
                      <span className={`text-[11px] font-medium leading-tight ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 pl-5">
                      <span className="text-[9px] font-mono text-slate-400">{getPhaseMeta(task.phase).short}</span>
                      {task.isGate && <GateBadge />}
                      {task.linksToWorkbench && (
                        <span
                          onClick={(e) => { e.stopPropagation(); onOpenWorkbench(task.linksToWorkbench!); }}
                          className="ml-auto text-blue-500 hover:text-blue-700"
                          title="Open workbench"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </button>
                ))}
                {colTasks.length === 0 && <div className="text-[10px] text-slate-300 text-center py-4">—</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ---------------------------------------------------------------------------
// Calendar view — tasks grouped by due date (Section 6.4)
// ---------------------------------------------------------------------------
function CalendarView({
  tasks,
  onOpenWorkbench,
}: {
  tasks: WorkflowTask[];
  onOpenWorkbench: (w: NonNullable<WorkflowTask['linksToWorkbench']>) => void;
}) {
  // Group non-completed tasks by due date, sorted ascending.
  const byDate = useMemo(() => {
    const map = new Map<string, WorkflowTask[]>();
    tasks
      .filter((t) => t.status !== 'completed')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .forEach((t) => {
        const arr = map.get(t.dueDate) || [];
        arr.push(t);
        map.set(t.dueDate, arr);
      });
    return Array.from(map.entries());
  }, [tasks]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center gap-2">
        <CalendarDays className="w-4 h-4 text-blue-600" />
        <h2 className="text-sm font-bold text-slate-900">Calendar — Upcoming Due Dates</h2>
      </div>
      <div className="p-4 space-y-4">
        {byDate.length === 0 && <div className="text-center py-10 text-xs text-slate-400">No scheduled tasks.</div>}
        {byDate.map(([date, dayTasks]) => {
          const overdue = date < TODAY;
          return (
            <div key={date} className="flex gap-4">
              <div className={`w-24 shrink-0 text-right ${overdue ? 'text-red-600' : 'text-slate-600'}`}>
                <div className="text-xs font-bold font-mono">{date}</div>
                <div className="text-[10px] text-slate-400">{dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}</div>
                {overdue && <div className="text-[9px] font-bold text-red-600 font-mono uppercase">Overdue</div>}
              </div>
              <div className="flex-1 space-y-1.5 border-l-2 border-slate-100 pl-4">
                {dayTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className={`w-1.5 h-1.5 rounded-full ${TASK_STATUS_META[task.status].dot} shrink-0`} />
                    <span className="text-[11px] font-medium text-slate-800 flex-1 truncate">{task.title}</span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border font-mono ${roleBadgeClass(task.ownerRole)}`}>{task.ownerRole}</span>
                    {task.isGate && <GateBadge />}
                    <TaskStatusChip status={task.status} />
                    {task.linksToWorkbench && (
                      <button onClick={() => onOpenWorkbench(task.linksToWorkbench!)} className="text-blue-600 hover:text-blue-800 shrink-0" title="Open workbench">
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ---------------------------------------------------------------------------
// Safe automation boundary (Section 6.6)
// ---------------------------------------------------------------------------
function AutomationPanel({
  rules,
  onToggle,
  open,
  setOpen,
}: {
  rules: import('@/types/audit').AutomationRule[];
  onToggle: (id: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
  const categoryIcon: Record<string, typeof Bot> = {
    assignment: Users,
    'follow-up': Repeat,
    reminder: Bot,
    escalation: AlertTriangle,
    notification: Bot,
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50/60 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Safe Workflow Automation</h2>
          <span className="text-[10px] font-mono text-slate-400">Permitted orchestrator actions only</span>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>

      {open && (
        <div className="border-t border-slate-100 p-4 space-y-4">
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
            <strong>Permitted:</strong> assign tasks, create follow-up checklists, set reminders &amp; due dates,
            escalate overdue PBC requests, and notify permitted users after genuine domain events. Every rule
            reauthorizes, uses an idempotency key, pins the current template version and fails safely on stale input.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rules.map((rule) => {
              const Icon = categoryIcon[rule.category] || Bot;
              return (
                <div key={rule.id} className={`p-3 rounded-lg border transition-colors ${rule.enabled ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-70'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-900">{rule.name}</span>
                    </div>
                    <button
                      onClick={() => onToggle(rule.id)}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors shrink-0 ${rule.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      title={rule.enabled ? 'Disable rule' : 'Enable rule'}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${rule.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1.5">{rule.description}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap text-[10px] font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">{rule.category}</span>
                    <span className="text-slate-400">Trigger: {rule.trigger}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">{rule.idempotencyStrategy}</div>
                </div>
              );
            })}
          </div>

          {/* Prohibited actions */}
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider font-mono flex items-center gap-1">
              <Ban className="w-3.5 h-3.5" /> Prohibited — never automatable
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {PROHIBITED_ACTIONS.map((pa) => (
                <div key={pa.id} className="text-[11px] text-red-800">
                  <span className="font-semibold">{pa.action}</span>
                  <span className="text-red-600"> — {pa.reason}</span>
                  <span className="block text-[10px] text-red-500 font-mono">Authority: {pa.authority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ---------------------------------------------------------------------------
// Recurring engagements (Section 6.5)
// ---------------------------------------------------------------------------
function RecurringPanel({
  plans,
  onAdvance,
  open,
  setOpen,
  onOpenTemplates,
}: {
  plans: import('@/types/audit').RecurringEngagementPlan[];
  onAdvance: (id: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  onOpenTemplates: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50/60 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Repeat className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Recurring Audit Engagements</h2>
          <span className="text-[10px] font-mono text-slate-400">Roll-forward with fresh authorization</span>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>

      {open && (
        <div className="border-t border-slate-100 p-4 space-y-3">
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
            Prior-year client details, team and TB mapping may be reused, but <strong>commercial consent, Partner
            continuance, current Trial Balance and materiality are never carried forward</strong> as valid authorization.
          </div>

          {plans.map((plan) => (
            <div key={plan.id} className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-900">{plan.clientLegalName}</span>
                  <span className="text-[10px] font-mono text-slate-400">→ {plan.nextPeriod}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase ${
                    plan.status === 'created' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : plan.status === 'ready' ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>{plan.status}</span>
                  <button
                    onClick={() => onAdvance(plan.id)}
                    disabled={plan.status === 'created'}
                    className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                      plan.status === 'created' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {plan.status === 'draft' ? 'Mark Ready' : 'Create Engagement'}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2 text-[11px]">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase font-mono">Reused</span>
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    {plan.reused.clientDetails && <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">Client details</span>}
                    {plan.reused.team && <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">Team</span>}
                    {plan.reused.mappingSuggestions && <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">TB mapping</span>}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase font-mono">Requires fresh authorization</span>
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono">Commercial consent</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono">Partner continuance</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono">Current TB</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono">Materiality</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-1 flex justify-end">
            <button onClick={onOpenTemplates} className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors">
              <Layers className="w-3.5 h-3.5" /> Manage practice templates
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



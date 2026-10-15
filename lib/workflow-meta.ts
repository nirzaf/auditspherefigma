import { AuditPhaseId, WorkflowTaskStatus, TaskOwnerRole } from '@/types/audit';

// Section 6.1 — Mapping of the seven user-facing display phases to the
// canonical Section 5 lifecycle states. This is a presentation projection only.
export interface PhaseMeta {
  id: AuditPhaseId;
  title: string;
  short: string;
  subtitle: string;
  responsibleRole: TaskOwnerRole;
  canonicalStates: string[];
  workbench: 'onboarding' | 'planning' | 'fieldwork' | 'review' | 'signoff' | 'deliverables' | 'archive';
  accent: string; // tailwind text color
  ring: string; // tailwind ring/border color
  barBg: string; // tailwind bg for progress
  softBg: string; // tailwind soft bg
}

export const PHASE_META: PhaseMeta[] = [
  {
    id: 1,
    title: '1. Client Onboarding',
    short: 'Onboarding',
    subtitle: 'Dual-Key Acceptance & 50% Advance',
    responsibleRole: 'Manager',
    canonicalStates: ['LEAD_INGESTION', 'PROPOSAL_GENERATION', 'DUAL_KEY_PENDING', 'ADVANCE_BILLING'],
    workbench: 'onboarding',
    accent: 'text-sky-700',
    ring: 'border-sky-300',
    barBg: 'bg-sky-500',
    softBg: 'bg-sky-50',
  },
  {
    id: 2,
    title: '2. Audit Planning',
    short: 'Planning',
    subtitle: 'Materiality Engine & Risk Routing',
    responsibleRole: 'Partner',
    canonicalStates: ['PORTAL_ACTIVE_PLANNING'],
    workbench: 'planning',
    accent: 'text-indigo-700',
    ring: 'border-indigo-300',
    barBg: 'bg-indigo-500',
    softBg: 'bg-indigo-50',
  },
  {
    id: 3,
    title: '3. Audit Fieldwork',
    short: 'Fieldwork',
    subtitle: 'Split FSLI Workspace & Evidence',
    responsibleRole: 'Senior',
    canonicalStates: ['FIELDWORK_EXECUTION'],
    workbench: 'fieldwork',
    accent: 'text-blue-700',
    ring: 'border-blue-300',
    barBg: 'bg-blue-500',
    softBg: 'bg-blue-50',
  },
  {
    id: 4,
    title: '4. Manager Review',
    short: 'Review',
    subtitle: 'Notes, Rework & SRM',
    responsibleRole: 'Manager',
    canonicalStates: ['MANAGERIAL_REVIEW'],
    workbench: 'review',
    accent: 'text-amber-700',
    ring: 'border-amber-300',
    barBg: 'bg-amber-500',
    softBg: 'bg-amber-50',
  },
  {
    id: 5,
    title: '5. Partner Sign-off',
    short: 'Sign-off',
    subtitle: 'ISA 700/705 Opinion',
    responsibleRole: 'Partner',
    canonicalStates: ['PARTNER_APPROVAL'],
    workbench: 'signoff',
    accent: 'text-violet-700',
    ring: 'border-violet-300',
    barBg: 'bg-violet-500',
    softBg: 'bg-violet-50',
  },
  {
    id: 6,
    title: '6. Report & Delivery',
    short: 'Delivery',
    subtitle: '5-Part Bundle Release',
    responsibleRole: 'Partner',
    canonicalStates: ['DELIVERABLE_RELEASE'],
    workbench: 'deliverables',
    accent: 'text-emerald-700',
    ring: 'border-emerald-300',
    barBg: 'bg-emerald-500',
    softBg: 'bg-emerald-50',
  },
  {
    id: 7,
    title: '7. Archive & Close',
    short: 'Archive',
    subtitle: 'ISA 230 Regulatory Lock',
    responsibleRole: 'Partner',
    canonicalStates: ['COMPLIANCE_COUNTDOWN', 'ARCHIVED_READ_ONLY'],
    workbench: 'archive',
    accent: 'text-slate-700',
    ring: 'border-slate-300',
    barBg: 'bg-slate-500',
    softBg: 'bg-slate-50',
  },
];

export function getPhaseMeta(id: AuditPhaseId): PhaseMeta {
  return PHASE_META.find((p) => p.id === id) || PHASE_META[0];
}

export interface StatusMeta {
  label: string;
  chip: string; // tailwind classes for a badge
  dot: string; // tailwind dot color
}

export const TASK_STATUS_META: Record<WorkflowTaskStatus, StatusMeta> = {
  'not-started': { label: 'Not Started', chip: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  'in-progress': { label: 'In Progress', chip: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  'waiting-client': { label: 'Waiting for Client', chip: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  'under-review': { label: 'Under Review', chip: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
  rework: { label: 'Rework Required', chip: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  completed: { label: 'Completed', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
};

// Kanban columns for the work-queue board (Section 6.4).
export const KANBAN_COLUMNS: { status: WorkflowTaskStatus; title: string }[] = [
  { status: 'not-started', title: 'Not Started' },
  { status: 'in-progress', title: 'In Progress' },
  { status: 'waiting-client', title: 'Waiting for Client' },
  { status: 'under-review', title: 'Under Review' },
  { status: 'rework', title: 'Rework' },
  { status: 'completed', title: 'Completed' },
];

export function roleBadgeClass(role: TaskOwnerRole): string {
  switch (role) {
    case 'Partner':
      return 'bg-violet-100 text-violet-800 border-violet-200';
    case 'Manager':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Senior':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Associate':
      return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'Client':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export type AuditRole = 'PREPARER' | 'REVIEWER' | 'APPROVER / PARTNER' | 'CLIENT / CFO';

export type AuditPhaseId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface TeamMember {
  id: string;
  name: string;
  role: 'Partner' | 'Manager' | 'Senior' | 'Associate';
  chargeOutRateQAR: number;
  avatar: string;
}

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface AuditAssertion {
  id: string;
  name: 'Existence' | 'Completeness' | 'Valuation' | 'Ownership' | 'Cut-Off';
  tested: boolean;
  notes: string;
}

export interface SamplingResult {
  method: 'Monetary Unit Sampling (MUS)' | 'Systematic Random' | 'Attribute Sampling';
  populationValueQAR: number;
  sampleSize: number;
  tolerableMisstatementQAR: number;
  expectedMisstatementQAR: number;
  exceptionsFound: number;
  conclusion: string;
}

export interface FSLIRow {
  id: string;
  code: string;
  category: 'PL' | 'BS';
  name: string;
  currentYearBalanceQAR: number;
  priorYearBalanceQAR: number;
  variancePercent: number;
  riskLevel: RiskLevel;
  concurrentAuditor?: {
    name: string;
    avatar: string;
    action: string;
  };
  testingStatus: 'Not Started' | 'In Progress' | 'Under Rework' | 'Ready for Review' | 'Approved';
  assertions: AuditAssertion[];
  sampling?: SamplingResult;
  digitalEvidenceCount: number;
  physicalBinderRef?: string;
  assignedAuditor: string;
  customProcedures: Array<{
    id: string;
    title: string;
    completed: boolean;
    reference: string;
  }>;
}

export interface MaterialityConfig {
  benchmarkType: 'Normalized Profit Before Tax' | 'Total Revenue' | 'Total Assets' | 'Equity / Net Assets';
  benchmarkBaseQAR: number;
  benchmarkPercent: number; // e.g. 5%
  planningMaterialityQAR: number; // PM
  tolerableErrorPercent: number; // 50% - 75%
  tolerableErrorQAR: number; // TE
  sadPercent: number; // 3% - 5%
  sadQAR: number; // Summary of Audit Differences cutoff
  managerRoundingOffsetPercent: number; // ±5.0%
  adjustedPlanningMaterialityQAR: number;
  partnerApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
}

export interface ReviewNote {
  id: string;
  fsliId: string;
  fsliName: string;
  procedureRef: string;
  raisedBy: string;
  assignedTo: string;
  noteText: string;
  status: 'Open' | 'Under Rework' | 'Resolved';
  createdAt: string;
}

export interface ConfirmationItem {
  id: string;
  type: 'Bank' | 'Accounts Receivable' | 'Accounts Payable' | 'Legal Counsel' | 'Inventory (3PL)';
  recipientName: string;
  balanceQAR: number;
  isCritical: boolean;
  status: 'Dispatched' | 'Received' | 'Pending';
  lastFollowUp: string;
}

export type OpinionType = 'Clean / Unqualified Opinion' | 'Qualified Opinion' | 'Disclaimer of Opinion' | 'Adverse Opinion';

export interface PartnerSignOff {
  opinionType: OpinionType;
  affectedFSLIs: string[];
  isa705Justification: string;
  partnerSignatureHash: string;
  firmSealAffixed: boolean;
  signOffTimestamp?: string;
  partnerName: string;
}

export interface DeliverablesBundle {
  auditorReportStatus: 'Draft' | 'Generated' | 'Signed' | 'Dispatched';
  managementLetterStatus: 'Draft' | 'Generated' | 'Dispatched';
  lorStatus: 'Draft' | 'Generated' | 'Signed' | 'Dispatched';
  correspondencesStatus: 'Draft' | 'Generated' | 'Dispatched';
  finalInvoiceStatus: 'Draft' | 'Generated' | 'Paid';
  clientUploadsFrozen: boolean;
  dispatchedAt?: string;
}

export interface ClientDocumentRequest {
  id: string;
  category: string;
  title: string;
  description: string;
  deadline: string;
  status: 'Pending Upload' | 'Under Review' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  uploadedFileName?: string;
  uploadedAt?: string;
}

export interface TimesheetEntry {
  id: string;
  staffName: string;
  role: 'Partner' | 'Manager' | 'Senior' | 'Associate';
  engagementId: string;
  fsliCode: string;
  hours: number;
  chargeOutRateQAR: number;
  date: string;
  notes: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  account: string;
  description: string;
  debitQAR: number;
  creditQAR: number;
  category: 'Revenue' | 'Payroll' | 'Rent' | 'Drawings' | 'Disbursements';
}

export interface ARAgingItem {
  clientName: string;
  engagementCode: string;
  totalDueQAR: number;
  advanceDueQAR: number;
  finalDueQAR: number;
  currentQAR: number;
  days30QAR: number;
  days60QAR: number;
  days90PlusQAR: number;
  status: 'Current' | 'Overdue';
}

export interface Engagement {
  id: string;
  code: string;
  clientLegalName: string;
  entityStructure: string; // e.g. "Doha Holdings Q.P.S.C. ➔ Retail Division Subsidiary"
  industryTag: string;
  statutoryYearEnd: string;
  contractedFeeQAR: number;
  proposalType: 'Brief Quotation (1-2 pgs)' | 'Comprehensive Proposal (Multi-page)';
  proposalRev: string;
  proposalDispatchedAt: string;
  proposalChannel: 'Email' | 'WhatsApp / Portal';
  // Dual-Key Gatekeeper
  commercialKey: {
    status: 'Approved' | 'Pending' | 'Stale';
    acceptedFeeQAR: number;
    authorizedSignatory: string;
    acceptedAt: string;
    attachmentName: string;
  };
  partnerKyc: {
    status: 'Unconditional Approval' | 'Conditional Hold' | 'Rejected';
    uboVerified: boolean;
    amlSanctionsCleared: boolean;
    isqc1IndependenceCleared: boolean;
    conflictCleared: boolean;
    partnerSignatureHash: string;
    approvedAt: string;
    partnerName: string;
  };
  // 50% Advance Payment Gate
  advanceInvoice: {
    invoiceNo: string;
    amountQAR: number;
    status: 'Allocated' | 'Pending';
    paymentRef: string;
    paidAt?: string;
    receiptVoucherNo?: string;
  };
  // Milestones & Gantt
  milestones: {
    fieldworkStart: string;
    draftReportDate: string;
    finalReportDate: string;
  };
  currentPhase: AuditPhaseId;
  taskProgressPercent: number;
  assignedTeam: TeamMember[];
  materiality: MaterialityConfig;
  fsliList: FSLIRow[];
  reviewNotes: ReviewNote[];
  confirmations: ConfirmationItem[];
  partnerSignOff: PartnerSignOff;
  deliverables: DeliverablesBundle;
  clientRequests: ClientDocumentRequest[];
  isPermanentlyArchived: boolean;
  archiveRemainingDays: number;
  auditTrail: Array<{
    id: string;
    action: string;
    performedBy: string;
    timestamp: string;
    phase: string;
  }>;
}

export type ToastType = 'success' | 'info' | 'warning' | 'error';

// ---------------------------------------------------------------------------
// Section 6 — Seven-Phase Engagement Workflow Experience Layer
// The display phases below are a *presentation projection* of the authoritative
// Section 5 canonical lifecycle. They never replace domain gates or commands.
// ---------------------------------------------------------------------------

export type WorkflowTaskStatus =
  | 'not-started'
  | 'in-progress'
  | 'waiting-client'
  | 'under-review'
  | 'rework'
  | 'completed';

export type TaskOwnerRole = 'Partner' | 'Manager' | 'Senior' | 'Associate' | 'Client';

// A pinned, engagement-scoped task instance generated from a versioned template.
// `isGate === true` marks a task that mirrors a mandatory regulatory clearance;
// completing the task is distinct from satisfying the authoritative gate.
export interface WorkflowTask {
  id: string;
  engagementId: string;
  phase: AuditPhaseId;
  group: string; // task group name, e.g. "Dual-Key Acceptance"
  title: string;
  owner: string;
  ownerRole: TaskOwnerRole;
  ownerAvatar: string;
  dueDate: string; // ISO date (YYYY-MM-DD)
  effortHours: number;
  status: WorkflowTaskStatus;
  isGate: boolean;
  gateLabel?: string; // e.g. "Dual-Key Acceptance (ISA 220)"
  dependsOn: string[]; // ids of prerequisite tasks (cycle-guarded)
  clientRequest: boolean; // originates from a client PBC request
  linksToWorkbench?: ScreenWorkbench; // contextual deep link to a module workbench
  sourceTemplateId: string;
  pinnedTemplateRev: string;
  completedAt?: string;
}

export type ScreenWorkbench =
  | 'onboarding'
  | 'planning'
  | 'fieldwork'
  | 'review'
  | 'signoff'
  | 'deliverables'
  | 'archive'
  | 'client-portal'
  | 'practice-ledger';

// ---------------------------------------------------------------------------
// Reusable, administrator-approved versioned practice templates (Section 6.4)
// ---------------------------------------------------------------------------

export interface TaskTemplateItem {
  id: string;
  title: string;
  ownerRole: TaskOwnerRole;
  dueOffsetDays: number; // relative to engagement fieldwork start
  effortHours: number;
  dependsOnGroupTaskIds: string[];
  clientRequest: boolean;
  isGate: boolean;
  gateLabel?: string;
  linksToWorkbench?: ScreenWorkbench;
}

export interface TaskTemplateGroup {
  id: string;
  name: string;
  phase: AuditPhaseId;
  tasks: TaskTemplateItem[];
}

export interface PracticeTemplate {
  id: string;
  name: string;
  engagementType: 'Statutory Audit' | 'Internal Audit / AUP';
  industry: string;
  revision: string; // e.g. "TPL-REV-2026.1"
  status: 'Approved' | 'Draft';
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  groups: TaskTemplateGroup[];
  pinnedToEngagementIds: string[]; // engagements that have pinned this revision
}

// ---------------------------------------------------------------------------
// Safe workflow automation (Section 6.6) — permitted orchestrator actions only
// ---------------------------------------------------------------------------

export type AutomationCategory =
  | 'assignment'
  | 'follow-up'
  | 'reminder'
  | 'escalation'
  | 'notification';

export interface AutomationRule {
  id: string;
  name: string;
  category: AutomationCategory;
  description: string;
  trigger: string;
  idempotencyStrategy: string;
  pinsCurrentVersion: boolean;
  enabled: boolean;
}

// Prohibited actions — the automation orchestrator may NEVER perform these; they
// remain the exclusive authority of authorized domain commands & actors.
export interface ProhibitedAction {
  id: string;
  action: string;
  reason: string;
  authority: string;
}

// ---------------------------------------------------------------------------
// Recurring audit engagements (Section 6.5)
// ---------------------------------------------------------------------------

export interface RecurringEngagementPlan {
  id: string;
  clientLegalName: string;
  baseEngagementId: string;
  nextPeriod: string;
  templateId: string;
  templateRev: string;
  reused: {
    clientDetails: boolean;
    team: boolean;
    mappingSuggestions: boolean;
  };
  // These always require fresh, current authorization and are never carried
  // forward from the prior year as valid authorization.
  requiresFreshAuthorization: {
    commercialConsent: boolean;
    partnerContinuance: boolean;
    currentTrialBalance: boolean;
    materialityRecalc: boolean;
  };
  status: 'draft' | 'ready' | 'created';
}

export interface ToastNotification {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  timestamp: number;
  duration?: number;
}

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

export interface ToastNotification {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  timestamp: number;
  duration?: number;
}

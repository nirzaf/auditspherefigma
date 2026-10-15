import {
  PracticeTemplate,
  WorkflowTask,
  AutomationRule,
  ProhibitedAction,
  RecurringEngagementPlan,
} from '@/types/audit';

// ---------------------------------------------------------------------------
// Section 6.4 — Reusable, administrator-approved versioned practice templates.
// Changes to a template revision never silently rewrite existing engagements:
// each engagement pins the revision it was instantiated from.
// ---------------------------------------------------------------------------

export const PRACTICE_TEMPLATES: PracticeTemplate[] = [
  {
    id: 'tpl-retail-stat',
    name: 'Retail & Consumer Trade — Statutory Audit',
    engagementType: 'Statutory Audit',
    industry: 'Consumer Goods & Retail Trade',
    revision: 'TPL-REV-2026.2',
    status: 'Approved',
    approvedBy: 'Tariq Al-Mansoor, FCA (Firm Administrator)',
    approvedAt: '2026-08-14 10:00 AST',
    createdAt: '2026-08-01 09:00 AST',
    pinnedToEngagementIds: ['doha-retail-qpsc'],
    groups: [
      {
        id: 'g-1',
        name: 'Client Onboarding',
        phase: 1,
        tasks: [
          { id: 't-1a', title: 'Capture entity tree & multi-contact directory', ownerRole: 'Manager', dueOffsetDays: -30, effortHours: 3, dependsOnGroupTaskIds: [], clientRequest: false, isGate: false },
          { id: 't-1b', title: 'Dispatch comprehensive proposal (5-part)', ownerRole: 'Manager', dueOffsetDays: -24, effortHours: 5, dependsOnGroupTaskIds: ['t-1a'], clientRequest: false, isGate: false },
          { id: 't-1c', title: 'KEY 1 — Record client commercial acceptance of dispatched revision', ownerRole: 'Client', dueOffsetDays: -18, effortHours: 1, dependsOnGroupTaskIds: ['t-1b'], clientRequest: true, isGate: true, gateLabel: 'Dual-Key Acceptance (ISA 220)' },
          { id: 't-1d', title: 'KEY 2 — Partner AML/KYC & continuance risk clearance', ownerRole: 'Partner', dueOffsetDays: -16, effortHours: 4, dependsOnGroupTaskIds: ['t-1b'], clientRequest: false, isGate: true, gateLabel: 'Dual-Key Acceptance (ISA 220 / ISQC 1)' },
          { id: 't-1e', title: 'Generate Engagement Letter (ISA 210) & 50% advance invoice', ownerRole: 'Manager', dueOffsetDays: -14, effortHours: 2, dependsOnGroupTaskIds: ['t-1c', 't-1d'], clientRequest: false, isGate: false, linksToWorkbench: 'onboarding' },
          { id: 't-1f', title: 'Allocate 50% advance payment & issue official receipt', ownerRole: 'Manager', dueOffsetDays: -8, effortHours: 1, dependsOnGroupTaskIds: ['t-1e'], clientRequest: false, isGate: true, gateLabel: 'Advance-Payment Gate (50%)' },
        ],
      },
      {
        id: 'g-2',
        name: 'Audit Planning',
        phase: 2,
        tasks: [
          { id: 't-2a', title: 'Provision 5-folder engagement directory', ownerRole: 'Manager', dueOffsetDays: -6, effortHours: 1, dependsOnGroupTaskIds: [], clientRequest: false, isGate: false },
          { id: 't-2b', title: 'Assign team & configure statutory milestones', ownerRole: 'Partner', dueOffsetDays: -5, effortHours: 2, dependsOnGroupTaskIds: ['t-2a'], clientRequest: false, isGate: false, linksToWorkbench: 'planning' },
          { id: 't-2c', title: 'Import & map Trial Balance to standardized FSLIs', ownerRole: 'Senior', dueOffsetDays: -3, effortHours: 6, dependsOnGroupTaskIds: ['t-2a'], clientRequest: false, isGate: false, linksToWorkbench: 'fieldwork' },
          { id: 't-2d', title: 'Calculate 3-tier materiality (PM / TE / SAD)', ownerRole: 'Manager', dueOffsetDays: -2, effortHours: 3, dependsOnGroupTaskIds: ['t-2c'], clientRequest: false, isGate: false, linksToWorkbench: 'planning' },
          { id: 't-2e', title: 'Partner planning & materiality sign-off (ISA 320)', ownerRole: 'Partner', dueOffsetDays: -1, effortHours: 2, dependsOnGroupTaskIds: ['t-2d'], clientRequest: false, isGate: true, gateLabel: 'Planning & Materiality Approval' },
        ],
      },
      {
        id: 'g-3',
        name: 'Audit Fieldwork',
        phase: 3,
        tasks: [
          { id: 't-3a', title: 'Execute Revenue (IFRS 15) substantive workprogram', ownerRole: 'Senior', dueOffsetDays: 14, effortHours: 20, dependsOnGroupTaskIds: [], clientRequest: false, isGate: false, linksToWorkbench: 'fieldwork' },
          { id: 't-3b', title: 'Execute COGS cut-off & import tariff testing', ownerRole: 'Associate', dueOffsetDays: 12, effortHours: 24, dependsOnGroupTaskIds: [], clientRequest: false, isGate: false, linksToWorkbench: 'fieldwork' },
          { id: 't-3c', title: 'Obtain client customs clearance evidence', ownerRole: 'Client', dueOffsetDays: 9, effortHours: 2, dependsOnGroupTaskIds: ['t-3b'], clientRequest: true, isGate: false, linksToWorkbench: 'client-portal' },
          { id: 't-3d', title: 'Cash & bank circularization — QNB main account', ownerRole: 'Senior', dueOffsetDays: 10, effortHours: 6, dependsOnGroupTaskIds: [], clientRequest: false, isGate: false, linksToWorkbench: 'review' },
          { id: 't-3e', title: 'Submit all FSLI results for managerial review', ownerRole: 'Senior', dueOffsetDays: 16, effortHours: 4, dependsOnGroupTaskIds: ['t-3a', 't-3b', 't-3d'], clientRequest: false, isGate: true, gateLabel: 'Fieldwork Submission Complete' },
        ],
      },
      {
        id: 'g-4',
        name: 'Manager Review',
        phase: 4,
        tasks: [
          { id: 't-4a', title: 'Independent reviewer verification of submissions', ownerRole: 'Manager', dueOffsetDays: 19, effortHours: 8, dependsOnGroupTaskIds: ['t-3e'], clientRequest: false, isGate: false, linksToWorkbench: 'review' },
          { id: 't-4b', title: 'Resolve all open review notes & rework loops', ownerRole: 'Associate', dueOffsetDays: 22, effortHours: 10, dependsOnGroupTaskIds: ['t-4a'], clientRequest: false, isGate: false, linksToWorkbench: 'review' },
          { id: 't-4c', title: 'Confirm critical confirmations returned & evaluated', ownerRole: 'Manager', dueOffsetDays: 23, effortHours: 3, dependsOnGroupTaskIds: ['t-4b'], clientRequest: false, isGate: true, gateLabel: 'Critical Confirmations (ISA 505)' },
          { id: 't-4d', title: 'Compile current Summary Review Memorandum (SRM)', ownerRole: 'Manager', dueOffsetDays: 24, effortHours: 5, dependsOnGroupTaskIds: ['t-4c'], clientRequest: false, isGate: true, gateLabel: 'SRM Compiled & Notes Cleared' },
        ],
      },
      {
        id: 'g-5',
        name: 'Partner Sign-off',
        phase: 5,
        tasks: [
          { id: 't-5a', title: 'Partner targeted review of Red-risk areas & SRM', ownerRole: 'Partner', dueOffsetDays: 26, effortHours: 6, dependsOnGroupTaskIds: ['t-4d'], clientRequest: false, isGate: false, linksToWorkbench: 'signoff' },
          { id: 't-5b', title: 'Select ISA 700/705 opinion & record rationale', ownerRole: 'Partner', dueOffsetDays: 27, effortHours: 2, dependsOnGroupTaskIds: ['t-5a'], clientRequest: false, isGate: false, linksToWorkbench: 'signoff' },
          { id: 't-5c', title: 'Apply digital signature & affix firm seal', ownerRole: 'Partner', dueOffsetDays: 27, effortHours: 1, dependsOnGroupTaskIds: ['t-5b'], clientRequest: false, isGate: true, gateLabel: 'Partner Opinion Signed' },
        ],
      },
      {
        id: 'g-6',
        name: 'Report & Delivery',
        phase: 6,
        tasks: [
          { id: 't-6a', title: 'Assemble mandatory 5-part deliverables bundle', ownerRole: 'Manager', dueOffsetDays: 29, effortHours: 5, dependsOnGroupTaskIds: ['t-5c'], clientRequest: false, isGate: false, linksToWorkbench: 'deliverables' },
          { id: 't-6b', title: 'Issue 50% final balance fee note', ownerRole: 'Manager', dueOffsetDays: 29, effortHours: 1, dependsOnGroupTaskIds: ['t-6a'], clientRequest: false, isGate: false, linksToWorkbench: 'practice-ledger' },
          { id: 't-6c', title: 'Release bundle & freeze client upload privileges', ownerRole: 'Partner', dueOffsetDays: 30, effortHours: 1, dependsOnGroupTaskIds: ['t-6a'], clientRequest: false, isGate: true, gateLabel: 'Authorized Release' },
        ],
      },
      {
        id: 'g-7',
        name: 'Archive & Close',
        phase: 7,
        tasks: [
          { id: 't-7a', title: 'Monitor 60-day ISA 230 compliance countdown', ownerRole: 'Manager', dueOffsetDays: 60, effortHours: 1, dependsOnGroupTaskIds: ['t-6c'], clientRequest: false, isGate: false, linksToWorkbench: 'archive' },
          { id: 't-7b', title: 'Execute effective read-only lock (timer or early)', ownerRole: 'Partner', dueOffsetDays: 90, effortHours: 1, dependsOnGroupTaskIds: ['t-7a'], clientRequest: false, isGate: true, gateLabel: 'Effective Committed Lock (ISA 230)' },
        ],
      },
    ],
  },
  {
    id: 'tpl-logistics-stat',
    name: 'Logistics & Warehousing — Statutory Audit',
    engagementType: 'Statutory Audit',
    industry: 'Transport & Logistics',
    revision: 'TPL-REV-2026.1',
    status: 'Approved',
    approvedBy: 'Tariq Al-Mansoor, FCA (Firm Administrator)',
    approvedAt: '2026-07-22 09:30 AST',
    createdAt: '2026-07-15 09:30 AST',
    pinnedToEngagementIds: ['qatar-logistics-wll'],
    groups: [
      {
        id: 'g-1',
        name: 'Client Onboarding',
        phase: 1,
        tasks: [
          { id: 't-1a', title: 'Capture entity tree & multi-contact directory', ownerRole: 'Manager', dueOffsetDays: -30, effortHours: 3, dependsOnGroupTaskIds: [], clientRequest: false, isGate: false },
          { id: 't-1c', title: 'KEY 1 — Record client commercial acceptance', ownerRole: 'Client', dueOffsetDays: -18, effortHours: 1, dependsOnGroupTaskIds: ['t-1a'], clientRequest: true, isGate: true, gateLabel: 'Dual-Key Acceptance (ISA 220)' },
          { id: 't-1d', title: 'KEY 2 — Partner AML/KYC & continuance risk clearance', ownerRole: 'Partner', dueOffsetDays: -16, effortHours: 4, dependsOnGroupTaskIds: ['t-1a'], clientRequest: false, isGate: true, gateLabel: 'Dual-Key Acceptance (ISA 220 / ISQC 1)' },
        ],
      },
      {
        id: 'g-2',
        name: 'Audit Planning',
        phase: 2,
        tasks: [
          { id: 't-2c', title: 'Import & map Trial Balance to standardized FSLIs', ownerRole: 'Senior', dueOffsetDays: -3, effortHours: 6, dependsOnGroupTaskIds: [], clientRequest: false, isGate: false, linksToWorkbench: 'fieldwork' },
          { id: 't-2e', title: 'Partner planning & materiality sign-off (ISA 320)', ownerRole: 'Partner', dueOffsetDays: -1, effortHours: 2, dependsOnGroupTaskIds: ['t-2c'], clientRequest: false, isGate: true, gateLabel: 'Planning & Materiality Approval' },
        ],
      },
    ],
  },
  {
    id: 'tpl-aup-generic',
    name: 'Agreed-Upon Procedures (ISRS 4400) — Generic',
    engagementType: 'Internal Audit / AUP',
    industry: 'Cross-Industry',
    revision: 'TPL-REV-2025.4',
    status: 'Draft',
    createdAt: '2026-09-02 08:00 AST',
    pinnedToEngagementIds: [],
    groups: [
      {
        id: 'g-1',
        name: 'Client Onboarding',
        phase: 1,
        tasks: [
          { id: 't-1a', title: 'Agree scope of procedures with engagement letter', ownerRole: 'Partner', dueOffsetDays: -20, effortHours: 2, dependsOnGroupTaskIds: [], clientRequest: false, isGate: false },
          { id: 't-1d', title: 'Independence & conflict check (ISRS 4400)', ownerRole: 'Partner', dueOffsetDays: -16, effortHours: 2, dependsOnGroupTaskIds: ['t-1a'], clientRequest: false, isGate: true, gateLabel: 'Independence Clearance' },
        ],
      },
      {
        id: 'g-3',
        name: 'Audit Fieldwork',
        phase: 3,
        tasks: [
          { id: 't-3a', title: 'Execute agreed-upon procedures & document findings', ownerRole: 'Senior', dueOffsetDays: 10, effortHours: 16, dependsOnGroupTaskIds: [], clientRequest: false, isGate: false, linksToWorkbench: 'fieldwork' },
          { id: 't-3e', title: 'Submit findings report for partner review', ownerRole: 'Senior', dueOffsetDays: 14, effortHours: 3, dependsOnGroupTaskIds: ['t-3a'], clientRequest: false, isGate: true, gateLabel: 'Findings Submitted' },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Pinned task instances for the active Doha Retail engagement (Phase 3).
// Projected statuses mirror the authoritative domain records where a gate
// exists; completing a task here never substitutes for the authoritative gate.
// ---------------------------------------------------------------------------

export const INITIAL_WORKFLOW_TASKS: WorkflowTask[] = [
  // Phase 1 — Onboarding (complete)
  { id: 'wt-1', engagementId: 'doha-retail-qpsc', phase: 1, group: 'Client Onboarding', title: 'Capture entity tree & multi-contact directory', owner: 'Rashid Kamal, ACCA', ownerRole: 'Manager', ownerAvatar: 'RK', dueDate: '2026-12-04', effortHours: 3, status: 'completed', isGate: false, dependsOn: [], clientRequest: false, sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2', completedAt: '2026-12-02 16:10 AST' },
  { id: 'wt-2', engagementId: 'doha-retail-qpsc', phase: 1, group: 'Client Onboarding', title: 'KEY 1 — Client commercial acceptance (REV-03)', owner: 'Sheikh Nasser Al-Thani', ownerRole: 'Client', ownerAvatar: 'NT', dueDate: '2026-12-10', effortHours: 1, status: 'completed', isGate: true, gateLabel: 'Dual-Key Acceptance (ISA 220)', dependsOn: [], clientRequest: true, sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2', completedAt: '2026-11-12 14:15 AST' },
  { id: 'wt-3', engagementId: 'doha-retail-qpsc', phase: 1, group: 'Client Onboarding', title: 'KEY 2 — Partner AML/KYC & continuance clearance', owner: 'Tariq Al-Mansoor, FCA', ownerRole: 'Partner', ownerAvatar: 'TM', dueDate: '2026-12-12', effortHours: 4, status: 'completed', isGate: true, gateLabel: 'Dual-Key Acceptance (ISA 220 / ISQC 1)', dependsOn: [], clientRequest: false, sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2', completedAt: '2026-11-14 11:00 AST' },
  { id: 'wt-4', engagementId: 'doha-retail-qpsc', phase: 1, group: 'Client Onboarding', title: 'Allocate 50% advance payment (QAR 10,000)', owner: 'Firm Finance', ownerRole: 'Manager', ownerAvatar: 'FF', dueDate: '2026-12-24', effortHours: 1, status: 'completed', isGate: true, gateLabel: 'Advance-Payment Gate (50%)', dependsOn: [], clientRequest: false, linksToWorkbench: 'onboarding', sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2', completedAt: '2026-11-18 10:20 AST' },

  // Phase 2 — Planning (complete)
  { id: 'wt-5', engagementId: 'doha-retail-qpsc', phase: 2, group: 'Audit Planning', title: 'Import & map Trial Balance to FSLIs', owner: 'Sarah Ahmed, CPA', ownerRole: 'Senior', ownerAvatar: 'SA', dueDate: '2026-12-31', effortHours: 6, status: 'completed', isGate: false, dependsOn: [], clientRequest: false, linksToWorkbench: 'fieldwork', sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2', completedAt: '2026-12-30 11:40 AST' },
  { id: 'wt-6', engagementId: 'doha-retail-qpsc', phase: 2, group: 'Audit Planning', title: 'Partner planning & materiality sign-off (PM 150k)', owner: 'Tariq Al-Mansoor, FCA', ownerRole: 'Partner', ownerAvatar: 'TM', dueDate: '2026-12-05', effortHours: 2, status: 'completed', isGate: true, gateLabel: 'Planning & Materiality Approval (ISA 320)', dependsOn: ['wt-5'], clientRequest: false, linksToWorkbench: 'planning', sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2', completedAt: '2026-12-05 16:45 AST' },

  // Phase 3 — Fieldwork (in progress) — mirrors the FSLI dashboard
  { id: 'wt-7', engagementId: 'doha-retail-qpsc', phase: 3, group: 'Audit Fieldwork', title: 'Revenue (IFRS 15) substantive workprogram', owner: 'Sarah Ahmed, CPA', ownerRole: 'Senior', ownerAvatar: 'SA', dueDate: '2027-01-21', effortHours: 20, status: 'in-progress', isGate: false, dependsOn: ['wt-6'], clientRequest: false, linksToWorkbench: 'fieldwork', sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2' },
  { id: 'wt-8', engagementId: 'doha-retail-qpsc', phase: 3, group: 'Audit Fieldwork', title: 'COGS cut-off & import tariff testing', owner: 'Zaid Al-Kuwari', ownerRole: 'Associate', ownerAvatar: 'ZA', dueDate: '2027-01-19', effortHours: 24, status: 'rework', isGate: false, dependsOn: ['wt-6'], clientRequest: false, linksToWorkbench: 'fieldwork', sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2' },
  { id: 'wt-9', engagementId: 'doha-retail-qpsc', phase: 3, group: 'Audit Fieldwork', title: 'Obtain client customs clearance evidence', owner: 'Sheikh Nasser Al-Thani', ownerRole: 'Client', ownerAvatar: 'NT', dueDate: '2027-01-16', effortHours: 2, status: 'waiting-client', isGate: false, dependsOn: ['wt-8'], clientRequest: true, linksToWorkbench: 'client-portal', sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2' },
  { id: 'wt-10', engagementId: 'doha-retail-qpsc', phase: 3, group: 'Audit Fieldwork', title: 'Cash & bank circularization — QNB main account', owner: 'Sarah Ahmed, CPA', ownerRole: 'Senior', ownerAvatar: 'SA', dueDate: '2027-01-17', effortHours: 6, status: 'waiting-client', isGate: false, dependsOn: ['wt-6'], clientRequest: false, linksToWorkbench: 'review', sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2' },
  { id: 'wt-11', engagementId: 'doha-retail-qpsc', phase: 3, group: 'Audit Fieldwork', title: 'PPE & Right-of-Use verification', owner: 'Zaid Al-Kuwari', ownerRole: 'Associate', ownerAvatar: 'ZA', dueDate: '2027-01-14', effortHours: 12, status: 'under-review', isGate: false, dependsOn: ['wt-6'], clientRequest: false, linksToWorkbench: 'fieldwork', sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2' },
  { id: 'wt-12', engagementId: 'doha-retail-qpsc', phase: 3, group: 'Audit Fieldwork', title: 'Admin & general expenses testing', owner: 'Sarah Ahmed, CPA', ownerRole: 'Senior', ownerAvatar: 'SA', dueDate: '2027-01-12', effortHours: 10, status: 'completed', isGate: false, dependsOn: ['wt-6'], clientRequest: false, linksToWorkbench: 'fieldwork', sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2', completedAt: '2027-01-11 15:05 AST' },

  // Phase 4 — Manager Review (blocked by open field gaps)
  { id: 'wt-13', engagementId: 'doha-retail-qpsc', phase: 4, group: 'Manager Review', title: 'Independent reviewer verification of submissions', owner: 'Rashid Kamal, ACCA', ownerRole: 'Manager', ownerAvatar: 'RK', dueDate: '2027-01-26', effortHours: 8, status: 'not-started', isGate: false, dependsOn: ['wt-7', 'wt-8', 'wt-10'], clientRequest: false, linksToWorkbench: 'review', sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2' },
  { id: 'wt-14', engagementId: 'doha-retail-qpsc', phase: 4, group: 'Manager Review', title: 'Critical confirmations returned & evaluated (QNB)', owner: 'Rashid Kamal, ACCA', ownerRole: 'Manager', ownerAvatar: 'RK', dueDate: '2027-01-28', effortHours: 3, status: 'not-started', isGate: true, gateLabel: 'Critical Confirmations (ISA 505)', dependsOn: ['wt-10'], clientRequest: false, linksToWorkbench: 'review', sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2' },
  { id: 'wt-15', engagementId: 'doha-retail-qpsc', phase: 4, group: 'Manager Review', title: 'Compile Summary Review Memorandum (SRM)', owner: 'Rashid Kamal, ACCA', ownerRole: 'Manager', ownerAvatar: 'RK', dueDate: '2027-01-30', effortHours: 5, status: 'not-started', isGate: true, gateLabel: 'SRM Compiled & Notes Cleared', dependsOn: ['wt-13', 'wt-14'], clientRequest: false, linksToWorkbench: 'review', sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2' },

  // Phase 5 — Partner Sign-off
  { id: 'wt-16', engagementId: 'doha-retail-qpsc', phase: 5, group: 'Partner Sign-off', title: 'Partner review of Red-risk areas & SRM', owner: 'Tariq Al-Mansoor, FCA', ownerRole: 'Partner', ownerAvatar: 'TM', dueDate: '2027-02-02', effortHours: 6, status: 'not-started', isGate: false, dependsOn: ['wt-15'], clientRequest: false, linksToWorkbench: 'signoff', sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2' },
  { id: 'wt-17', engagementId: 'doha-retail-qpsc', phase: 5, group: 'Partner Sign-off', title: 'Select opinion, sign & affix firm seal', owner: 'Tariq Al-Mansoor, FCA', ownerRole: 'Partner', ownerAvatar: 'TM', dueDate: '2027-02-03', effortHours: 2, status: 'not-started', isGate: true, gateLabel: 'Partner Opinion Signed (ISA 700/705)', dependsOn: ['wt-16'], clientRequest: false, linksToWorkbench: 'signoff', sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2' },

  // Phase 6 — Report & Delivery
  { id: 'wt-18', engagementId: 'doha-retail-qpsc', phase: 6, group: 'Report & Delivery', title: 'Assemble & release 5-part deliverables bundle', owner: 'Rashid Kamal, ACCA', ownerRole: 'Manager', ownerAvatar: 'RK', dueDate: '2027-02-06', effortHours: 6, status: 'not-started', isGate: true, gateLabel: 'Authorized Release', dependsOn: ['wt-17'], clientRequest: false, linksToWorkbench: 'deliverables', sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2' },

  // Phase 7 — Archive & Close
  { id: 'wt-19', engagementId: 'doha-retail-qpsc', phase: 7, group: 'Archive & Close', title: '60-day ISA 230 compliance countdown', owner: 'Rashid Kamal, ACCA', ownerRole: 'Manager', ownerAvatar: 'RK', dueDate: '2027-04-04', effortHours: 1, status: 'not-started', isGate: false, dependsOn: ['wt-18'], clientRequest: false, linksToWorkbench: 'archive', sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2' },
  { id: 'wt-20', engagementId: 'doha-retail-qpsc', phase: 7, group: 'Archive & Close', title: 'Execute effective read-only lock', owner: 'Tariq Al-Mansoor, FCA', ownerRole: 'Partner', ownerAvatar: 'TM', dueDate: '2027-04-04', effortHours: 1, status: 'not-started', isGate: true, gateLabel: 'Effective Committed Lock (ISA 230)', dependsOn: ['wt-19'], clientRequest: false, linksToWorkbench: 'archive', sourceTemplateId: 'tpl-retail-stat', pinnedTemplateRev: 'TPL-REV-2026.2' },
];


// ---------------------------------------------------------------------------
// Section 6.6 — Safe workflow automation. Permitted orchestrator actions only.
// Automators MAY assign, follow up, remind, escalate and notify. They SHALL NOT
// synthesize approvals, record payments, clear risk, sign opinions, etc.
// ---------------------------------------------------------------------------

export const AUTOMATION_RULES: AutomationRule[] = [
  { id: 'ar-1', name: 'Auto-assign FSLI to on-duty preparer', category: 'assignment', description: 'When a workprogram is created from a pinned template, assign it to the mapped preparer by role and current capacity.', trigger: 'Template task instance created', idempotencyStrategy: 'Idempotency key = task instance id', pinsCurrentVersion: true, enabled: true },
  { id: 'ar-2', name: 'PBC follow-up reminder (48h)', category: 'follow-up', description: 'Send a polite reminder to the client audit liaison 48h before a PBC document request deadline.', trigger: 'Client request due in 48h', idempotencyStrategy: 'Idempotency key = request id + date', pinsCurrentVersion: true, enabled: true },
  { id: 'ar-3', name: 'Review-note SLA reminder', category: 'reminder', description: 'Remind the assigned preparer 24h before an open review note breaches its SLA.', trigger: 'Open review note nearing SLA', idempotencyStrategy: 'Idempotency key = note id + day', pinsCurrentVersion: true, enabled: true },
  { id: 'ar-4', name: 'Overdue PBC escalation', category: 'escalation', description: 'Escalate overdue client PBC requests to the Engagement Manager for follow-up.', trigger: 'Client request past due', idempotencyStrategy: 'Idempotency key = request id + escalation count', pinsCurrentVersion: true, enabled: true },
  { id: 'ar-5', name: 'Gate-clear notification', category: 'notification', description: 'Notify permitted internal users only after a genuine domain gate event is recorded.', trigger: 'Domain gate cleared by authorized actor', idempotencyStrategy: 'Idempotency key = gate event id', pinsCurrentVersion: true, enabled: true },
];

export const PROHIBITED_ACTIONS: ProhibitedAction[] = [
  { id: 'pa-1', action: 'Synthesize or forge an approval', reason: 'Approvals must be recorded by the authentic authorized actor against current evidence.', authority: 'Authorized domain command + independent actor' },
  { id: 'pa-2', action: 'Record or allocate a payment', reason: 'Payment allocation is a finance clearance command, never an orchestrator side effect.', authority: 'Firm Finance / advance-payment gate' },
  { id: 'pa-3', action: 'Clear AML/KYC or continuance risk', reason: 'Risk clearance requires the Engagement Partner’s current unconditional decision.', authority: 'Engagement Partner (Dual-Key Key 2)' },
  { id: 'pa-4', action: 'Approve planning materiality', reason: 'Materiality approval is a professional judgment reserved for the Partner.', authority: 'Engagement Partner (ISA 320)' },
  { id: 'pa-5', action: 'Sign an audit opinion', reason: 'Only the Partner may select the opinion, sign and affix the firm seal.', authority: 'Engagement Partner (ISA 700/705)' },
  { id: 'pa-6', action: 'Post invoices', reason: 'Invoicing is a controlled finance action, not automatable from a task queue.', authority: 'Firm Finance' },
  { id: 'pa-7', action: 'Issue deliverable release', reason: 'Release authority is verified independently before the bundle reaches the client.', authority: 'Engagement Partner / release checkpoint' },
  { id: 'pa-8', action: 'Freeze or archive files', reason: 'The ISA 230 read-only lock requires an effective committed lock by authorized command.', authority: 'Engagement Partner / records lock' },
];

// ---------------------------------------------------------------------------
// Section 6.5 — Recurring engagement roll-forward plans.
// Prior-year acceptance and opinion sign-offs are NEVER carried forward.
// ---------------------------------------------------------------------------

export const INITIAL_RECURRING_PLANS: RecurringEngagementPlan[] = [
  {
    id: 'rec-1',
    clientLegalName: 'Doha Retail Holdings QPSC',
    baseEngagementId: 'doha-retail-qpsc',
    nextPeriod: '31 December 2027',
    templateId: 'tpl-retail-stat',
    templateRev: 'TPL-REV-2026.2',
    reused: { clientDetails: true, team: true, mappingSuggestions: true },
    requiresFreshAuthorization: { commercialConsent: true, partnerContinuance: true, currentTrialBalance: true, materialityRecalc: true },
    status: 'ready',
  },
  {
    id: 'rec-2',
    clientLegalName: 'Qatar Logistics Group W.L.L.',
    baseEngagementId: 'qatar-logistics-wll',
    nextPeriod: '31 December 2027',
    templateId: 'tpl-logistics-stat',
    templateRev: 'TPL-REV-2026.1',
    reused: { clientDetails: true, team: false, mappingSuggestions: true },
    requiresFreshAuthorization: { commercialConsent: true, partnerContinuance: true, currentTrialBalance: true, materialityRecalc: true },
    status: 'draft',
  },
];
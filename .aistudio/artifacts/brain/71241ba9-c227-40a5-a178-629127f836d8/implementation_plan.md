# AuditSphere (STE Audit Management Platform v2.2)

AuditSphere is a high-density, enterprise-grade desktop audit workstation engineered to execute and visualize the complete 7-phase audit lifecycle under International Standards on Auditing (ISA) and IFRS in Qatari Riyal (QAR). It bridges commercial engagement control, substantive fieldwork execution, audit review loops, regulatory archiving, and client PBC collaboration into an auditable, transparent platform.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and workflow decisions have been confirmed and will guide the implementation:

- **Pre-Loaded Engagement Context (Confirmed)**: Default workspace initializes with *Doha Retail Holdings QPSC* (Statutory Year-End: Dec 31, 2026; Contracted Fee: QAR 20,000; Phase 3 Fieldwork in active execution with split P&L/Balance Sheet variances, concurrency indicators, and open manager review notes). Quick-switchers will also allow exploring *Qatar Logistics Group W.L.L.* (Phase 1 Dual-Key Gatekeeper) and *Gulf Infrastructure JV* (Phase 5 Partner Opinion with Modified ISA 705 qualification).
- **Navigation Architecture (Confirmed)**: A unified 7-phase step chevron top ribbon allows instant, frictionless navigation across all phases (1. Onboarding ➔ 2. Planning ➔ 3. Fieldwork ➔ 4. Manager Review ➔ 5. Partner Sign-Off ➔ 6. Report & Delivery ➔ 7. Archive & Close), coupled with direct sidebar shortcuts for the Isolated Client PBC Portal (Screen 08) and Practice Management & Ledger (Screen 09).
- **Workflow & Calculation Engine (Confirmed)**: Built on standard, rigorous manual audit workflows and deterministic calculators (3-Tier Materiality with ±5% manager tolerance slider, MUS/Attribute sampling calculators, FSLI ratio variances, unadjusted difference comparisons vs. SAD/PM, and ISA 230 countdown timer), ensuring 100% adherence to ISA requirements without AI generation.

---

### 1. Overview & Core Concept

- **What It Does**: Provides a unified audit workstation for accounting firms, audit seniors, review managers, engagement partners, and client CFOs. It enforces statutory audit gates, prevents premature workflow advancement (e.g., locking planning until commercial dual-keys and 50% advance allocation are satisfied, locking partner sign-off if critical bank confirmations are overdue), manages inline substantive workpapers and manager rework loops, and seals files permanently after ISA 230 60-day regulatory limits.
- **Target Audience / Persona**:
  - *Audit Senior / Preparer*: Executes FSLI workprograms, performs sampling, documents physical binder references and digital PBC files, and resolves manager review notes.
  - *Audit Manager / Reviewer*: Establishes materiality benchmarks, issues inline review notes, monitors third-party confirmations, and drafts the Summary Review Memorandum (SRM).
  - *Engagement Partner / Approver*: Validates AML/KYC clearance, signs planning materiality, selects ISA 700/705 audit opinions, affixes official firm seals, and authorizes file locks.
  - *Client CFO / Audit Liaison*: Interacts via the dedicated, isolated Client PBC Portal to upload requested schedules, review holding letters, and view billing vouchers.
- **Key Value**: Enforces rigid regulatory compliance and transparent traceability: every module clearly answers *Trigger ➔ Input ➔ Processing ➔ Storage ➔ Integration ➔ Output ➔ Next Module ➔ End State*.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Dual-Key Gatekeeper & Advance Invoicing*: Review Client Commercial Acceptance (Key 1) and Partner AML Clearance (Key 2); allocate 50% advance payment (QAR 10,000) with official voucher generation to unlock the Planning Workspace.
  2. *Planning & 3-Tier Materiality*: Assign audit team members; provision the 5 standard engagement folders; select TB benchmark (e.g. Normalized PBT @ 5%) to compute Planning Materiality (PM), Tolerable Error (TE), and Summary of Audit Differences (SAD); adjust with ±5% manager slider; execute Partner approval.
  3. *Split-Screen Fieldwork Workspace*: Upper viewport displays Profit & Loss with risk badges and auditor concurrency avatars; lower viewport displays Balance Sheet; clicking any FSLI opens the substantive testing drawer (assertions checklist, sampling engine, physical/digital cross-references) or analytical review drawer (ISA 570 Going Concern ratios).
  4. *Manager Review & Confirmations Blocker*: View open audit notes; trigger manager rework loops returning FSLI to `Under Rework`; monitor third-party confirmations (Bank, AR, AP, Legal) where overdue critical confirmations trigger the high-severity crimson *Holding Letter* hard blocker.
  5. *Partner Opinion Station & Deliverables*: Select ISA 700 Clean or ISA 705 Qualified/Disclaimer/Adverse opinion (dynamically revealing affected FSLI justification box); sign digitally and affix official firm seal; unlock and dispatch the 5-part deliverables bundle (Auditor's Report, Management Letter, LOR, Audit Trail, Final 50% Fee Note).
  6. *ISA 230 Regulatory Lock & Client Portal*: Monitor the active 60-day countdown timer or trigger early lock, shifting the system into read-only immutable mode; switch to the client PBC portal to test document requests, rejection alerts, and billing receipts.
  7. *Practice Management & Ledger*: Log staff timesheets against engagement FSLIs with tiered charge-out rates (Partner: 1,000 QAR/hr to Junior: 200 QAR/hr), calculate live profitability, and view the double-entry firm operational ledger and client AR aging.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Modern Big-4 / Karbon-inspired desktop workstation. High information density, razor-sharp visual hierarchy, restrained surfaces, zero decorative pill clutter, and audit-trail transparency.
  - *Color Palette & Tokens*:
    - Canvas Neutral: `#F8FAFC` (Slate-50)
    - Surface Elevated: `#FFFFFF` (White)
    - Inset Container: `#F1F5F9` (Slate-100)
    - Primary & Audit Slate: `#0F172A` (Slate-900) & `#1E293B` (Slate-800)
    - Accent Brand Blue: `#2563EB` (Blue-600)
    - Low Risk / Approved: Background `#ECFDF5`, Border `#A7F3D0`, Text `#065F46` (Emerald)
    - Moderate Risk / Review: Background `#FFFBEB`, Border `#FDE68A`, Text `#92400E` (Amber)
    - High Risk / Blocker / Rework: Background `#FEF2F2`, Border `#FECACA`, Text `#991B1B` (Crimson)
    - Archived / Read-Only: Background `#F3F4F6`, Border `#D1D5DB`, Text `#374151` (Cold Slate)
  - *Typography*: Clean sans typography with strict monospace/tabular figures (`font-variant-numeric: tabular-nums`) for all monetary amounts in QAR, comparative trial balances, audit indices, and countdown timers.
  - *Zero-Pill Discipline*: Unboxed text metadata with typographic separators (`·`, `/`) for passive info; status badges formatted with clean border/background contrast; interactive segmented controls as functional buttons.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Interactive State Management via Reactive Store with Local Storage Persistence**
  - *Chosen Approach*: Implement a comprehensive client-side state store maintaining full engagement records, phase gates, workprogram checklists, sampling outputs, review notes, confirmations, deliverables, and ledger transactions.
  - *Why*: Enables instant, responsive interaction across all 9 screens without network latency or external database setup hurdles, while preserving user modifications across refreshes and allowing instant scenario resets.
  - *Alternatives Considered*: Pure stateless mock views were rejected because audit gates (e.g. allocating 50% fee, closing review notes, resolving bank confirmations) must reactively unlock subsequent screens.

- **Decision 2: Split Viewport FSLI Layout with Slide-Over Substantive Testing Drawers**
  - *Chosen Approach*: P&L in the top half and Balance Sheet in the bottom half with synchronized scroll and sticky headers. Clicking workprograms opens a right-side drawer that keeps the financial statement context visible underneath.
  - *Why*: Mimics genuine Big-4 audit workstations (e.g. Caseware / Karbon) where auditors need continuous visibility of trial balance variances while testing individual assertions.

- **Decision 3: Complete Working Audit Gates with Interactive Overrides**
  - *Chosen Approach*: Implement real gate conditions (Dual-Key Approval requirement, 50% Advance allocation lock, Holding Letter bank confirmation blocker, ISA 230 lock) with interactive toggles so auditors can experience both blocked states and unlocked resolutions seamlessly.
  - *Why*: Directly fulfills the requirement that every workflow handoff and dependency is visible and testable.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                AUDITSPHERE APPLICATION SHELL                           │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Global Header: Firm Brand · Engagement Switcher · Role Badge · Search · Profile  │  │
│  ├──────────────────────────────────────────────────────────────────────────────────┤  │
│  │ 7-Phase Top Ribbon: 1.Onboarding ➔ 2.Planning ➔ 3.Fieldwork ➔ 4.Review ➔ 5.Sign  │  │
│  │                     ➔ 6.Deliverables ➔ 7.Archive (Active Gates & Blocker Badges) │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────┬──────────────────────────────────────────────────────────┐  │
│  │ SIDEBAR NAVIGATION    │ MAIN WORKSPACE VIEWPORT (Dynamically switched screen)    │  │
│  │                       │                                                          │  │
│  │ Workbench (7 Phases): │ 01. Client Onboarding (Dual-Key & 50% Advance Gate)      │  │
│  │ • 1. Onboarding       │ 02. Audit Planning (Gantt, 5-Folders, 3-Tier Materiality)│  │
│  │ • 2. Planning         │ 03. Fieldwork Execution (Split P&L / B/S, Sampling & AR) │  │
│  │ • 3. Fieldwork        │ 04. Manager Review (Inline Notes, SRM & Confirmations)   │  │
│  │ • 4. Manager Review   │ 05. Partner Sign-Off (ISA 700/705 Opinion & Seal Stamp)  │  │
│  │ • 5. Partner Sign-Off │ 06. Deliverables Bundle (5-Part Bundle & Client Release) │  │
│  │ • 6. Report Delivery  │ 07. Compliance Archive (60-Day ISA 230 Countdown & Lock) │  │
│  │ • 7. Archive & Close  │ 08. Client PBC Portal (Uploads, Rejection Notes, Billing)│  │
│  │                       │ 09. Practice Management & Ledger (Timesheets, AR & TB)   │  │
│  │ Other Modules:        │                                                          │  │
│  │ • External Client PBC │ [Substantive Workprogram & Analytical Review Drawers]    │  │
│  │ • Practice & Ledger   │ [Review Note Creation & Holding Letter Modals]           │  │
│  │ • System Design Map   │ [System Design Architecture & Requirements Traceability] │  │
│  └───────────────────────┴──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State Entities**:
  - `Engagement`: id, clientName, entityStructure, industry, yearEnd, currency (QAR), contractedFee, advanceInvoiceStatus, commercialKeyStatus, partnerKycStatus, currentPhase, isArchived, countdownDaysRemaining, assignedTeam.
  - `MaterialityConfig`: benchmarkType, benchmarkValue, planningMateriality, tolerableErrorPercent, tolerableError, sadPercent, sadValue, managerRoundingOffset, partnerApprovalStatus.
  - `FSLIRow`: id, code, category (PL | BS), name, currentYearBalance, priorYearBalance, variancePercent, riskLevel (Low | Medium | High), concurrentAuditor, testingStatus, assertions, samplingResults, binderReference.
  - `ReviewNote`: id, fsliId, fsliName, raisedBy, targetPreparer, reasonText, status (Open | Under Rework | Resolved), timestamp.
  - `ConfirmationItem`: id, type (Bank | AR | AP | Legal | Inventory), recipient, balanceQAR, isCritical, status (Dispatched | Received | Pending).
  - `PartnerSignOff`: opinionType (Clean | Qualified | Disclaimer | Adverse), affectedFSLIs, isa705Justification, partnerSignatureHash, firmSealAffixed, signOffTimestamp.
  - `DeliverablesBundle`: auditorReportStatus, managementLetterStatus, lorStatus, correspondencesStatus, finalInvoiceStatus, dispatchedToClient.
  - `PracticeLedger`: timesheets (staff, hours, rate, engagementId), firmJournalEntries, arAgingBuckets.

- **Interactive State Transitions**:
  - *Phase 1 ➔ Phase 2 Gate*: Requires `commercialKeyStatus === 'Approved'`, `partnerKycStatus === 'Approved'`, and `advanceInvoiceStatus === 'Allocated'`. Unlocks Phase 2 button.
  - *Phase 2 ➔ Phase 3 Gate*: Requires Partner sign-off on materiality calculations.
  - *Phase 3 ➔ Phase 4 Gate*: Requires all high-risk FSLIs submitted for review.
  - *Phase 4 Blocker*: If any critical confirmation is `Pending`, crimson blocker activates and Partner sign-off is locked until confirmation is received or holding letter is issued.
  - *Phase 5 Opinion Builder*: Selecting Qualified/Disclaimer/Adverse opens the mandatory ISA 705 justification editor with live preview in the Basis for Qualified Opinion clause.
  - *Phase 7 Permanent Lock*: Engaging early archive lock or timer expiration disables all mutation controls, applies a persistent slate header banner, and enables the regulator inspection package export.

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Engagement,
  AuditRole,
  AuditPhaseId,
  MaterialityConfig,
  FSLIRow,
  ReviewNote,
  ConfirmationItem,
  PartnerSignOff,
  TimesheetEntry,
  JournalEntry,
  ARAgingItem,
  SamplingResult,
  ToastNotification,
  ToastType,
} from '@/types/audit';
import {
  INITIAL_ENGAGEMENTS,
  INITIAL_TIMESHEETS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_AR_AGING,
} from '@/lib/mock-data';

export type ScreenView =
  | 'phase-1'
  | 'phase-2'
  | 'phase-3'
  | 'phase-4'
  | 'phase-5'
  | 'phase-6'
  | 'phase-7'
  | 'client-portal'
  | 'practice-ledger'
  | 'system-blueprint';

interface AuditStoreContextType {
  engagements: Engagement[];
  currentEngagement: Engagement;
  currentScreen: ScreenView;
  userRole: AuditRole;
  selectedFSLI: FSLIRow | null;
  activeDrawer: 'none' | 'workprogram' | 'analytical';
  // Modals
  receiptModalOpen: boolean;
  holdingLetterModalOpen: boolean;
  reviewNoteModalOpen: boolean;
  exportModalOpen: boolean;
  timesheetModalOpen: boolean;
  selectedConfirmationForHolding: ConfirmationItem | null;
  // Timesheets & Ledgers
  timesheets: TimesheetEntry[];
  journalEntries: JournalEntry[];
  arAging: ARAgingItem[];
  // Sync & Loading State
  isLoading: boolean;
  isSyncing: boolean;
  refreshData: () => void;
  // Global Toast Notifications
  toasts: ToastNotification[];
  addToast: (title: string, description?: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  // Actions
  switchEngagement: (id: string) => void;
  navigateToScreen: (screen: ScreenView) => void;
  setUserRole: (role: AuditRole) => void;
  // Phase 1 Actions
  toggleCommercialKey: () => void;
  togglePartnerKYC: () => void;
  allocateAdvancePayment: (ref: string) => void;
  openReceiptModal: () => void;
  closeReceiptModal: () => void;
  // Phase 2 Actions
  updateMateriality: (config: Partial<MaterialityConfig>) => void;
  partnerApproveMateriality: () => void;
  // Phase 3 Actions
  openWorkprogramDrawer: (fsliId: string) => void;
  openAnalyticalDrawer: (fsliId: string) => void;
  closeDrawer: () => void;
  toggleAssertion: (fsliId: string, assertionId: string) => void;
  updateSampling: (fsliId: string, sampling: Partial<SamplingResult>) => void;
  addCustomProcedure: (fsliId: string, title: string, ref: string) => void;
  submitFSLIForReview: (fsliId: string) => void;
  updatePhysicalBinderRef: (fsliId: string, ref: string) => void;
  // Phase 4 Actions
  openReviewNoteModal: () => void;
  closeReviewNoteModal: () => void;
  addReviewNote: (fsliId: string, noteText: string) => void;
  resolveReviewNote: (noteId: string) => void;
  updateConfirmationStatus: (confId: string, status: 'Dispatched' | 'Received' | 'Pending') => void;
  openHoldingLetterModal: (conf?: ConfirmationItem) => void;
  closeHoldingLetterModal: () => void;
  dispatchHoldingLetter: (recipient: string, letterText: string) => void;
  // Phase 5 Actions
  updatePartnerSignOff: (signOff: Partial<PartnerSignOff>) => void;
  executeFinalSignOff: () => void;
  // Phase 6 Actions
  freezeClientUploads: (frozen: boolean) => void;
  dispatchDeliverablesToClient: () => void;
  // Phase 7 Actions
  toggleArchiveLock: () => void;
  openExportModal: () => void;
  closeExportModal: () => void;
  // Client Portal Actions
  uploadClientDocument: (requestId: string, fileName: string) => void;
  // Practice Management Actions
  openTimesheetModal: () => void;
  closeTimesheetModal: () => void;
  addTimesheetEntry: (entry: Omit<TimesheetEntry, 'id'>) => void;
  resetAllData: () => void;
}

const AuditStoreContext = createContext<AuditStoreContextType | null>(null);

const STORAGE_KEY = 'auditsphere_v2_state';

export function AuditStoreProvider({ children }: { children: React.ReactNode }) {
  // Financial practice data
  const [engagements, setEngagements] = useState<Engagement[]>(INITIAL_ENGAGEMENTS);
  const [currentEngagementId, setCurrentEngagementId] = useState<string>('doha-retail-qpsc');
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('phase-3');
  const [userRole, setUserRole] = useState<AuditRole>('REVIEWER');
  const [selectedFSLIId, setSelectedFSLIId] = useState<string | null>('fsli-1');
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'workprogram' | 'analytical'>('none');

  // Modals
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [holdingLetterModalOpen, setHoldingLetterModalOpen] = useState(false);
  const [reviewNoteModalOpen, setReviewNoteModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [timesheetModalOpen, setTimesheetModalOpen] = useState(false);
  const [selectedConfirmationForHolding, setSelectedConfirmationForHolding] = useState<ConfirmationItem | null>(null);

  // Financial practice data
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(INITIAL_TIMESHEETS);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL_ENTRIES);
  const [arAging, setArAging] = useState<ARAgingItem[]>(INITIAL_AR_AGING);

  // Sync & Loading State
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Global Toast Notifications State
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = React.useCallback(
    (title: string, description?: string, type: ToastType = 'success', duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newToast: ToastNotification = {
        id,
        title,
        description,
        type,
        timestamp: Date.now(),
        duration,
      };
      setToasts((prev) => [...prev.slice(-3), newToast]);
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  // Load from localStorage safely after mount to prevent hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.engagements) setEngagements(parsed.engagements);
          if (parsed.currentEngagementId) setCurrentEngagementId(parsed.currentEngagementId);
          if (parsed.timesheets) setTimesheets(parsed.timesheets);
        }
      } catch {
        // Ignore storage error
      }
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const refreshData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      addToast(
        'Data Synchronized',
        'Engagement trial balances, FSLI schedules & PBC requests synchronized with QAR ledger.',
        'success'
      );
    }, 450);
  };

  // Sync to localStorage
  const saveState = (updatedEngagements: Engagement[], updatedTimesheets?: TimesheetEntry[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          engagements: updatedEngagements,
          currentEngagementId,
          timesheets: updatedTimesheets || timesheets,
        })
      );
    } catch {
      // Ignore storage error
    }
  };

  const currentEngagement =
    engagements.find((e) => e.id === currentEngagementId) || engagements[0];

  const selectedFSLI =
    currentEngagement.fsliList.find((f) => f.id === selectedFSLIId) ||
    currentEngagement.fsliList[0] ||
    null;

  const updateCurrentEngagement = (updater: (prev: Engagement) => Engagement) => {
    setEngagements((prev) => {
      const updated = prev.map((eng) => (eng.id === currentEngagementId ? updater(eng) : eng));
      saveState(updated);
      return updated;
    });
  };

  const switchEngagement = (id: string) => {
    setIsSyncing(true);
    setCurrentEngagementId(id);
    const target = engagements.find((e) => e.id === id);
    if (target) {
      if (target.currentPhase === 1) setCurrentScreen('phase-1');
      else if (target.currentPhase === 2) setCurrentScreen('phase-2');
      else if (target.currentPhase === 3) setCurrentScreen('phase-3');
      else if (target.currentPhase === 4) setCurrentScreen('phase-4');
      else if (target.currentPhase === 5) setCurrentScreen('phase-5');
      else if (target.currentPhase === 6) setCurrentScreen('phase-6');
      else if (target.currentPhase === 7) setCurrentScreen('phase-7');
      if (target.fsliList.length > 0) {
        setSelectedFSLIId(target.fsliList[0].id);
      }
      setTimeout(() => {
        setIsSyncing(false);
        addToast(
          'Engagement Loaded',
          `Active workspace switched to ${target.clientLegalName} (${target.statutoryYearEnd}).`,
          'info'
        );
      }, 350);
    } else {
      setTimeout(() => {
        setIsSyncing(false);
      }, 350);
    }
  };

  const navigateToScreen = (screen: ScreenView) => {
    setCurrentScreen(screen);
    setActiveDrawer('none');
  };

  // Phase 1 Actions
  const toggleCommercialKey = () => {
    updateCurrentEngagement((eng) => {
      const isApproved = eng.commercialKey.status === 'Approved';
      return {
        ...eng,
        commercialKey: {
          ...eng.commercialKey,
          status: isApproved ? 'Pending' : 'Approved',
          acceptedAt: isApproved ? 'Pending' : new Date().toLocaleString(),
          attachmentName: isApproved ? '' : 'Signed_Quotation_Acceptance.pdf',
        },
        auditTrail: [
          ...eng.auditTrail,
          {
            id: `at-${Date.now()}`,
            action: `Client Commercial Key changed to ${isApproved ? 'Pending' : 'Approved'}`,
            performedBy: userRole,
            timestamp: new Date().toLocaleTimeString(),
            phase: 'Onboarding',
          },
        ],
      };
    });
  };

  const togglePartnerKYC = () => {
    updateCurrentEngagement((eng) => {
      const isApproved = eng.partnerKyc.status === 'Unconditional Approval';
      return {
        ...eng,
        partnerKyc: {
          ...eng.partnerKyc,
          status: isApproved ? 'Conditional Hold' : 'Unconditional Approval',
          uboVerified: !isApproved,
          amlSanctionsCleared: !isApproved,
          isqc1IndependenceCleared: !isApproved,
          conflictCleared: !isApproved,
          partnerSignatureHash: isApproved ? '' : '0x' + Math.random().toString(16).substring(2, 10),
          approvedAt: isApproved ? '' : new Date().toLocaleString(),
        },
        auditTrail: [
          ...eng.auditTrail,
          {
            id: `at-${Date.now()}`,
            action: `Partner AML/KYC clearance status updated to ${isApproved ? 'Conditional Hold' : 'Unconditional Approval'}`,
            performedBy: userRole,
            timestamp: new Date().toLocaleTimeString(),
            phase: 'Onboarding',
          },
        ],
      };
    });
  };

  const allocateAdvancePayment = (ref: string) => {
    const voucherNo = `RV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    updateCurrentEngagement((eng) => ({
      ...eng,
      advanceInvoice: {
        ...eng.advanceInvoice,
        status: 'Allocated',
        paymentRef: ref || 'TRF-ALLOCATED-OK',
        paidAt: new Date().toLocaleString(),
        receiptVoucherNo: voucherNo,
      },
      currentPhase: eng.currentPhase === 1 ? 2 : eng.currentPhase,
      auditTrail: [
        ...eng.auditTrail,
        {
          id: `at-${Date.now()}`,
          action: `50% Advance Fee allocated (Ref: ${ref}). Gate cleared to Planning.`,
          performedBy: 'Firm Finance',
          timestamp: new Date().toLocaleTimeString(),
          phase: 'Onboarding',
        },
      ],
    }));
    addToast(
      'Payment Allocated',
      `Official Receipt Voucher generated (${voucherNo}) for 50% advance. Phase 2 Planning unlocked.`,
      'success'
    );
  };

  const openReceiptModal = () => setReceiptModalOpen(true);
  const closeReceiptModal = () => setReceiptModalOpen(false);

  // Phase 2 Actions
  const updateMateriality = (config: Partial<MaterialityConfig>) => {
    updateCurrentEngagement((eng) => {
      const current = eng.materiality;
      const benchmarkBase = config.benchmarkBaseQAR ?? current.benchmarkBaseQAR;
      const benchmarkPercent = config.benchmarkPercent ?? current.benchmarkPercent;
      const basePM = (benchmarkBase * benchmarkPercent) / 100;
      const offsetPercent = config.managerRoundingOffsetPercent ?? current.managerRoundingOffsetPercent;
      const adjustedPM = Math.round(basePM * (1 + offsetPercent / 100));
      const tePercent = config.tolerableErrorPercent ?? current.tolerableErrorPercent;
      const teValue = Math.round((adjustedPM * tePercent) / 100);
      const sadPercent = config.sadPercent ?? current.sadPercent;
      const sadValue = Math.round((adjustedPM * sadPercent) / 100);

      return {
        ...eng,
        materiality: {
          ...current,
          ...config,
          planningMaterialityQAR: basePM,
          adjustedPlanningMaterialityQAR: adjustedPM,
          tolerableErrorPercent: tePercent,
          tolerableErrorQAR: teValue,
          sadPercent: sadPercent,
          sadQAR: sadValue,
          managerRoundingOffsetPercent: offsetPercent,
        },
      };
    });
  };

  const partnerApproveMateriality = () => {
    updateCurrentEngagement((eng) => ({
      ...eng,
      materiality: {
        ...eng.materiality,
        partnerApproved: true,
        approvedBy: 'Tariq Al-Mansoor, FCA',
        approvedAt: new Date().toLocaleString(),
      },
      currentPhase: eng.currentPhase === 2 ? 3 : eng.currentPhase,
      auditTrail: [
        ...eng.auditTrail,
        {
          id: `at-${Date.now()}`,
          action: 'Partner approved 3-Tier Planning Materiality. Phase 3 unlocked.',
          performedBy: 'Tariq Al-Mansoor, FCA',
          timestamp: new Date().toLocaleTimeString(),
          phase: 'Planning',
        },
      ],
    }));
    addToast(
      'Materiality Approved',
      'Partner signed off on 3-Tier Planning Materiality. Phase 3 Fieldwork unlocked.',
      'success'
    );
  };

  // Phase 3 Actions
  const openWorkprogramDrawer = (fsliId: string) => {
    setSelectedFSLIId(fsliId);
    setActiveDrawer('workprogram');
  };

  const openAnalyticalDrawer = (fsliId: string) => {
    setSelectedFSLIId(fsliId);
    setActiveDrawer('analytical');
  };

  const closeDrawer = () => {
    setActiveDrawer('none');
  };

  const toggleAssertion = (fsliId: string, assertionId: string) => {
    updateCurrentEngagement((eng) => ({
      ...eng,
      fsliList: eng.fsliList.map((f) => {
        if (f.id !== fsliId) return f;
        const updatedAssertions = f.assertions.map((a) =>
          a.id === assertionId ? { ...a, tested: !a.tested } : a
        );
        const allTested = updatedAssertions.every((a) => a.tested);
        return {
          ...f,
          assertions: updatedAssertions,
          testingStatus: allTested ? 'Ready for Review' : 'In Progress',
        };
      }),
    }));
  };

  const updateSampling = (fsliId: string, sampling: Partial<SamplingResult>) => {
    updateCurrentEngagement((eng) => ({
      ...eng,
      fsliList: eng.fsliList.map((f) =>
        f.id === fsliId && f.sampling
          ? {
              ...f,
              sampling: { ...f.sampling, ...sampling },
            }
          : f
      ),
    }));
  };

  const addCustomProcedure = (fsliId: string, title: string, ref: string) => {
    updateCurrentEngagement((eng) => ({
      ...eng,
      fsliList: eng.fsliList.map((f) =>
        f.id === fsliId
          ? {
              ...f,
              customProcedures: [
                ...f.customProcedures,
                {
                  id: `cp-${Date.now()}`,
                  title,
                  reference: ref || `WP-${f.code}-${f.customProcedures.length + 1}`,
                  completed: false,
                },
              ],
            }
          : f
      ),
    }));
  };

  const submitFSLIForReview = (fsliId: string) => {
    const targetFSLI = currentEngagement.fsliList.find((f) => f.id === fsliId);
    updateCurrentEngagement((eng) => ({
      ...eng,
      fsliList: eng.fsliList.map((f) =>
        f.id === fsliId ? { ...f, testingStatus: 'Ready for Review' } : f
      ),
      auditTrail: [
        ...eng.auditTrail,
        {
          id: `at-${Date.now()}`,
          action: `FSLI ${fsliId} submitted for Manager Review`,
          performedBy: userRole,
          timestamp: new Date().toLocaleTimeString(),
          phase: 'Fieldwork',
        },
      ],
    }));
    closeDrawer();
    addToast(
      'FSLI Submitted',
      `${targetFSLI ? targetFSLI.name : 'Substantive testing workprogram'} submitted for Manager Review.`,
      'info'
    );
  };

  const updatePhysicalBinderRef = (fsliId: string, ref: string) => {
    updateCurrentEngagement((eng) => ({
      ...eng,
      fsliList: eng.fsliList.map((f) => (f.id === fsliId ? { ...f, physicalBinderRef: ref } : f)),
    }));
  };

  // Phase 4 Actions
  const openReviewNoteModal = () => setReviewNoteModalOpen(true);
  const closeReviewNoteModal = () => setReviewNoteModalOpen(false);

  const addReviewNote = (fsliId: string, noteText: string) => {
    const targetFSLI = currentEngagement.fsliList.find((f) => f.id === fsliId);
    const newNote: ReviewNote = {
      id: `rn-${Date.now()}`,
      fsliId,
      fsliName: targetFSLI ? targetFSLI.name : 'Substantive Procedure',
      procedureRef: targetFSLI ? `WP-${targetFSLI.code}` : 'WP-AUDIT',
      raisedBy: 'Rashid Kamal, ACCA (Manager)',
      assignedTo: targetFSLI?.assignedAuditor || 'Sarah Ahmed, CPA',
      noteText,
      status: 'Under Rework',
      createdAt: new Date().toLocaleString(),
    };

    updateCurrentEngagement((eng) => ({
      ...eng,
      reviewNotes: [newNote, ...eng.reviewNotes],
      fsliList: eng.fsliList.map((f) => (f.id === fsliId ? { ...f, testingStatus: 'Under Rework' } : f)),
      auditTrail: [
        ...eng.auditTrail,
        {
          id: `at-${Date.now()}`,
          action: `Review Note created. ${targetFSLI?.code} returned to Under Rework.`,
          performedBy: 'Rashid Kamal, ACCA',
          timestamp: new Date().toLocaleTimeString(),
          phase: 'Review',
        },
      ],
    }));
    setReviewNoteModalOpen(false);
    addToast(
      'Note Submitted',
      `Manager review note created for ${targetFSLI ? targetFSLI.name : 'procedure'}. Procedure returned to Under Rework.`,
      'warning'
    );
  };

  const resolveReviewNote = (noteId: string) => {
    updateCurrentEngagement((eng) => {
      const updatedNotes = eng.reviewNotes.map((n) =>
        n.id === noteId ? { ...n, status: 'Resolved' as const } : n
      );
      return {
        ...eng,
        reviewNotes: updatedNotes,
        auditTrail: [
          ...eng.auditTrail,
          {
            id: `at-${Date.now()}`,
            action: `Review note ${noteId} marked as Resolved.`,
            performedBy: userRole,
            timestamp: new Date().toLocaleTimeString(),
            phase: 'Review',
          },
        ],
      };
    });
    addToast(
      'Note Resolved',
      'Manager review note verified and closed.',
      'success'
    );
  };

  const updateConfirmationStatus = (
    confId: string,
    status: 'Dispatched' | 'Received' | 'Pending'
  ) => {
    updateCurrentEngagement((eng) => ({
      ...eng,
      confirmations: eng.confirmations.map((c) =>
        c.id === confId ? { ...c, status, lastFollowUp: new Date().toISOString().split('T')[0] } : c
      ),
      auditTrail: [
        ...eng.auditTrail,
        {
          id: `at-${Date.now()}`,
          action: `Confirmation ${confId} status updated to ${status}`,
          performedBy: userRole,
          timestamp: new Date().toLocaleTimeString(),
          phase: 'Review',
        },
      ],
    }));
    addToast(
      'Confirmation Updated',
      `Third-party circularization status updated to ${status}.`,
      'info'
    );
  };

  const openHoldingLetterModal = (conf?: ConfirmationItem) => {
    if (conf) setSelectedConfirmationForHolding(conf);
    else {
      const pendingCritical = currentEngagement.confirmations.find(
        (c) => c.isCritical && c.status === 'Pending'
      );
      setSelectedConfirmationForHolding(pendingCritical || currentEngagement.confirmations[0]);
    }
    setHoldingLetterModalOpen(true);
  };

  const closeHoldingLetterModal = () => {
    setHoldingLetterModalOpen(false);
    setSelectedConfirmationForHolding(null);
  };

  const dispatchHoldingLetter = (recipient: string, _letterText: string) => {
    updateCurrentEngagement((eng) => ({
      ...eng,
      auditTrail: [
        ...eng.auditTrail,
        {
          id: `at-${Date.now()}`,
          action: `Holding Letter dispatched to Client Management for ${recipient}. Temporary holding waiver registered.`,
          performedBy: userRole,
          timestamp: new Date().toLocaleTimeString(),
          phase: 'Review',
        },
      ],
    }));
    closeHoldingLetterModal();
    addToast(
      'Client Notified',
      `ISA 505 holding letter dispatched to ${recipient}. Temporary confirmation waiver registered.`,
      'warning'
    );
  };

  // Phase 5 Actions
  const updatePartnerSignOff = (signOff: Partial<PartnerSignOff>) => {
    updateCurrentEngagement((eng) => ({
      ...eng,
      partnerSignOff: {
        ...eng.partnerSignOff,
        ...signOff,
      },
    }));
  };

  const executeFinalSignOff = () => {
    updateCurrentEngagement((eng) => ({
      ...eng,
      partnerSignOff: {
        ...eng.partnerSignOff,
        partnerSignatureHash: '0x' + Math.random().toString(16).substring(2, 12),
        firmSealAffixed: true,
        signOffTimestamp: new Date().toLocaleString(),
      },
      currentPhase: eng.currentPhase < 6 ? 6 : eng.currentPhase,
      deliverables: {
        ...eng.deliverables,
        auditorReportStatus: 'Signed',
        managementLetterStatus: 'Generated',
        lorStatus: 'Signed',
        correspondencesStatus: 'Generated',
        finalInvoiceStatus: 'Generated',
      },
      auditTrail: [
        ...eng.auditTrail,
        {
          id: `at-${Date.now()}`,
          action: `Partner executed final audit sign-off with firm seal (${eng.partnerSignOff.opinionType}). Reporting phase unlocked.`,
          performedBy: 'Tariq Al-Mansoor, FCA',
          timestamp: new Date().toLocaleTimeString(),
          phase: 'Partner Sign-Off',
        },
      ],
    }));
    addToast(
      'Partner Sign-Off Executed',
      'Statutory audit opinion signed and official firm seal affixed.',
      'success'
    );
  };

  // Phase 6 Actions
  const freezeClientUploads = (frozen: boolean) => {
    updateCurrentEngagement((eng) => ({
      ...eng,
      deliverables: {
        ...eng.deliverables,
        clientUploadsFrozen: frozen,
      },
      auditTrail: [
        ...eng.auditTrail,
        {
          id: `at-${Date.now()}`,
          action: `Client Portal upload privileges ${frozen ? 'FROZEN' : 'RESTORED'}.`,
          performedBy: userRole,
          timestamp: new Date().toLocaleTimeString(),
          phase: 'Report & Delivery',
        },
      ],
    }));
    addToast(
      frozen ? 'Uploads Frozen' : 'Uploads Restored',
      frozen ? 'Client document upload privileges have been locked.' : 'Client document upload privileges restored.',
      'info'
    );
  };

  const dispatchDeliverablesToClient = () => {
    updateCurrentEngagement((eng) => ({
      ...eng,
      deliverables: {
        ...eng.deliverables,
        auditorReportStatus: 'Dispatched',
        managementLetterStatus: 'Dispatched',
        lorStatus: 'Dispatched',
        correspondencesStatus: 'Dispatched',
        clientUploadsFrozen: true,
        dispatchedAt: new Date().toLocaleString(),
      },
      currentPhase: 7,
      auditTrail: [
        ...eng.auditTrail,
        {
          id: `at-${Date.now()}`,
          action: 'Mandatory 5-Part Deliverables Bundle dispatched to Client Portal. Client uploads sealed.',
          performedBy: userRole,
          timestamp: new Date().toLocaleTimeString(),
          phase: 'Report & Delivery',
        },
      ],
    }));
    addToast(
      'Client Notified',
      'Mandatory 5-Part Deliverables Package dispatched to Client Portal. Client uploads sealed.',
      'success'
    );
  };

  // Phase 7 Actions
  const toggleArchiveLock = () => {
    let willLock = false;
    updateCurrentEngagement((eng) => {
      const isLocked = !eng.isPermanentlyArchived;
      willLock = isLocked;
      return {
        ...eng,
        isPermanentlyArchived: isLocked,
        auditTrail: [
          ...eng.auditTrail,
          {
            id: `at-${Date.now()}`,
            action: isLocked
              ? 'FILE PERMANENTLY LOCKED under ISA 230 Regulatory Compliance. System shifted to read-only.'
              : 'Regulatory file lock temporarily waived by Authorized Partner.',
            performedBy: 'Tariq Al-Mansoor, FCA (Audit Partner)',
            timestamp: new Date().toLocaleTimeString(),
            phase: 'Archive & Close',
          },
        ],
      };
    });
    if (willLock) {
      addToast(
        'File Archived',
        'Audit file permanently locked under ISA 230 regulatory compliance.',
        'success'
      );
    } else {
      addToast(
        'Regulatory Lock Waived',
        'Audit partner authorization verified. File unlocked for temporary adjustments.',
        'warning'
      );
    }
  };

  const openExportModal = () => setExportModalOpen(true);
  const closeExportModal = () => setExportModalOpen(false);

  // Client Portal Actions
  const uploadClientDocument = (requestId: string, fileName: string) => {
    updateCurrentEngagement((eng) => ({
      ...eng,
      clientRequests: eng.clientRequests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Under Review',
              uploadedFileName: fileName,
              uploadedAt: new Date().toLocaleString(),
            }
          : r
      ),
      auditTrail: [
        ...eng.auditTrail,
        {
          id: `at-${Date.now()}`,
          action: `Client uploaded document: ${fileName} for request ${requestId}`,
          performedBy: 'Client CFO',
          timestamp: new Date().toLocaleTimeString(),
          phase: 'Fieldwork',
        },
      ],
    }));
    addToast(
      'Document Uploaded',
      `${fileName} uploaded to audit engagement folder. Status set to Under Review.`,
      'success'
    );
  };

  // Practice Management Actions
  const openTimesheetModal = () => setTimesheetModalOpen(true);
  const closeTimesheetModal = () => setTimesheetModalOpen(false);

  const addTimesheetEntry = (entry: Omit<TimesheetEntry, 'id'>) => {
    const newEntry: TimesheetEntry = {
      ...entry,
      id: `ts-${Date.now()}`,
    };
    const updated = [newEntry, ...timesheets];
    setTimesheets(updated);
    saveState(engagements, updated);
    closeTimesheetModal();
    addToast(
      'Timesheet Logged',
      `${entry.hours} hours recorded for ${entry.staffName} (QAR ${(entry.hours * entry.chargeOutRateQAR).toLocaleString()}).`,
      'success'
    );
  };

  const resetAllData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    setEngagements(INITIAL_ENGAGEMENTS);
    setCurrentEngagementId('doha-retail-qpsc');
    setCurrentScreen('phase-3');
    setTimesheets(INITIAL_TIMESHEETS);
    setJournalEntries(INITIAL_JOURNAL_ENTRIES);
    setArAging(INITIAL_AR_AGING);
    addToast(
      'Workspace Reset',
      'All engagement data, schedules & timesheets restored to demo baseline.',
      'info'
    );
  };

  return (
    <AuditStoreContext.Provider
      value={{
        engagements,
        currentEngagement,
        currentScreen,
        userRole,
        selectedFSLI,
        activeDrawer,
        receiptModalOpen,
        holdingLetterModalOpen,
        reviewNoteModalOpen,
        exportModalOpen,
        timesheetModalOpen,
        selectedConfirmationForHolding,
        timesheets,
        journalEntries,
        arAging,
        isLoading,
        isSyncing,
        refreshData,
        toasts,
        addToast,
        removeToast,
        switchEngagement,
        navigateToScreen,
        setUserRole,
        toggleCommercialKey,
        togglePartnerKYC,
        allocateAdvancePayment,
        openReceiptModal,
        closeReceiptModal,
        updateMateriality,
        partnerApproveMateriality,
        openWorkprogramDrawer,
        openAnalyticalDrawer,
        closeDrawer,
        toggleAssertion,
        updateSampling,
        addCustomProcedure,
        submitFSLIForReview,
        updatePhysicalBinderRef,
        openReviewNoteModal,
        closeReviewNoteModal,
        addReviewNote,
        resolveReviewNote,
        updateConfirmationStatus,
        openHoldingLetterModal,
        closeHoldingLetterModal,
        dispatchHoldingLetter,
        updatePartnerSignOff,
        executeFinalSignOff,
        freezeClientUploads,
        dispatchDeliverablesToClient,
        toggleArchiveLock,
        openExportModal,
        closeExportModal,
        uploadClientDocument,
        openTimesheetModal,
        closeTimesheetModal,
        addTimesheetEntry,
        resetAllData,
      }}
    >
      {children}
    </AuditStoreContext.Provider>
  );
}

export function useAuditStore() {
  const context = useContext(AuditStoreContext);
  if (!context) {
    throw new Error('useAuditStore must be used within an AuditStoreProvider');
  }
  return context;
}

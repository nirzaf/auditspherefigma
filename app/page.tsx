'use client';

import React from 'react';
import { AuditStoreProvider, useAuditStore } from '@/lib/store';
import { HeaderBar } from '@/components/layout/HeaderBar';
import { ProgressRibbon } from '@/components/layout/ProgressRibbon';
import { Sidebar } from '@/components/layout/Sidebar';
import { Screen01Onboarding } from '@/components/screens/Screen01Onboarding';
import { Screen02Planning } from '@/components/screens/Screen02Planning';
import { Screen03Fieldwork } from '@/components/screens/Screen03Fieldwork';
import { Screen04Review } from '@/components/screens/Screen04Review';
import { Screen05PartnerSignOff } from '@/components/screens/Screen05PartnerSignOff';
import { Screen06Deliverables } from '@/components/screens/Screen06Deliverables';
import { Screen07Archive } from '@/components/screens/Screen07Archive';
import { Screen08ClientPortal } from '@/components/screens/Screen08ClientPortal';
import { Screen09PracticeLedger } from '@/components/screens/Screen09PracticeLedger';
import { ScreenArchitectureMap } from '@/components/screens/ScreenArchitectureMap';
import { ScreenWorkflowDashboard } from '@/components/screens/ScreenWorkflowDashboard';
import { ScreenPracticeTemplates } from '@/components/screens/ScreenPracticeTemplates';

import { ReceiptVoucherModal } from '@/components/modals/ReceiptVoucherModal';
import { HoldingLetterModal } from '@/components/modals/HoldingLetterModal';
import { ReviewNoteModal } from '@/components/modals/ReviewNoteModal';
import { InspectionExportModal } from '@/components/modals/InspectionExportModal';
import { TimesheetModal } from '@/components/modals/TimesheetModal';
import { DocumentPreviewModal } from '@/components/modals/DocumentPreviewModal';
import { ScreenSkeleton } from '@/components/ui/AuditSkeleton';
import { ToastContainer } from '@/components/ui/ToastContainer';

function AuditSphereWorkspace() {
  const { currentScreen, currentEngagement, isLoading, isSyncing } = useAuditStore();

  const isArchived = currentEngagement.isPermanentlyArchived;

  const getSkeletonType = (): 'dashboard' | 'client-portal' | 'cards' => {
    if (currentScreen === 'client-portal') return 'client-portal';
    if (['phase-1', 'phase-2', 'phase-6'].includes(currentScreen)) return 'cards';
    return 'dashboard';
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-slate-100 ${
        isArchived ? 'bg-slate-200/50' : ''
      }`}
    >
      {/* Pinned Top Bar */}
      <HeaderBar />

      {/* Engagement 7-Phase Progress Ribbon */}
      <ProgressRibbon />

      {/* Main Body with Sidebar + Content Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Dynamic Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
          {isLoading || isSyncing ? (
            <ScreenSkeleton type={getSkeletonType()} />
          ) : (
            <>
              {currentScreen === 'phase-1' && <Screen01Onboarding />}
              {currentScreen === 'phase-2' && <Screen02Planning />}
              {currentScreen === 'phase-3' && <Screen03Fieldwork />}
              {currentScreen === 'phase-4' && <Screen04Review />}
              {currentScreen === 'phase-5' && <Screen05PartnerSignOff />}
              {currentScreen === 'phase-6' && <Screen06Deliverables />}
              {currentScreen === 'phase-7' && <Screen07Archive />}
              {currentScreen === 'client-portal' && <Screen08ClientPortal />}
              {currentScreen === 'practice-ledger' && <Screen09PracticeLedger />}
              {currentScreen === 'workflow-dashboard' && <ScreenWorkflowDashboard />}
              {currentScreen === 'practice-templates' && <ScreenPracticeTemplates />}
              {currentScreen === 'system-blueprint' && <ScreenArchitectureMap />}
            </>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <ReceiptVoucherModal />
      <HoldingLetterModal />
      <ReviewNoteModal />
      <InspectionExportModal />
      <TimesheetModal />
      <DocumentPreviewModal />

      {/* Global Toast Notification System */}
      <ToastContainer />
    </div>
  );
}

export default function Page() {
  return (
    <AuditStoreProvider>
      <AuditSphereWorkspace />
    </AuditStoreProvider>
  );
}

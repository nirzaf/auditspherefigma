'use client';

import React from 'react';
import { useAuditStore, ScreenView } from '@/lib/store';
import { GlobalSyncBadge } from '@/components/ui/AuditSkeleton';
import {
  AlertTriangle,
  Lock,
} from 'lucide-react';

interface PhaseDefinition {
  id: number;
  screen: ScreenView;
  title: string;
  subtitle: string;
}

const PHASES: PhaseDefinition[] = [
  { id: 1, screen: 'phase-1', title: '1. Onboarding', subtitle: 'Dual-Key & Advance' },
  { id: 2, screen: 'phase-2', title: '2. Planning', subtitle: 'Materiality Engine' },
  { id: 3, screen: 'phase-3', title: '3. Fieldwork', subtitle: 'Split FSLI Workspace' },
  { id: 4, screen: 'phase-4', title: '4. Manager Review', subtitle: 'Notes & Confirmations' },
  { id: 5, screen: 'phase-5', title: '5. Partner Sign-Off', subtitle: 'ISA 700/705 Opinion' },
  { id: 6, screen: 'phase-6', title: '6. Report & Delivery', subtitle: '5-Part Bundle Release' },
  { id: 7, screen: 'phase-7', title: '7. Archive & Close', subtitle: 'ISA 230 Regulatory Lock' },
];

export function ProgressRibbon() {
  const { currentEngagement, currentScreen, navigateToScreen, isSyncing } = useAuditStore();

  // Determine active blocker
  const dualKeyMissing =
    currentEngagement.commercialKey.status !== 'Approved' ||
    currentEngagement.partnerKyc.status !== 'Unconditional Approval';
  const advanceUnallocated = currentEngagement.advanceInvoice.status !== 'Allocated';
  const bankConfirmationPending = currentEngagement.confirmations.some(
    (c) => c.isCritical && c.status === 'Pending'
  );

  let blockerMessage: string | null = null;
  if (currentEngagement.currentPhase === 1 && (dualKeyMissing || advanceUnallocated)) {
    blockerMessage = dualKeyMissing
      ? 'Gate 1: Dual-Key acceptance pending'
      : 'Gate 2: 50% Advance allocation required';
  } else if (currentEngagement.currentPhase >= 4 && bankConfirmationPending) {
    blockerMessage = 'Holding Letter Hard Blocker: QNB Bank Confirmation Pending';
  }

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between text-white shrink-0 z-20">
      {/* Left: 7-Phase Chevrons */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
        {PHASES.map((phase) => {
          const isActive = currentScreen === phase.screen;
          const isPassed = currentEngagement.currentPhase > phase.id;
          const isCurrentPhase = currentEngagement.currentPhase === phase.id;

          return (
            <button
              key={phase.id}
              onClick={() => navigateToScreen(phase.screen)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-left transition-all whitespace-nowrap shrink-0 border ${
                isActive
                  ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                  : isPassed
                  ? 'bg-slate-800/80 border-slate-700/80 text-emerald-300 hover:bg-slate-800'
                  : isCurrentPhase
                  ? 'bg-slate-800 border-blue-500/60 text-blue-300 hover:bg-slate-800'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                  isActive
                    ? 'bg-white text-blue-700'
                    : isPassed
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                    : isCurrentPhase
                    ? 'bg-blue-950 text-blue-400 border border-blue-700'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {isPassed ? '✓' : phase.id}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold leading-tight">{phase.title}</span>
                <span
                  className={`text-[10px] leading-tight ${
                    isActive ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {phase.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right: Team Avatars, Progress %, Blocker Indicator */}
      <div className="flex items-center gap-4 pl-4 shrink-0">
        {/* Syncing Badge */}
        <GlobalSyncBadge isSyncing={isSyncing} />

        {/* Blocker Flag */}
        {blockerMessage ? (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-950/80 border border-red-800 text-red-300 text-xs font-medium animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="text-[11px] font-mono">{blockerMessage}</span>
          </div>
        ) : (
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>All Audit Gates Clear</span>
          </div>
        )}

        {/* Overall Progress */}
        <div className="hidden md:flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Task Progress:</span>
            <span className="font-mono font-bold text-slate-200">
              {currentEngagement.taskProgressPercent}%
            </span>
          </div>
          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${currentEngagement.taskProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Assigned Team Avatars */}
        <div className="flex items-center -space-x-1.5" title="Assigned Engagement Team">
          {currentEngagement.assignedTeam.map((member) => (
            <div
              key={member.id}
              title={`${member.name} (${member.role} - QAR ${member.chargeOutRateQAR}/hr)`}
              className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-200 shadow-sm hover:scale-110 transition-transform cursor-pointer"
            >
              {member.avatar}
            </div>
          ))}
        </div>

        {/* Archive Lock Badge if locked */}
        {currentEngagement.isPermanentlyArchived && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>ISA 230 LOCKED</span>
          </div>
        )}
      </div>
    </div>
  );
}

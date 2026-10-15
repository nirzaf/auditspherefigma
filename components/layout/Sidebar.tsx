'use client';

import React, { useState } from 'react';
import { useAuditStore, ScreenView } from '@/lib/store';
import {
  FolderTree,
  Briefcase,
  Users,
  Compass,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  FileText,
  FileCheck,
  Archive,
  BookOpen,
  Workflow,
} from 'lucide-react';

export function Sidebar() {
  const { currentScreen, navigateToScreen, currentEngagement } = useAuditStore();
  const [collapsed, setCollapsed] = useState(false);
  const [foldersOpen, setFoldersOpen] = useState(true);

  // Folder counts for directory with workbench screen links
  const folders: { code: string; name: string; status: string; files: number; screen: ScreenView }[] = [
    { code: '01', name: '01_Administration & Planning', status: 'Ready', files: 4, screen: 'phase-1' },
    { code: '02', name: '02_Trial Balance & Schedules', status: 'Ingested', files: 12, screen: 'phase-2' },
    { code: '03', name: '03_Fieldwork & Testing', status: 'Active', files: 28, screen: 'phase-3' },
    {
      code: '04',
      name: '04_Drafts & Deliverables',
      status: currentEngagement.currentPhase >= 6 ? 'Unlocked' : 'Locked',
      files: currentEngagement.currentPhase >= 6 ? 5 : 0,
      screen: 'phase-6',
    },
    {
      code: '05',
      name: '05_Final Signed Archive',
      status: currentEngagement.isPermanentlyArchived ? 'Sealed' : 'Pending',
      files: currentEngagement.isPermanentlyArchived ? 7 : 0,
      screen: 'phase-7',
    },
  ];

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-200 shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Section */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {/* Section A: Engagement Workbench */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            {!collapsed && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Engagement Workbench
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

          <nav className="space-y-1">
            <SidebarItem
              collapsed={collapsed}
              active={currentScreen === 'workflow-dashboard'}
              onClick={() => navigateToScreen('workflow-dashboard')}
              icon={<Workflow className="w-4 h-4 text-blue-400" />}
              label="Engagement Workflow"
              badge="7-Phase"
              badgeColor="text-blue-400"
            />
            <SidebarItem
              collapsed={collapsed}
              active={currentScreen === 'phase-1'}
              onClick={() => navigateToScreen('phase-1')}
              icon={<ShieldCheck className="w-4 h-4" />}
              label="1. Dual-Key Onboarding"
              badge={currentEngagement.commercialKey.status === 'Approved' ? '✓' : '!'}
              badgeColor={
                currentEngagement.commercialKey.status === 'Approved'
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }
            />
            <SidebarItem
              collapsed={collapsed}
              active={currentScreen === 'phase-2'}
              onClick={() => navigateToScreen('phase-2')}
              icon={<Layers className="w-4 h-4" />}
              label="2. Planning & Materiality"
              badge="PM"
            />
            <SidebarItem
              collapsed={collapsed}
              active={currentScreen === 'phase-3'}
              onClick={() => navigateToScreen('phase-3')}
              icon={<FileText className="w-4 h-4" />}
              label="3. Split FSLI Fieldwork"
              badge={`${currentEngagement.fsliList.length} FSLI`}
            />
            <SidebarItem
              collapsed={collapsed}
              active={currentScreen === 'phase-4'}
              onClick={() => navigateToScreen('phase-4')}
              icon={<CheckCircle2 className="w-4 h-4" />}
              label="4. Manager Review & SRM"
              badge={
                currentEngagement.reviewNotes.filter((n) => n.status !== 'Resolved').length > 0
                  ? `${currentEngagement.reviewNotes.filter((n) => n.status !== 'Resolved').length} Open`
                  : undefined
              }
              badgeColor="text-amber-400"
            />
            <SidebarItem
              collapsed={collapsed}
              active={currentScreen === 'phase-5'}
              onClick={() => navigateToScreen('phase-5')}
              icon={<FileCheck className="w-4 h-4" />}
              label="5. Partner Sign-Off & Opinion"
              badge={currentEngagement.partnerSignOff.firmSealAffixed ? 'Signed' : undefined}
              badgeColor="text-emerald-400"
            />
            <SidebarItem
              collapsed={collapsed}
              active={currentScreen === 'phase-6'}
              onClick={() => navigateToScreen('phase-6')}
              icon={<Briefcase className="w-4 h-4" />}
              label="6. Report & Deliverables"
              badge="5-Part"
            />
            <SidebarItem
              collapsed={collapsed}
              active={currentScreen === 'phase-7'}
              onClick={() => navigateToScreen('phase-7')}
              icon={<Archive className="w-4 h-4" />}
              label="7. Compliance Archive"
              badge={`${currentEngagement.archiveRemainingDays}d`}
              badgeColor={currentEngagement.isPermanentlyArchived ? 'text-slate-400' : 'text-blue-400'}
            />
          </nav>
        </div>

        {/* Section B: External & Practice Modules */}
        <div>
          {!collapsed && (
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono px-2 mb-2">
              External & Operations
            </div>
          )}
          <nav className="space-y-1">
            <SidebarItem
              collapsed={collapsed}
              active={currentScreen === 'client-portal'}
              onClick={() => navigateToScreen('client-portal')}
              icon={<Users className="w-4 h-4 text-emerald-400" />}
              label="Client PBC Portal (Ext)"
              badge="CFO"
              badgeColor="text-emerald-400"
            />
            <SidebarItem
              collapsed={collapsed}
              active={currentScreen === 'practice-ledger'}
              onClick={() => navigateToScreen('practice-ledger')}
              icon={<Clock className="w-4 h-4 text-blue-400" />}
              label="Practice & Timesheets"
              badge="Mod 5"
            />
            <SidebarItem
              collapsed={collapsed}
              active={currentScreen === 'practice-templates'}
              onClick={() => navigateToScreen('practice-templates')}
              icon={<Layers className="w-4 h-4 text-indigo-400" />}
              label="Practice Templates"
              badge="v6.4"
              badgeColor="text-indigo-300"
            />
            <SidebarItem
              collapsed={collapsed}
              active={currentScreen === 'system-blueprint'}
              onClick={() => navigateToScreen('system-blueprint')}
              icon={<Compass className="w-4 h-4 text-purple-400" />}
              label="System Design Architecture"
              badge="ISA Map"
              badgeColor="text-purple-300"
            />
          </nav>
        </div>

        {/* Section C: Document Repository Directory */}
        {!collapsed && (
          <div>
            <button
              onClick={() => setFoldersOpen(!foldersOpen)}
              className="w-full flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono px-2 mb-2 hover:text-white"
            >
              <span className="flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5 text-slate-400" />
                5-Folder Repository
              </span>
              <span>{foldersOpen ? '−' : '+'}</span>
            </button>

            {foldersOpen && (
              <div className="space-y-1 pl-1">
                {folders.map((f) => {
                  const isCurrent = currentScreen === f.screen;
                  return (
                    <button
                      key={f.code}
                      onClick={() => navigateToScreen(f.screen)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-[11px] transition-all text-left group ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                      title={`Open ${f.name} in Phase Workbench`}
                    >
                      <span className="truncate pr-1 group-hover:translate-x-0.5 transition-transform">
                        {f.name}
                      </span>
                      <span
                        className={`text-[10px] font-mono shrink-0 px-1.5 py-0.5 rounded ${
                          isCurrent
                            ? 'bg-blue-700 text-white font-semibold'
                            : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        {f.files} docs
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer Info */}
      <div className="p-3 border-t border-slate-800 text-slate-400">
        {!collapsed ? (
          <div className="text-[11px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Jurisdiction</span>
              <span className="font-mono text-slate-200">State of Qatar</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Standards</span>
              <span className="font-mono text-slate-200">ISA / IFRS / ISQC 1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Currency</span>
              <span className="font-mono text-emerald-400 font-semibold">QAR (Tabular)</span>
            </div>
          </div>
        ) : (
          <div className="text-center text-[10px] font-mono text-slate-400">QAR</div>
        )}
      </div>
    </aside>
  );
}

function SidebarItem({
  collapsed,
  active,
  onClick,
  icon,
  label,
  badge,
  badgeColor = 'text-slate-400',
}: {
  collapsed: boolean;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="shrink-0">{icon}</span>
        {!collapsed && <span className="truncate text-left">{label}</span>}
      </div>
      {!collapsed && badge && (
        <span
          className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-800/80 shrink-0 ${badgeColor}`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

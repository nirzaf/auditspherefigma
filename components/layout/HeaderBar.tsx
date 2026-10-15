'use client';

import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import { AuditRole } from '@/types/audit';
import {
  ChevronDown,
  Search,
  Bell,
  RotateCcw,
  RefreshCw,
  ShieldCheck,
  Building2,
  Lock,
} from 'lucide-react';

export function HeaderBar() {
  const {
    engagements,
    currentEngagement,
    switchEngagement,
    userRole,
    setUserRole,
    resetAllData,
    navigateToScreen,
    isSyncing,
    refreshData,
  } = useAuditStore();

  const [engagementDropdownOpen, setEngagementDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const roles: AuditRole[] = ['PREPARER', 'REVIEWER', 'APPROVER / PARTNER', 'CLIENT / CFO'];

  // Calculate notifications
  const openNotes = currentEngagement.reviewNotes.filter((n) => n.status !== 'Resolved');
  const pendingCriticalConfs = currentEngagement.confirmations.filter(
    (c) => c.isCritical && c.status === 'Pending'
  );
  const notificationCount = openNotes.length + pendingCriticalConfs.length;

  return (
    <header className="h-16 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-30 select-none">
      {/* Zone 1: Brand & Logo */}
      <div className="flex items-center gap-6">
        <div
          onClick={() => navigateToScreen('system-blueprint')}
          className="flex items-center gap-3 cursor-pointer group"
          title="AuditSphere STE Platform v2.2 - View Architecture Blueprint"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-sm group-hover:bg-blue-500 transition-colors">
            AS
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-blue-300 transition-colors">
                AuditSphere
              </span>
              <span className="text-[10px] font-semibold text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800/60 font-mono">
                v2.2 STE
              </span>
            </div>
            <span className="text-[11px] text-slate-400">ISA & IFRS Workstation</span>
          </div>
        </div>

        {/* Engagement Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setEngagementDropdownOpen(!engagementDropdownOpen);
              setRoleDropdownOpen(false);
              setNotificationOpen(false);
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-left transition-colors"
          >
            <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="flex flex-col max-w-[260px] truncate">
              <span className="text-xs font-semibold text-slate-100 truncate">
                {currentEngagement.clientLegalName}
              </span>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span>{currentEngagement.statutoryYearEnd}</span>
                <span>·</span>
                <span className="text-emerald-400">
                  QAR {currentEngagement.contractedFeeQAR.toLocaleString()}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
          </button>

          {engagementDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                Switch Engagement
              </div>
              <div className="space-y-1">
                {engagements.map((eng) => (
                  <button
                    key={eng.id}
                    onClick={() => {
                      switchEngagement(eng.id);
                      setEngagementDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-start justify-between ${
                      eng.id === currentEngagement.id
                        ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-100">{eng.clientLegalName}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{eng.industryTag}</div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                        <span>Fee: QAR {eng.contractedFeeQAR.toLocaleString()}</span>
                        <span>·</span>
                        <span>Phase {eng.currentPhase}/7</span>
                      </div>
                    </div>
                    {eng.id === currentEngagement.id && (
                      <span className="text-[10px] text-blue-400 font-medium bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                        Active
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zone 2: Search */}
      <div className="hidden lg:flex items-center w-80">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FSLIs, review notes, files (CMD+K)..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Zone 3: Role Switcher, Notifications, Actions */}
      <div className="flex items-center gap-3">
        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setRoleDropdownOpen(!roleDropdownOpen);
              setEngagementDropdownOpen(false);
              setNotificationOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400 text-[11px]">Role:</span>
            <span className="font-semibold text-blue-300">{userRole}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                Select Simulation Role
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setUserRole(r);
                    setRoleDropdownOpen(false);
                    if (r === 'CLIENT / CFO') {
                      navigateToScreen('client-portal');
                    }
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    userRole === r
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span>{r}</span>
                  {userRole === r && <span className="text-[10px]">Active</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              setEngagementDropdownOpen(false);
              setRoleDropdownOpen(false);
            }}
            className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Notification Center"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                {notificationCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-white">Actionable Items</span>
                <span className="text-[10px] text-slate-400 font-mono">{notificationCount} pending</span>
              </div>
              <div className="space-y-2 mt-2 max-h-72 overflow-y-auto">
                {pendingCriticalConfs.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-xs">
                    <div className="font-semibold text-red-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      Critical Confirmation Blocker
                    </div>
                    <div className="text-[11px] text-red-200 mt-1">
                      Bank confirmation from QNB is overdue. Partner sign-off locked until Holding Letter is dispatched.
                    </div>
                    <button
                      onClick={() => {
                        navigateToScreen('phase-4');
                        setNotificationOpen(false);
                      }}
                      className="mt-2 text-[10px] font-medium text-red-400 hover:text-red-200 underline"
                    >
                      Resolve in Manager Review →
                    </button>
                  </div>
                )}
                {openNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-xs"
                  >
                    <div className="font-semibold text-amber-300">{note.fsliName}</div>
                    <div className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                      {note.noteText}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1.5 flex justify-between">
                      <span>By: {note.raisedBy}</span>
                      <button
                        onClick={() => {
                          navigateToScreen('phase-4');
                          setNotificationOpen(false);
                        }}
                        className="text-blue-400 hover:underline"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
                {notificationCount === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400">
                    No active audit blockers or open notes.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sync Audit Data Button */}
        <button
          onClick={refreshData}
          disabled={isSyncing}
          className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono ${
            isSyncing
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
          title="Synchronize Engagement Trial Balance & Audit Files"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="hidden xl:inline text-[11px] font-medium">
            {isSyncing ? 'Syncing...' : 'Sync QAR'}
          </span>
        </button>

        {/* Reset Demo Data Button */}
        <button
          onClick={resetAllData}
          className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          title="Reset All Engagement Data to Defaults"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-inner">
            {userRole.substring(0, 2)}
          </div>
        </div>
      </div>
    </header>
  );
}

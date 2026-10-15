'use client';

import React from 'react';
import { Loader2, RefreshCw, Database } from 'lucide-react';

export function GlobalSyncBadge({ isSyncing }: { isSyncing: boolean }) {
  if (!isSyncing) return null;

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/80 border border-blue-800 text-[11px] text-blue-300 font-mono animate-pulse shrink-0">
      <RefreshCw className="w-3 h-3 text-blue-400 animate-spin" />
      <span>Syncing QAR Trial Balance & Schedules...</span>
    </div>
  );
}

export function ScreenSkeleton({ type = 'dashboard' }: { type?: 'dashboard' | 'client-portal' | 'table' | 'cards' }) {
  return (
    <div className="space-y-6 animate-pulse select-none">
      {/* Top Header Card Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-2">
            <div className="h-3 w-48 bg-slate-200 rounded"></div>
            <div className="h-6 w-80 bg-slate-300 rounded"></div>
            <div className="h-3 w-64 bg-slate-200 rounded"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-28 bg-slate-200 rounded-lg"></div>
            <div className="h-8 w-36 bg-slate-200 rounded-lg"></div>
          </div>
        </div>

        {/* Metric Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="h-16 bg-slate-100 rounded-lg p-3 space-y-2">
            <div className="h-2.5 w-20 bg-slate-200 rounded"></div>
            <div className="h-5 w-28 bg-slate-300 rounded"></div>
          </div>
          <div className="h-16 bg-slate-100 rounded-lg p-3 space-y-2">
            <div className="h-2.5 w-24 bg-slate-200 rounded"></div>
            <div className="h-5 w-32 bg-slate-300 rounded"></div>
          </div>
          <div className="h-16 bg-slate-100 rounded-lg p-3 space-y-2">
            <div className="h-2.5 w-20 bg-slate-200 rounded"></div>
            <div className="h-5 w-24 bg-slate-300 rounded"></div>
          </div>
          <div className="h-16 bg-slate-100 rounded-lg p-3 space-y-2">
            <div className="h-2.5 w-24 bg-slate-200 rounded"></div>
            <div className="h-5 w-36 bg-slate-300 rounded"></div>
          </div>
        </div>
      </div>

      {type === 'client-portal' ? (
        <ClientPortalSkeletonContent />
      ) : type === 'cards' ? (
        <CardGridSkeletonContent />
      ) : (
        <SplitTableSkeletonContent />
      )}
    </div>
  );
}

function SplitTableSkeletonContent() {
  return (
    <div className="space-y-6">
      {/* Upper Viewport Table Placeholder (P&L) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
            <div className="h-4 w-64 bg-slate-700 rounded"></div>
          </div>
          <div className="h-3 w-40 bg-slate-800 rounded"></div>
        </div>

        <div className="p-4 space-y-3">
          {[1, 2, 3].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
            >
              <div className="flex items-center gap-3 w-1/3">
                <div className="h-4 w-12 bg-slate-200 rounded font-mono"></div>
                <div className="h-4 w-48 bg-slate-200 rounded"></div>
              </div>
              <div className="h-4 w-28 bg-slate-200 rounded"></div>
              <div className="h-4 w-28 bg-slate-200 rounded"></div>
              <div className="h-4 w-16 bg-slate-200 rounded"></div>
              <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-20 bg-slate-200 rounded-lg"></div>
                <div className="h-7 w-28 bg-slate-300 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lower Viewport Table Placeholder (Balance Sheet) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-800 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400"></div>
            <div className="h-4 w-72 bg-slate-700 rounded"></div>
          </div>
          <div className="h-3 w-32 bg-slate-700 rounded"></div>
        </div>

        <div className="p-4 space-y-3">
          {[1, 2, 3, 4].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
            >
              <div className="flex items-center gap-3 w-1/3">
                <div className="h-4 w-12 bg-slate-200 rounded font-mono"></div>
                <div className="h-4 w-52 bg-slate-200 rounded"></div>
              </div>
              <div className="h-4 w-28 bg-slate-200 rounded"></div>
              <div className="h-4 w-28 bg-slate-200 rounded"></div>
              <div className="h-4 w-16 bg-slate-200 rounded"></div>
              <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-20 bg-slate-200 rounded-lg"></div>
                <div className="h-7 w-28 bg-slate-300 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CardGridSkeletonContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((card) => (
        <div key={card} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-slate-200"></div>
              <div className="space-y-1">
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
                <div className="h-3 w-24 bg-slate-100 rounded"></div>
              </div>
            </div>
            <div className="h-5 w-20 bg-slate-200 rounded"></div>
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="h-3 w-full bg-slate-100 rounded"></div>
            <div className="h-3 w-3/4 bg-slate-100 rounded"></div>
            <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <div className="h-8 w-28 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ClientPortalSkeletonContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="space-y-1">
            <div className="h-4 w-44 bg-slate-200 rounded"></div>
            <div className="h-3 w-64 bg-slate-100 rounded"></div>
          </div>
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <div className="h-4 w-40 bg-slate-200 rounded"></div>
                <div className="h-5 w-24 bg-slate-200 rounded"></div>
              </div>
              <div className="h-3 w-3/4 bg-slate-100 rounded"></div>
              <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="h-4 w-36 bg-slate-200 rounded"></div>
        <div className="h-36 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center">
          <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
        </div>
        <div className="h-8 w-full bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  );
}

export function GlobalFullLoadingSpinner({ message = 'Loading statutory audit engagement files...' }: { message?: string }) {
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4 p-8 text-center animate-in fade-in duration-150">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center">
          <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9px] font-bold font-mono">
          QAR
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          {message}
        </h3>
        <p className="text-xs text-slate-500 max-w-sm font-mono">
          Synchronizing general ledger schedules, sampling matrices & ISA 230 audit trails...
        </p>
      </div>
    </div>
  );
}

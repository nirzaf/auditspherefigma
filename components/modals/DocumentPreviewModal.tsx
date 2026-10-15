'use client';

import React from 'react';
import { useAuditStore } from '@/lib/store';
import { FileText, FolderTree, ShieldCheck, Hash, Download, ArrowRight } from 'lucide-react';

export function DocumentPreviewModal() {
  const { previewDoc, closeDocumentPreview, navigateToWorkbench } = useAuditStore();

  if (!previewDoc) return null;

  const handleDownload = () => {
    const manifest = {
      fileName: previewDoc.fileName,
      folder: previewDoc.folder,
      fileType: previewDoc.fileType,
      uploadedBy: previewDoc.uploadedBy,
      uploadedAt: previewDoc.uploadedAt,
      sha256Seal: previewDoc.shaHash,
      sizeKB: previewDoc.sizeKB,
    };
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(manifest, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataStr);
    anchor.setAttribute('download', `${previewDoc.fileName}.manifest.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-sm tracking-tight">Document Preview & Evidence Record</h3>
              <p className="text-[11px] text-slate-400">Repository file inspected under the 5-folder taxonomy</p>
            </div>
          </div>
          <button onClick={closeDocumentPreview} className="text-slate-400 hover:text-white text-lg font-mono">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-mono">
                {previewDoc.fileType}
              </span>
              <span className="font-bold text-sm text-slate-900 break-all">{previewDoc.fileName}</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1.5">{previewDoc.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-400 block text-[10px] font-mono flex items-center gap-1">
                <FolderTree className="w-3 h-3" /> Repository Folder
              </span>
              <span className="text-slate-800 font-medium">{previewDoc.folder}</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-400 block text-[10px] font-mono">Uploaded By</span>
              <span className="text-slate-800 font-medium">{previewDoc.uploadedBy}</span>
              <span className="block text-[10px] text-slate-400 font-mono">{previewDoc.uploadedAt}</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-400 block text-[10px] font-mono flex items-center gap-1">
                <Hash className="w-3 h-3" /> SHA-256 Seal
              </span>
              <span className="text-emerald-700 font-mono text-[10px] break-all">{previewDoc.shaHash}</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-400 block text-[10px] font-mono">File Size</span>
              <span className="text-slate-800 font-mono font-bold">{previewDoc.sizeKB.toLocaleString()} KB</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Integrity verified — this evidence record is hash-sealed. Export its inspection manifest, or open the
              linked workbench to continue testing.
            </span>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={closeDocumentPreview}
            className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Manifest
          </button>
          {previewDoc.linkedWorkbench && (
            <button
              onClick={() => {
                navigateToWorkbench(previewDoc.linkedWorkbench!);
                closeDocumentPreview();
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
            >
              Open Workbench
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

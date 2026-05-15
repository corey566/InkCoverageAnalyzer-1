import { useState, useEffect } from "react";
import {
  FileText,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Document } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface DocumentPreviewProps {
  document: Document;
}

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/gif",
  "image/webp",
];
const PDF_TYPE = "application/pdf";
const PS_TYPE = "application/postscript";

export function DocumentPreview({ document }: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);

  const fileUrl = `/api/documents/${document.id}/file`;
  const isImage = IMAGE_TYPES.includes(document.mimeType);
  const isPdfLike =
    document.mimeType === PDF_TYPE || document.mimeType === PS_TYPE;
  const previewUrl = isPdfLike
    ? `/api/documents/${document.id}/preview?page=${page}`
    : isImage
      ? `/api/documents/${document.id}/preview?page=1`
      : null;

  useEffect(() => {
    setPage(1);
    setPageCount(1);
    if (isPdfLike) {
      apiRequest("GET", `/api/documents/${document.id}/page-info`)
        .then((r) => r.json())
        .then((info) => {
          if (info.pageCount) setPageCount(info.pageCount);
        })
        .catch(() => {});
    }
  }, [document.id, isPdfLike]);

  useEffect(() => {
    setLoading(true);
  }, [previewUrl]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50));
  const handleReset = () => setZoom(100);

  return (
    <div
      className="bg-white/90 rounded-[2rem] border-2 border-emerald-100 overflow-hidden"
      style={{
        boxShadow:
          "0 18px 50px rgba(16,185,129,0.12), 0 6px 20px rgba(15,23,42,0.06)",
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-2xl flex items-center justify-center"
            style={{ background: "hsl(133, 48%, 94%)" }}
          >
            {isImage ? (
              <ImageIcon
                className="w-4 h-4"
                style={{ color: "hsl(133, 48%, 36%)" }}
              />
            ) : (
              <FileText
                className="w-4 h-4"
                style={{ color: "hsl(133, 48%, 36%)" }}
              />
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">
              Document Preview ✨
            </p>
            <p className="text-xs text-slate-400 truncate max-w-[220px]">
              {document.originalName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isPdfLike && pageCount > 1 && (
            <div className="flex items-center gap-1 mr-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-500 min-w-[60px] text-center font-medium">
                Page {page}/{pageCount}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page >= pageCount}
                className="w-8 h-8 flex items-center justify-center rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
          {(isImage || isPdfLike) && (
            <>
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="w-8 h-8 flex items-center justify-center rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-500 min-w-[40px] text-center font-medium">
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="w-8 h-8 flex items-center justify-center rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="w-8 h-8 flex items-center justify-center rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors ml-1"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open Original
          </a>
        </div>
      </div>

      {previewUrl ? (
        <div
          className="w-full overflow-auto bg-slate-100 flex items-start justify-center"
          style={{ maxHeight: "520px", minHeight: "280px" }}
        >
          <div className="relative w-full flex justify-center p-3">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                  style={{
                    borderColor: "hsl(133,55%,40%)",
                    borderTopColor: "transparent",
                  }}
                />
              </div>
            )}
            <img
              src={previewUrl}
              alt={`${document.originalName} page ${page}`}
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
              style={{
                maxWidth: `${zoom}%`,
                height: "auto",
                display: "block",
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
              }}
              className="bg-white"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 px-5 text-center bg-slate-50">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "hsl(133, 48%, 94%)" }}
          >
            <FileText
              className="w-7 h-7"
              style={{ color: "hsl(133, 48%, 36%)" }}
            />
          </div>
          <p className="text-slate-700 font-semibold mb-1">
            Preview not available
          </p>
          <p className="text-sm text-slate-400 mb-5">
            This file type ({document.mimeType}) cannot be previewed in the
            browser.
          </p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full border transition-colors"
            style={{
              color: "hsl(133, 48%, 36%)",
              borderColor: "hsl(133, 48%, 36%)",
            }}
          >
            <ExternalLink className="w-4 h-4" /> Download to view
          </a>
        </div>
      )}
    </div>
  );
}

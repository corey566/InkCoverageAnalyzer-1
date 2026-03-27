import { useState } from "react";
import { FileText, Image, ZoomIn, ZoomOut, RotateCcw, ExternalLink } from "lucide-react";
import type { Document } from "@shared/schema";

interface DocumentPreviewProps {
  document: Document;
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/tiff", "image/gif", "image/webp"];
const PDF_TYPE = "application/pdf";

export function DocumentPreview({ document }: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const fileUrl = `/api/documents/${document.id}/file`;
  const isImage = IMAGE_TYPES.includes(document.mimeType);
  const isPdf = document.mimeType === PDF_TYPE;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50));
  const handleReset = () => setZoom(100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(133, 48%, 94%)" }}>
            {isImage ? (
              <Image className="w-4 h-4" style={{ color: "hsl(133, 48%, 36%)" }} />
            ) : (
              <FileText className="w-4 h-4" style={{ color: "hsl(133, 48%, 36%)" }} />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Document Preview</p>
            <p className="text-xs text-gray-400 truncate max-w-[240px]">{document.originalName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isImage && (
            <>
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-500 min-w-[40px] text-center font-medium">{zoom}%</span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors ml-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open
          </a>
        </div>
      </div>

      {/* Content */}
      {isPdf && (
        <div className="w-full bg-gray-100" style={{ height: "600px" }}>
          <iframe
            src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            title={document.originalName}
            className="w-full h-full border-0"
            style={{ minHeight: "600px" }}
          />
        </div>
      )}

      {isImage && (
        <div
          className="w-full overflow-auto bg-gray-100 flex items-center justify-center"
          style={{ maxHeight: "600px", minHeight: "300px" }}
        >
          <img
            src={fileUrl}
            alt={document.originalName}
            style={{
              maxWidth: `${zoom}%`,
              width: zoom === 100 ? "100%" : undefined,
              height: "auto",
              display: "block",
              margin: "0 auto",
              transition: "max-width 0.2s ease",
            }}
            className="object-contain"
          />
        </div>
      )}

      {!isPdf && !isImage && (
        <div className="flex flex-col items-center justify-center py-14 px-6 text-center bg-gray-50">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "hsl(133, 48%, 94%)" }}>
            <FileText className="w-7 h-7" style={{ color: "hsl(133, 48%, 36%)" }} />
          </div>
          <p className="text-gray-700 font-semibold mb-1">Preview not available</p>
          <p className="text-sm text-gray-400 mb-5">
            This file type ({document.mimeType}) cannot be previewed in the browser.
          </p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full border transition-colors"
            style={{ color: "hsl(133, 48%, 36%)", borderColor: "hsl(133, 48%, 36%)" }}
          >
            <ExternalLink className="w-4 h-4" />
            Download to view
          </a>
        </div>
      )}
    </div>
  );
}

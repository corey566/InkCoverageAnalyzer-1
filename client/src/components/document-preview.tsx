import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <Card className="shadow-md border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isImage ? (
              <Image className="w-5 h-5 text-blue-600" />
            ) : (
              <FileText className="w-5 h-5 text-red-600" />
            )}
            <CardTitle className="text-base font-semibold text-gray-800">
              Document Preview
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {isImage && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                  className="h-8 w-8 p-0"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-xs text-gray-500 min-w-[40px] text-center">{zoom}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                  className="h-8 w-8 p-0"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </>
            )}
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 ml-2"
            >
              <ExternalLink className="w-3 h-3" />
              Open
            </a>
          </div>
        </div>
        <p className="text-xs text-gray-500 truncate">{document.originalName}</p>
      </CardHeader>

      <CardContent className="p-0">
        {isPdf && (
          <div className="w-full rounded-b-lg overflow-hidden bg-gray-100" style={{ height: "600px" }}>
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
            className="w-full rounded-b-lg overflow-auto bg-gray-100 flex items-center justify-center"
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
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-gray-50 rounded-b-lg">
            <FileText className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-600 font-medium">Preview not available</p>
            <p className="text-sm text-gray-500 mb-4">
              This file type ({document.mimeType}) cannot be previewed in the browser.
            </p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 underline"
            >
              <ExternalLink className="w-4 h-4" />
              Download to view
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

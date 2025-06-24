import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { BenefitsSection } from "@/components/benefits-section";
import { FileUpload } from "@/components/file-upload";
import { AnalysisResults } from "@/components/analysis-results";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Cog, Zap, Layers, Cloud, File, Image as ImageIcon, Table, FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const [analysisId, setAnalysisId] = useState<number | null>(null);

  const analysisMutation = useMutation({
    mutationFn: async (documentId: number) => {
      const response = await apiRequest('POST', `/api/documents/${documentId}/analyze`);
      return response.json();
    },
    onSuccess: (analysis) => {
      setAnalysisId(analysis.id);
    }
  });

  const handleAnalysisStart = (documentId: number) => {
    analysisMutation.mutate(documentId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <BenefitsSection />
      <FileUpload onAnalysisStart={handleAnalysisStart} />
      <AnalysisResults analysisId={analysisId} />
      
      {/* Technical Specifications Section */}
      <section id="support" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Technical Specifications</h2>
            <p className="text-xl text-gray-600">
              Advanced processing engine built for professional printing environments
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Supported Formats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="text-red-500 text-xl" />
                    <span className="text-gray-700">PDF Documents</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ImageIcon className="text-blue-600 text-xl" />
                    <span className="text-gray-700">EPS Files</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Table className="text-green-600 text-xl" />
                    <span className="text-gray-700">Excel Sheets</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ImageIcon className="text-purple-600 text-xl" />
                    <span className="text-gray-700">JPG, PNG, TIFF</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <File className="text-blue-800 text-xl" />
                    <span className="text-gray-700">Word Documents</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <File className="text-orange-600 text-xl" />
                    <span className="text-gray-700">PowerPoint</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Processing Engine</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Cog className="text-primary text-xl mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Advanced Processing</p>
                      <p className="text-gray-600 text-sm">State-of-the-art document analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Zap className="text-secondary text-xl mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">High-Speed Analysis</p>
                      <p className="text-gray-600 text-sm">Process large documents in seconds</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Layers className="text-magenta-ink text-xl mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">CMYK Color Separation</p>
                      <p className="text-gray-600 text-sm">Precise color channel analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Cloud className="text-cyan-ink text-xl mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Batch Processing</p>
                      <p className="text-gray-600 text-sm">Handle multiple documents simultaneously</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

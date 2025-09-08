import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, FileText, Table, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatPercentage } from "@/lib/utils";
import type { Analysis } from "@shared/schema";

interface AnalysisResultsProps {
  analysisId: number | null;
}

export function AnalysisResults({ analysisId }: AnalysisResultsProps) {
  const { toast } = useToast();

  const { data: analysis, isLoading, error } = useQuery<Analysis>({
    queryKey: [`/api/analyses/${analysisId}`],
    enabled: !!analysisId,
    refetchInterval: (query) => {
      // Refetch if analysis is still processing
      const analysis = query.state.data as Analysis;
      return analysis?.status === 'processing' ? 2000 : false;
    },
  });

  const downloadReport = async (format: 'pdf' | 'excel' | 'image') => {
    if (!analysisId) return;

    try {
      const response = await fetch(`/api/analyses/${analysisId}/download/${format}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `ink-coverage-report-${analysisId}.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download started",
        description: `Your ${format} report is being downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  if (!analysisId) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Analysis Results</h2>
          </div>
          <Card>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-64 rounded-xl" />
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (error || !analysis) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-600">Failed to load analysis results. Please try again.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (analysis.status === 'processing') {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Analysis in Progress</h2>
          </div>
          <Card>
            <CardContent className="p-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-primary font-medium">Analyzing your document...</p>
                <p className="text-sm text-gray-600 mt-2">This may take a few moments</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (analysis.status === 'failed') {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-600 mb-4">Analysis failed: {analysis.errorMessage}</p>
              <p className="text-gray-600">Please try uploading your document again.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (analysis.status !== 'completed' || !analysis.overallCoverage || !analysis.pageBreakdown) {
    return null;
  }

  return (
    <section id="results" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Analysis Results</h2>
          <p className="text-xl text-gray-600">
            Comprehensive ink coverage breakdown for your documents
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 border border-cyan-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-cyan-800">Cyan Coverage</h3>
                  <div className="w-4 h-4 bg-cyan-ink rounded-full"></div>
                </div>
                <p className="text-3xl font-bold text-cyan-900">
                  {formatPercentage(analysis.overallCoverage.cyan)}
                </p>
                <p className="text-sm text-cyan-700">Average per page</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-pink-800">Magenta Coverage</h3>
                  <div className="w-4 h-4 bg-magenta-ink rounded-full"></div>
                </div>
                <p className="text-3xl font-bold text-pink-900">
                  {formatPercentage(analysis.overallCoverage.magenta)}
                </p>
                <p className="text-sm text-pink-700">Average per page</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-yellow-800">Yellow Coverage</h3>
                  <div className="w-4 h-4 bg-yellow-ink rounded-full"></div>
                </div>
                <p className="text-3xl font-bold text-yellow-900">
                  {formatPercentage(analysis.overallCoverage.yellow)}
                </p>
                <p className="text-sm text-yellow-700">Average per page</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Black Coverage</h3>
                  <div className="w-4 h-4 bg-black-ink rounded-full"></div>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {formatPercentage(analysis.overallCoverage.black)}
                </p>
                <p className="text-sm text-gray-700">Average per page</p>
              </div>
            </div>

            {/* Detailed Results Table */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Page-by-Page Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Page</th>
                      <th className="text-center py-3 px-4 font-semibold text-cyan-700">Cyan %</th>
                      <th className="text-center py-3 px-4 font-semibold text-pink-700">Magenta %</th>
                      <th className="text-center py-3 px-4 font-semibold text-yellow-700">Yellow %</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Black %</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Total %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.pageBreakdown.map((page) => (
                      <tr key={page.page} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">Page {page.page}</td>
                        <td className="py-3 px-4 text-center">{formatPercentage(page.cyan)}</td>
                        <td className="py-3 px-4 text-center">{formatPercentage(page.magenta)}</td>
                        <td className="py-3 px-4 text-center">{formatPercentage(page.yellow)}</td>
                        <td className="py-3 px-4 text-center">{formatPercentage(page.black)}</td>
                        <td className="py-3 px-4 text-center font-semibold">{formatPercentage(page.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Download Options */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Download Report</h3>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => downloadReport('pdf')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  onClick={() => downloadReport('excel')}
                  className="bg-secondary hover:bg-green-700 text-white"
                >
                  <Table className="w-4 h-4 mr-2" />
                  Download Excel
                </Button>
                <Button 
                  onClick={() => downloadReport('image')}
                  className="bg-primary hover:bg-blue-700 text-white"
                >
                  <Image className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

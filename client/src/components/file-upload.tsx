import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, File, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatFileSize, getFileIcon } from "@/lib/utils";
import type { Document } from "@shared/schema";

interface FileUploadProps {
  onAnalysisStart: (documentId: number) => void;
}

interface UploadedFile extends Document {
  file: File;
}

export function FileUpload({ onAnalysisStart }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiRequest('POST', '/api/documents/upload', formData);
      return response.json();
    },
    onSuccess: (document: Document, file: File) => {
      setUploadedFiles(prev => [...prev, { ...document, file }]);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded and is ready for analysis.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      uploadMutation.mutate(file);
    });
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/postscript': ['.eps'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/tiff': ['.tiff', '.tif'],
      'image/gif': ['.gif'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (fileId: number) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const startAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files to analyze",
        description: "Please upload at least one document first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Start analysis for the first file (in a real app, could handle multiple files)
      const firstFile = uploadedFiles[0];
      onAnalysisStart(firstFile.id);
      
      toast({
        title: "Analysis started",
        description: "Your documents are being analyzed. This may take a few moments.",
      });
    } catch (error) {
      toast({
        title: "Analysis failed to start",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="estimator" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ink Coverage Estimator</h2>
          <p className="text-xl text-gray-600">
            Upload your documents and get instant CMYK ink coverage analysis
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* File Upload Area */}
            <div className="mb-8">
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-300 hover:border-primary'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Documents</h3>
                <p className="text-gray-600 mb-6">
                  Drag and drop files here or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supported formats: PDF, EPS, Excel, JPG, PNG, TIFF, and more
                </p>
                <Button className="bg-primary text-white hover:bg-blue-700">
                  Choose Files
                </Button>
              </div>
            </div>

            {/* File List */}
            {uploadedFiles.length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h4>
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <File className="text-red-500 text-xl" />
                        <div>
                          <p className="font-medium text-gray-900">{file.originalName}</p>
                          <p className="text-sm text-gray-600">{formatFileSize(file.fileSize)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis Button */}
            <div className="text-center mb-8">
              <Button 
                onClick={startAnalysis}
                disabled={uploadedFiles.length === 0 || isProcessing || uploadMutation.isPending}
                className="bg-secondary text-white px-8 py-4 text-lg hover:bg-green-700"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Analysis
              </Button>
            </div>

            {/* Progress Indicator */}
            {isProcessing && (
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span className="font-medium text-primary">Analyzing documents...</span>
                </div>
                <Progress value={45} className="w-full mb-2" />
                <p className="text-sm text-gray-600">Processing your documents...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

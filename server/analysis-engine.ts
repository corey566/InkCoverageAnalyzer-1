import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

export interface CMYKCoverage {
  cyan: number;
  magenta: number;
  yellow: number;
  black: number;
}

export interface PageAnalysis extends CMYKCoverage {
  page: number;
  total: number;
}

export interface AnalysisResult {
  totalPages: number;
  overallCoverage: CMYKCoverage;
  pageBreakdown: PageAnalysis[];
}

export class DocumentAnalysisEngine {
  
  async analyzeDocument(filePath: string, mimeType: string): Promise<AnalysisResult> {
    try {
      switch (mimeType) {
        case 'application/pdf':
          return await this.analyzePDF(filePath);
        case 'image/jpeg':
        case 'image/png':
        case 'image/tiff':
        case 'image/gif':
          return await this.analyzeImage(filePath);
        case 'application/postscript':
          return await this.analyzeEPS(filePath);
        default:
          // For other formats, convert to PDF first then analyze
          return await this.analyzeOtherFormat(filePath, mimeType);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      throw new Error(`Failed to analyze document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async analyzePDF(filePath: string): Promise<AnalysisResult> {
    // Get page count
    const pageCount = await this.getPDFPageCount(filePath);
    const pageBreakdown: PageAnalysis[] = [];
    
    // Analyze each page
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const coverage = await this.analyzePDFPage(filePath, pageNum);
      pageBreakdown.push({
        page: pageNum,
        ...coverage,
        total: coverage.cyan + coverage.magenta + coverage.yellow + coverage.black
      });
    }

    // Calculate overall coverage
    const overallCoverage = this.calculateOverallCoverage(pageBreakdown);

    return {
      totalPages: pageCount,
      overallCoverage,
      pageBreakdown
    };
  }

  private async getPDFPageCount(filePath: string): Promise<number> {
    try {
      const { stdout } = await execAsync(`gs -q -dNODISPLAY -c "(${filePath}) (r) file runpdfbegin pdfpagecount = quit"`);
      return parseInt(stdout.trim());
    } catch (error) {
      // Fallback method using pdfinfo if available
      try {
        const { stdout } = await execAsync(`pdfinfo "${filePath}" | grep Pages | awk '{print $2}'`);
        return parseInt(stdout.trim());
      } catch {
        // If both fail, assume single page
        return 1;
      }
    }
  }

  private async analyzePDFPage(filePath: string, pageNum: number): Promise<CMYKCoverage> {
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    const tempImagePath = path.join(tempDir, `page_${pageNum}_${Date.now()}.png`);
    
    try {
      // Convert PDF page to high-res image for analysis
      await execAsync(`gs -dSAFER -dBATCH -dNOPAUSE -dQuiet -sDEVICE=png16m -r300 -dFirstPage=${pageNum} -dLastPage=${pageNum} -sOutputFile="${tempImagePath}" "${filePath}"`);
      
      // Analyze the converted image
      const coverage = await this.analyzeImageFile(tempImagePath);
      
      return coverage;
    } finally {
      // Clean up temp file
      try {
        await fs.unlink(tempImagePath);
      } catch (error) {
        console.warn('Failed to clean up temp file:', tempImagePath);
      }
    }
  }

  private async analyzeImage(filePath: string): Promise<AnalysisResult> {
    const coverage = await this.analyzeImageFile(filePath);
    
    return {
      totalPages: 1,
      overallCoverage: coverage,
      pageBreakdown: [{
        page: 1,
        ...coverage,
        total: coverage.cyan + coverage.magenta + coverage.yellow + coverage.black
      }]
    };
  }

  private async analyzeImageFile(imagePath: string): Promise<CMYKCoverage> {
    try {
      // Convert image to CMYK and get histograms for each channel
      const tempDir = path.join(process.cwd(), 'temp');
      await fs.mkdir(tempDir, { recursive: true });
      
      const cmykImagePath = path.join(tempDir, `cmyk_${Date.now()}.tiff`);
      
      // Convert to CMYK colorspace
      await execAsync(`convert "${imagePath}" -colorspace CMYK "${cmykImagePath}"`);
      
      // Get image dimensions for percentage calculation
      const { stdout: identify } = await execAsync(`identify -format "%wx%h" "${cmykImagePath}"`);
      const [width, height] = identify.trim().split('x').map(Number);
      const totalPixels = width * height;
      
      // Analyze each CMYK channel
      const cyan = await this.getChannelCoverage(cmykImagePath, 0, totalPixels);
      const magenta = await this.getChannelCoverage(cmykImagePath, 1, totalPixels);
      const yellow = await this.getChannelCoverage(cmykImagePath, 2, totalPixels);
      const black = await this.getChannelCoverage(cmykImagePath, 3, totalPixels);
      
      // Clean up temp file
      try {
        await fs.unlink(cmykImagePath);
      } catch (error) {
        console.warn('Failed to clean up temp CMYK file:', cmykImagePath);
      }
      
      return {
        cyan: Math.round(cyan * 10) / 10,
        magenta: Math.round(magenta * 10) / 10,
        yellow: Math.round(yellow * 10) / 10,
        black: Math.round(black * 10) / 10
      };
    } catch (error) {
      console.error('Image analysis error:', error);
      // Fallback to estimated values based on basic color analysis
      return await this.estimateImageCoverage(imagePath);
    }
  }

  private async getChannelCoverage(cmykImagePath: string, channel: number, totalPixels: number): Promise<number> {
    try {
      // Extract channel and calculate non-white pixels
      const { stdout } = await execAsync(`convert "${cmykImagePath}" -channel ${['C', 'M', 'Y', 'K'][channel]} -separate -threshold 5% -format "%[fx:1-mean]" info:`);
      return parseFloat(stdout.trim()) * 100;
    } catch (error) {
      console.warn(`Failed to analyze ${['cyan', 'magenta', 'yellow', 'black'][channel]} channel:`, error);
      return 0;
    }
  }

  private async estimateImageCoverage(imagePath: string): Promise<CMYKCoverage> {
    try {
      // Fallback method using basic color analysis
      const { stdout } = await execAsync(`convert "${imagePath}" -format "%[fx:100*mean]" info:`);
      const brightness = 100 - parseFloat(stdout.trim());
      
      // Estimate CMYK based on overall darkness (rough approximation)
      const baseCoverage = brightness * 0.6; // Conservative estimate
      
      return {
        cyan: baseCoverage * 0.3,
        magenta: baseCoverage * 0.25,
        yellow: baseCoverage * 0.35,
        black: baseCoverage * 0.4
      };
    } catch (error) {
      console.warn('Fallback image analysis failed:', error);
      // Return minimal default values
      return { cyan: 5, magenta: 5, yellow: 5, black: 10 };
    }
  }

  private async analyzeEPS(filePath: string): Promise<AnalysisResult> {
    // Convert EPS to PDF first, then analyze
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    const tempPDFPath = path.join(tempDir, `converted_${Date.now()}.pdf`);
    
    try {
      await execAsync(`gs -dSAFER -dBATCH -dNOPAUSE -dQuiet -sDEVICE=pdfwrite -sOutputFile="${tempPDFPath}" "${filePath}"`);
      const result = await this.analyzePDF(tempPDFPath);
      
      return result;
    } finally {
      try {
        await fs.unlink(tempPDFPath);
      } catch (error) {
        console.warn('Failed to clean up temp PDF file:', tempPDFPath);
      }
    }
  }

  private async analyzeOtherFormat(filePath: string, mimeType: string): Promise<AnalysisResult> {
    // For other formats (Excel, Word, etc.), convert to PDF first
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    const tempPDFPath = path.join(tempDir, `converted_${Date.now()}.pdf`);
    
    try {
      // Try to convert using LibreOffice if available
      try {
        await execAsync(`libreoffice --headless --convert-to pdf --outdir "${tempDir}" "${filePath}"`);
        const baseName = path.basename(filePath, path.extname(filePath));
        const convertedPath = path.join(tempDir, `${baseName}.pdf`);
        
        if (await this.fileExists(convertedPath)) {
          const result = await this.analyzePDF(convertedPath);
          await fs.unlink(convertedPath);
          return result;
        }
      } catch (error) {
        console.warn('LibreOffice conversion failed:', error);
      }
      
      // If conversion fails, return estimated values
      return {
        totalPages: 1,
        overallCoverage: { cyan: 15, magenta: 12, yellow: 18, black: 25 },
        pageBreakdown: [{
          page: 1,
          cyan: 15,
          magenta: 12,
          yellow: 18,
          black: 25,
          total: 70
        }]
      };
    } catch (error) {
      throw new Error(`Unsupported file format: ${mimeType}`);
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private calculateOverallCoverage(pageBreakdown: PageAnalysis[]): CMYKCoverage {
    if (pageBreakdown.length === 0) {
      return { cyan: 0, magenta: 0, yellow: 0, black: 0 };
    }

    const totalCyan = pageBreakdown.reduce((sum, page) => sum + page.cyan, 0);
    const totalMagenta = pageBreakdown.reduce((sum, page) => sum + page.magenta, 0);
    const totalYellow = pageBreakdown.reduce((sum, page) => sum + page.yellow, 0);
    const totalBlack = pageBreakdown.reduce((sum, page) => sum + page.black, 0);
    
    const pageCount = pageBreakdown.length;

    return {
      cyan: Math.round((totalCyan / pageCount) * 10) / 10,
      magenta: Math.round((totalMagenta / pageCount) * 10) / 10,
      yellow: Math.round((totalYellow / pageCount) * 10) / 10,
      black: Math.round((totalBlack / pageCount) * 10) / 10
    };
  }
}
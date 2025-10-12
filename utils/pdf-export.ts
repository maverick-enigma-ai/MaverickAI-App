/**
 * PDF Export Utilities
 * Export analysis results to PDF (Premium/Professional only)
 */

import { ProcessedAnalysis } from '../types/runradar-api';

/**
 * Generate premium, personalized PDF from analysis data
 * Uses jsPDF library for client-side PDF generation
 * 
 * Premium Features:
 * - Branded header with MaverickAI logo
 * - Personalized with user name and email
 * - Beautiful color-coded score visualizations
 * - Complete strategic analysis
 * - Professional formatting
 * - Confidential watermark
 */
export async function exportAnalysisToPDF(
  analysis: ProcessedAnalysis, 
  userEmail: string,
  userName?: string
): Promise<void> {
  try {
    console.log('📄 Generating PDF export...');
    
    // Dynamically import jsPDF (will be loaded on demand)
    const { jsPDF } = await import('jspdf');
    
    // Create new PDF document (A4 size)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // PDF styling
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;
    
    // Helper: Add page break if needed
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };
    
    // Helper: Add text with word wrap
    const addText = (text: string, fontSize: number, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const lines = doc.splitTextToSize(text, contentWidth);
      const lineHeight = fontSize * 0.4;
      
      checkPageBreak(lines.length * lineHeight);
      
      lines.forEach((line: string) => {
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
    };
    
    // ===== HEADER =====
    // Premium gradient header background
    doc.setFillColor(20, 18, 63); // --maverick-navy
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Brand name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('MaverickAI Enigma Radar™', margin, 15);
    
    // Report type
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('CONFIDENTIAL PSYCHOLOGICAL INTELLIGENCE REPORT', margin, 23);
    
    // Personalization - User info
    doc.setTextColor(0, 212, 255); // --maverick-cyan
    doc.setFontSize(9);
    if (userName) {
      doc.text(`Prepared for: ${userName}`, margin, 30);
    }
    doc.text(`Email: ${userEmail}`, margin, 35);
    
    // Generation date (right aligned)
    const dateText = `Generated: ${new Date().toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`;
    const dateWidth = doc.getTextWidth(dateText);
    doc.text(dateText, pageWidth - margin - dateWidth, 30);
    
    // Analysis ID (right aligned)
    const idText = `ID: ${analysis.id.substring(0, 12).toUpperCase()}`;
    const idWidth = doc.getTextWidth(idText);
    doc.text(idText, pageWidth - margin - idWidth, 35);
    
    yPosition = 55;
    doc.setTextColor(0, 0, 0); // Reset to black
    
    // ===== TITLE =====
    checkPageBreak(15);
    addText(analysis.title || 'Strategic Analysis', 18, true);
    yPosition += 5;
    
    // ===== SCORES SECTION =====
    checkPageBreak(60);
    
    // Section header with background
    doc.setFillColor(245, 245, 250);
    doc.rect(margin - 5, yPosition - 2, contentWidth + 10, 12, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 18, 63);
    doc.text('⚡ SEVERITY ASSESSMENT', margin, yPosition + 6);
    yPosition += 15;
    doc.setTextColor(0, 0, 0);
    
    // Confidence level badge
    if (analysis.confidenceLevel) {
      const confidence = analysis.confidenceLevel;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Analysis Confidence: ${confidence}%`, pageWidth - margin - 45, yPosition - 10);
      doc.setTextColor(0, 0, 0);
    }
    
    // Enhanced score bars with severity indicators
    const drawPremiumScoreBar = (
      label: string, 
      score: number, 
      color: [number, number, number],
      severityLabel: string
    ) => {
      checkPageBreak(18);
      
      // Label
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(label, margin, yPosition);
      
      // Severity badge
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(severityLabel, margin, yPosition + 4);
      doc.setTextColor(0, 0, 0);
      
      // Background bar with border
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(margin + 50, yPosition - 5, 100, 8, 2, 2, 'FD');
      
      // Gradient-like score bar (simulate with opacity)
      doc.setFillColor(...color);
      doc.roundedRect(margin + 50, yPosition - 5, score, 8, 2, 2, 'F');
      
      // Score text with circle background
      doc.setFillColor(255, 255, 255);
      doc.circle(margin + 158, yPosition, 5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...color);
      doc.text(`${score}`, margin + 155, yPosition + 1);
      doc.setTextColor(0, 0, 0);
      
      yPosition += 15;
    };
    
    // Determine severity labels
    const getPowerSeverity = (score: number) => {
      if (score >= 70) return 'HIGH IMBALANCE';
      if (score >= 40) return 'MEDIUM';
      return 'LOW IMBALANCE';
    };
    
    const getGravitySeverity = (score: number) => {
      if (score >= 70) return 'CRITICAL';
      if (score >= 40) return 'SIGNIFICANT';
      return 'MINOR';
    };
    
    const getRiskSeverity = (score: number) => {
      if (score >= 70) return 'HIGH RISK';
      if (score >= 40) return 'MODERATE RISK';
      return 'LOW RISK';
    };
    
    drawPremiumScoreBar(
      'Power Dynamics', 
      analysis.powerScore, 
      [251, 146, 60], // Orange/Gold
      getPowerSeverity(analysis.powerScore)
    );
    
    drawPremiumScoreBar(
      'Gravity Score', 
      analysis.gravityScore, 
      [168, 85, 247], // Purple
      getGravitySeverity(analysis.gravityScore)
    );
    
    drawPremiumScoreBar(
      'Risk Level', 
      analysis.riskScore, 
      [34, 197, 94], // Green
      getRiskSeverity(analysis.riskScore)
    );
    
    yPosition += 5;
    
    // ===== TL;DR SECTION =====
    if (analysis.summary) {
      checkPageBreak(20);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 212, 255);
      doc.text('TL;DR', margin, yPosition);
      yPosition += 8;
      
      doc.setTextColor(0, 0, 0);
      addText(analysis.summary, 11, false);
      yPosition += 5;
    }
    
    // ===== WHAT'S HAPPENING =====
    if (analysis.whatsHappening) {
      checkPageBreak(20);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 212, 255);
      doc.text('What\'s Happening', margin, yPosition);
      yPosition += 8;
      
      doc.setTextColor(0, 0, 0);
      addText(analysis.whatsHappening, 11, false);
      yPosition += 5;
    }
    
    // ===== WHY IT MATTERS =====
    if (analysis.whyItMatters) {
      checkPageBreak(20);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 212, 255);
      doc.text('Why It Matters', margin, yPosition);
      yPosition += 8;
      
      doc.setTextColor(0, 0, 0);
      addText(analysis.whyItMatters, 11, false);
      yPosition += 5;
    }
    
    // ===== IMMEDIATE MOVE =====
    if (analysis.immediateMove) {
      checkPageBreak(20);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 212, 255);
      doc.text('Your Next Move', margin, yPosition);
      yPosition += 8;
      
      doc.setTextColor(0, 0, 0);
      addText(analysis.immediateMove, 11, false);
      yPosition += 5;
    }
    
    // ===== STRATEGIC TOOL =====
    if (analysis.strategicTool) {
      checkPageBreak(20);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 212, 255);
      doc.text('Strategic Toolkit', margin, yPosition);
      yPosition += 8;
      
      doc.setTextColor(0, 0, 0);
      addText(analysis.strategicTool, 11, false);
      yPosition += 5;
    }
    
    // ===== ANALYTICAL CHECK =====
    if (analysis.analyticalCheck) {
      checkPageBreak(20);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 212, 255);
      doc.text('Analytical Check', margin, yPosition);
      yPosition += 8;
      
      doc.setTextColor(0, 0, 0);
      addText(analysis.analyticalCheck, 11, false);
      yPosition += 5;
    }
    
    // ===== LONG-TERM FIX =====
    if (analysis.longTermFix) {
      checkPageBreak(20);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 212, 255);
      doc.text('Long-Term Strategy', margin, yPosition);
      yPosition += 8;
      
      doc.setTextColor(0, 0, 0);
      addText(analysis.longTermFix, 11, false);
      yPosition += 5;
    }
    
    // ===== CLASSIFICATION & DIAGNOSTICS =====
    if (analysis.issueCategory || analysis.issueType || analysis.issueLayer) {
      checkPageBreak(35);
      
      // Section header
      doc.setFillColor(245, 245, 250);
      doc.rect(margin - 5, yPosition - 2, contentWidth + 10, 10, 'F');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 18, 63);
      doc.text('📊 CLASSIFICATION', margin, yPosition + 5);
      yPosition += 15;
      doc.setTextColor(0, 0, 0);
      
      const addClassificationItem = (label: string, value: string) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, margin + 5, yPosition);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.text(value, margin + 45, yPosition);
        doc.setTextColor(0, 0, 0);
        
        yPosition += 6;
      };
      
      if (analysis.issueCategory) {
        addClassificationItem('Category', analysis.issueCategory);
      }
      if (analysis.issueType) {
        addClassificationItem('Issue Type', analysis.issueType);
      }
      if (analysis.issueLayer) {
        addClassificationItem('Layer', analysis.issueLayer);
      }
      
      yPosition += 5;
    }
    
    // ===== LEGAL DISCLAIMER =====
    checkPageBreak(25);
    
    doc.setFillColor(255, 250, 240);
    doc.setDrawColor(251, 146, 60);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin - 5, yPosition - 2, contentWidth + 10, 20, 2, 2, 'FD');
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9);
    doc.text('⚠️  IMPORTANT DISCLAIMER', margin, yPosition + 4);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const disclaimerText = 'This report provides psychological intelligence analysis based on AI interpretation. ' +
      'It is NOT a substitute for professional legal, medical, or psychological advice. ' +
      'Always consult qualified professionals for serious matters.';
    
    const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth - 10);
    let disclaimerY = yPosition + 9;
    disclaimerLines.forEach((line: string) => {
      doc.text(line, margin, disclaimerY);
      disclaimerY += 3.5;
    });
    
    yPosition += 25;
    
    // ===== PREMIUM FOOTER ON ALL PAGES =====
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Footer background bar
      doc.setFillColor(245, 245, 250);
      doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      
      // Confidential watermark
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.setFont('helvetica', 'bold');
      doc.text('CONFIDENTIAL', margin, pageHeight - 8);
      
      // Brand text
      doc.setFont('helvetica', 'normal');
      doc.text(
        'MaverickAI Enigma Radar™ - Psychological Intelligence Platform',
        margin,
        pageHeight - 4
      );
      
      // Page numbers (right aligned)
      const pageText = `Page ${i} of ${totalPages}`;
      const pageWidth_text = doc.getTextWidth(pageText);
      doc.text(pageText, pageWidth - margin - pageWidth_text, pageHeight - 8);
      
      // Date stamp (right aligned)
      const timeStamp = new Date().toISOString().split('T')[0];
      const timeWidth = doc.getTextWidth(timeStamp);
      doc.text(timeStamp, pageWidth - margin - timeWidth, pageHeight - 4);
    }
    
    // ===== SAVE PDF =====
    const fileName = `MaverickAI_Analysis_${new Date().toISOString().split('T')[0]}_${analysis.id.substring(0, 8)}.pdf`;
    doc.save(fileName);
    
    console.log(`✅ PDF exported: ${fileName}`);
  } catch (error) {
    console.error('❌ PDF export failed:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

/**
 * Check if user can export to PDF
 * Only Premium and Professional users
 */
export function canExportToPDF(paymentPlan: string): boolean {
  return paymentPlan === 'premium' || paymentPlan === 'professional';
}

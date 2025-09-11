"use client";

import { useState } from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface DownloadProfilePDFProps {
  profileId: string;
  profileName: string;
}

export default function DownloadProfilePDF({ profileId, profileName }: DownloadProfilePDFProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch(`/api/profiles/${profileId}/download`);
      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }
      const report = await response.json();

      const doc = new jsPDF({ unit: 'pt', format: 'a4' });

      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 56;

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text(`${report.profile.name}`, 56, y);
      y += 28;

      // Subtitle
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const generatedAt = new Date(report.generatedAt).toLocaleString();
      doc.text(`Generated: ${generatedAt}`, 56, y);
      y += 24;

      // Divider
      doc.setDrawColor(200, 200, 200);
      doc.line(56, y, pageWidth - 56, y);
      y += 20;

      // Summary (AI concise)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('Summary', 56, y);
      y += 16;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const summary = (report.profile.aiSummary || report.profile.summary || '').trim();
      const summaryLines = doc.splitTextToSize(summary, pageWidth - 112);
      doc.text(summaryLines, 56, y);
      y += summaryLines.length * 14 + 12;

      // Key Stats
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('Key Stats', 56, y);
      y += 16;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const stats = report.statistics;
      const categoriesCount = (stats.categories || []).length;
      const avgConf = stats.avgConfidence ? Math.round(stats.avgConfidence * 100) : 0;
      const dateRange = stats.dateRange?.earliest && stats.dateRange?.latest
        ? `${stats.dateRange.earliest} — ${stats.dateRange.latest}`
        : 'N/A';
      const statsLines = [
        `Total Events: ${stats.totalEvents ?? 0}`,
        `Categories: ${categoriesCount}`,
        `Average Confidence: ${avgConf}%`,
        `Date Range: ${dateRange}`,
      ];
      statsLines.forEach((line) => {
        doc.text(line, 56, y);
        y += 16;
      });

      // Notable Events (top 5, single line each)
      if (Array.isArray(report.events) && report.events.length > 0) {
        y += 8;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('Notable Events', 56, y);
        y += 16;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        const topEvents = report.events.slice(0, 5);
        topEvents.forEach((e: any, idx: number) => {
          const line = `${idx + 1}. ${e.date?.slice(0, 10) || ''} — ${e.event_text}`;
          const lines = doc.splitTextToSize(line, pageWidth - 112);
          doc.text(lines, 56, y);
          y += Math.min(lines.length, 3) * 14 + 6;
        });
      }

      const safeName = profileName.replace(/[^a-z0-9\- ]/gi, '').replace(/\s+/g, '-');
      doc.save(`${safeName || 'profile'}-summary.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`group relative p-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 hover:border-green-400/50 transition-all duration-300 w-full flex flex-col items-start ${isGenerating ? 'opacity-60 cursor-not-allowed' : ''}`}
      aria-label="Download profile PDF"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <Download className="w-12 h-12 text-green-400 mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Download PDF</h3>
      <p className="text-gray-400">One-page, clear summary for offline use</p>
    </button>
  );
}



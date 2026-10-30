"use client";

import React, { useState } from 'react';
import { ProjectHealthChart, TeamWorkloadChart, SprintVelocityChart, CumulativeFlowChart } from '@/components/charts';
import { Download, Loader2, FileText, CheckCircle2, TrendingUp, Users, Target, ShieldCheck } from 'lucide-react';
import { useNotifications } from '@/components/notification-provider';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function ReportsTab() {
  const [isExporting, setIsExporting] = useState(false);
  const { addNotification } = useNotifications();

  const handleExportPDF = async () => {
    const reportsElement = document.getElementById('reports-container');
    if (!reportsElement) return;

    setIsExporting(true);

    try {
      // Capture the container with high DPI
      const canvas = await html2canvas(reportsElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#090d16' : '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // PDF Title Header
      pdf.setFillColor(79, 70, 229); // Indigo 600
      pdf.rect(0, 0, pdfWidth, 24, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text("RAPPORT D'ACTIVITÉ & METRIQUES KPI 2026", 14, 12);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')} | Auteur : Samuel Mbarga`, 14, 18);

      // Add image below header
      const imgWidth = pdfWidth - 28;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 14, 28, imgWidth, Math.min(imgHeight, pdfHeight - 38));

      // PDF Footer
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Document officiel généré par le système de gestion de projets.", 14, pdfHeight - 8);

      // Save PDF
      pdf.save(`Rapport_Performances_KPI_${new Date().toISOString().split('T')[0]}.pdf`);

      addNotification({
        type: 'system',
        title: 'Export PDF Réussi',
        message: 'Le rapport complet des KPI et métriques a été téléchargé au format PDF.',
        link: '#'
      });
    } catch (err) {
      console.error('Erreur lors de la génération du PDF:', err);
      // Fallback: window.print()
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-8">
      {/* Header section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
              Analytique & Performance
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">Rapports & KPI Globaux</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Tableau de bord exécutif des performances d&apos;ingénierie et des budgets projets
          </p>
        </div>

        <button 
          onClick={handleExportPDF}
          disabled={isExporting}
          className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xs shrink-0 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          title="Exporter le rapport actuel au format PDF"
        >
          {isExporting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Génération du PDF...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Exporter en PDF</span>
            </>
          )}
        </button>
      </header>

      {/* KPI Overview Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Livraison à temps</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">94.2%</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Vélocité Moyenne</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">48 pts / sprint</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Target size={20} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Respect Budget</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">98.5%</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Taux d&apos;engagement</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">88%</p>
          </div>
        </div>
      </div>

      {/* Printable / Capturable Container */}
      <div id="reports-container" className="space-y-6 bg-transparent">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1 */}
          <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-200/80 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Santé des Projets (Budget vs Réel)</h2>
                <p className="text-xs text-gray-400">Comparatif des budgets alloués vs dépenses effectives</p>
              </div>
              <ShieldCheck size={18} className="text-indigo-500" />
            </div>
            <ProjectHealthChart />
          </div>
          
          {/* Chart 2 */}
          <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-200/80 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Vélocité de l&apos;équipe (Story points)</h2>
                <p className="text-xs text-gray-400">Points de complexité livrés par sprint</p>
              </div>
              <FileText size={18} className="text-emerald-500" />
            </div>
            <SprintVelocityChart />
          </div>

          {/* Chart 3 */}
          <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-200/80 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Diagramme de Flux Cumulé (CFD)</h2>
                <p className="text-xs text-gray-400">Répartition du volume de travail dans le pipeline</p>
              </div>
            </div>
            <CumulativeFlowChart />
          </div>

          {/* Chart 4 */}
          <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-200/80 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Charge par Collaborateur</h2>
                <p className="text-xs text-gray-400">Volume de tâches attribué par membre de l&apos;équipe</p>
              </div>
            </div>
            <TeamWorkloadChart />
          </div>
        </div>
      </div>
    </div>
  );
}

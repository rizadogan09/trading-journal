import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ExportData {
  trades: any[];
  statistics: {
    winRate: number;
    profitFactor: number;
    averageRRR: number;
  };
  dateRange: {
    from: Date;
    to: Date;
  };
}

export const exportToExcel = async (data: ExportData, options: any) => {
  const worksheet = XLSX.utils.json_to_sheet(data.trades);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Trades");

  // Statistik-Sheet hinzufügen
  const statsData = [
    ["Statistiken", ""],
    ["Win Rate", `${data.statistics.winRate.toFixed(2)}%`],
    ["Profit Faktor", data.statistics.profitFactor.toFixed(2)],
    ["Durchschn. RRR", data.statistics.averageRRR.toFixed(2)],
    ["Zeitraum", `${data.dateRange.from.toLocaleDateString()} - ${data.dateRange.to.toLocaleDateString()}`]
  ];
  const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
  XLSX.utils.book_append_sheet(workbook, statsSheet, "Statistiken");

  XLSX.writeFile(workbook, "trading-journal-export.xlsx");
};

export const exportToPdf = async (data: ExportData, options: any) => {
  const doc = new jsPDF();
  
  // Titel
  doc.setFontSize(20);
  doc.text("Trading Journal Export", 20, 20);

  // Statistiken
  doc.setFontSize(14);
  doc.text("Statistiken", 20, 40);
  doc.setFontSize(12);
  doc.text(`Win Rate: ${data.statistics.winRate.toFixed(2)}%`, 20, 50);
  doc.text(`Profit Faktor: ${data.statistics.profitFactor.toFixed(2)}`, 20, 60);
  doc.text(`Durchschn. RRR: ${data.statistics.averageRRR.toFixed(2)}`, 20, 70);

  // Trades Tabelle
  const tableData = data.trades.map(trade => [
    trade.date,
    trade.instrumentId,
    trade.direction,
    trade.entryPrice,
    trade.exitPrice,
    trade.pnl
  ]);

  doc.autoTable({
    startY: 90,
    head: [['Datum', 'Instrument', 'Richtung', 'Entry', 'Exit', 'P/L']],
    body: tableData,
  });

  doc.save("trading-journal-export.pdf");
}; 
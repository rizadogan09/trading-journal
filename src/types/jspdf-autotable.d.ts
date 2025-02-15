declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  interface UserOptions {
    startY?: number;
    head?: any[][];
    body?: any[][];
    // ... weitere Optionen nach Bedarf
  }

  interface jsPDF {
    autoTable: (options: UserOptions) => void;
  }
} 
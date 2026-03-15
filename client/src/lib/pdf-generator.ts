import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface AuditData {
  report_title: string;
  generated_at: string;
  shop_name: string;
  shop_id: string;
  summary: {
    total_chemicals: number;
    spills_last_30_days: number;
    active_deadlines: number;
    overdue_deadlines: number;
  };
  data: {
    inventory: Array<{
      name: string;
      cas: string;
      quantity: string;
      location: string;
    }>;
    spills: Array<{
      date: string;
      amount: number;
      description: string;
      actions: string;
    }>;
    deadlines: Array<{
      type: string;
      description: string;
      due_date: string;
      status: string;
    }>;
  };
}

export function generateOSHAReport(data: AuditData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(18);
  doc.text(data.report_title, pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Shop: ${data.shop_name}`, 14, 35);
  doc.text(`Generated: ${new Date(data.generated_at).toLocaleString()}`, 14, 42);
  doc.text(`Shop ID: ${data.shop_id}`, 14, 49);

  // Summary
  doc.setFontSize(14);
  doc.text('Safety Summary', 14, 60);
  doc.setFontSize(10);
  doc.text(`Total Chemicals Tracked: ${data.summary.total_chemicals}`, 14, 67);
  doc.text(`Recent Spill Incidents (30d): ${data.summary.spills_last_30_days}`, 14, 72);
  doc.text(`Active Deadlines: ${data.summary.active_deadlines}`, 14, 77);
  doc.text(`Overdue Deadlines: ${data.summary.overdue_deadlines}`, 14, 82);

  let currentY = 90;

  // Inventory Table
  doc.setFontSize(14);
  doc.text('Chemical Inventory', 14, currentY);
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Name', 'CAS Number', 'Quantity', 'Location']],
    body: data.data.inventory.map(i => [i.name, i.cas, i.quantity, i.location]),
  });

  // Spills Table
  currentY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.text('Recent Spill Incidents', 14, currentY);
  if (data.data.spills.length > 0) {
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Date', 'Amount', 'Description', 'Actions Taken']],
      body: data.data.spills.map(s => [
        new Date(s.date).toLocaleDateString(),
        s.amount.toString(),
        s.description,
        s.actions
      ]),
    });
  } else {
    doc.setFontSize(10);
    doc.text('No spills recorded in the last 30 days.', 14, currentY + 10);
    (doc as any).lastAutoTable = { finalY: currentY + 10 };
  }

  // Deadlines Table
  currentY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.text('Compliance Deadlines', 14, currentY);
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Type', 'Description', 'Due Date', 'Status']],
    body: data.data.deadlines.map(d => [
      d.type,
      d.description,
      new Date(d.due_date).toLocaleDateString(),
      d.status
    ]),
  });

  // Footer
  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount} - Chemical Safety Log Vault - Confidential Safety Record`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`OSHA_Safety_Audit_${new Date().toISOString().split('T')[0]}.pdf`);
}

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

  // Header Background
  doc.setFillColor(31, 41, 55); // Slate 800
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text("CHEMICAL SAFETY VAULT", 14, 18);

  // Confidential Seal
  doc.setTextColor(239, 68, 68); // Destructive Red
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("CONFIDENTIAL OSHA RECORD", pageWidth - 14, 18, { align: 'right' });

  // Reset Text Color for Body
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFont('helvetica', 'normal');

  doc.setFontSize(14);
  doc.text(`Shop: ${data.shop_name}`, 14, 40);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text(`Generated: ${new Date(data.generated_at).toLocaleString()}`, 14, 46);
  doc.text(`Shop ID: ${data.shop_id}`, 14, 51);

  // Reset text color for headings
  doc.setTextColor(15, 23, 42); 

  // Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Safety Summary', 14, 65);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Total Chemicals Tracked: ${data.summary.total_chemicals}`, 14, 72);
  doc.text(`Recent Spill Incidents (30d): ${data.summary.spills_last_30_days}`, 14, 77);
  doc.text(`Active Deadlines: ${data.summary.active_deadlines}`, 14, 82);
  
  if (data.summary.overdue_deadlines > 0) {
    doc.setTextColor(239, 68, 68);
    doc.setFont('helvetica', 'bold');
  }
  doc.text(`Overdue Deadlines: ${data.summary.overdue_deadlines}`, 14, 87);
  
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');

  let currentY = 100;

  // Inventory Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Chemical Inventory', 14, currentY);
  doc.setFont('helvetica', 'normal');
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Name', 'CAS Number', 'Quantity', 'Location']],
    body: data.data.inventory.map(i => [i.name, i.cas, i.quantity, i.location]),
    headStyles: { fillColor: [51, 65, 85] }, // Slate 700
  });

  // Spills Table
  currentY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Recent Spill Incidents', 14, currentY);
  doc.setFont('helvetica', 'normal');
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
      headStyles: { fillColor: [51, 65, 85] },
    });
  } else {
    doc.setFontSize(10);
    doc.text('No spills recorded in the last 30 days.', 14, currentY + 10);
    (doc as any).lastAutoTable = { finalY: currentY + 10 };
  }

  // Deadlines Table
  currentY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Compliance Deadlines', 14, currentY);
  doc.setFont('helvetica', 'normal');
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Type', 'Description', 'Due Date', 'Status']],
    body: data.data.deadlines.map(d => [
      d.type,
      d.description,
      new Date(d.due_date).toLocaleDateString(),
      d.status
    ]),
    headStyles: { fillColor: [51, 65, 85] },
  });

  // Footer
  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(203, 213, 225); // Slate 300
    doc.line(14, doc.internal.pageSize.getHeight() - 15, pageWidth - 14, doc.internal.pageSize.getHeight() - 15);
    
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(
      `Page ${i} of ${pageCount} - Chemical Safety Vault \u00A9 ${new Date().getFullYear()}`,
      14,
      doc.internal.pageSize.getHeight() - 8
    );
    
    doc.setTextColor(239, 68, 68); // Red
    doc.text(
      `CONFIDENTIAL REPORT FOR ${data.shop_name.toUpperCase()}`,
      pageWidth - 14,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'right' }
    );
  }

  doc.save(`OSHA_Safety_Audit_${new Date().toISOString().split('T')[0]}.pdf`);
}

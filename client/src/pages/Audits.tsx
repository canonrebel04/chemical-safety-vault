import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileJson, Download, RefreshCw, FileText, Loader2 } from 'lucide-react';
import { useTable, useReducer } from 'spacetimedb/react';
import { tables, reducers } from '@/module_bindings';
import { useAuth } from '@/contexts/AuthContext';
import { generateOSHAReport, AuditData } from '@/lib/pdf-generator';
import { convertToCSV, downloadFile } from '@/lib/export-utils';
import { toast } from 'sonner';

export default function Audits() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const generateSafetyAudit = useReducer(reducers.generateSafetyAudit);
  const allLogs: any[] = (useTable(tables.audit_logs) as any) || [];
  const allInventory: any[] = (useTable(tables.chemical_inventory) as any) || [];
  const allSpills: any[] = (useTable(tables.spill_reports) as any) || [];
  const allDeadlines: any[] = (useTable(tables.compliance_deadlines) as any) || [];
  
  const shopId = user?.shopId.toHexString();
  const shopLogs = allLogs
    .filter(l => l.shopId.toHexString() === shopId)
    .sort((a, b) => Number(b.timestamp.toMillis()) - Number(a.timestamp.toMillis()));

  const inventory = allInventory.filter(i => i.shopId.toHexString() === shopId);
  const spills = allSpills.filter(s => s.shopId.toHexString() === shopId);
  const deadlines = allDeadlines.filter(d => d.shopId.toHexString() === shopId);

  const latestAuditLog = shopLogs.find(l => l.action === "FULL_SAFETY_AUDIT");

  const handleExportCSV = (data: any[], fileName: string) => {
    if (data.length === 0) {
      toast.error(`No ${fileName} data to export.`);
      return;
    }
    const csv = convertToCSV(data);
    downloadFile(csv, `${fileName}_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    toast.success(`${fileName} CSV exported.`);
  };

  const handleExportFullJSON = () => {
    const fullData = {
      shopId,
      exportedAt: new Date().toISOString(),
      inventory,
      spills,
      deadlines,
      activityLogs: shopLogs.map(l => ({ ...l, details: l.action === 'FULL_SAFETY_AUDIT' ? 'JSON Snapshot' : l.details }))
    };
    downloadFile(JSON.stringify(fullData, null, 2), `Vault_Full_Export_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    toast.success("Full data JSON exported.");
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateSafetyAudit();
      toast.success("Audit snapshot generated and logged to vault.");
    } catch (e) {
      toast.error("Failed to generate audit snapshot.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportOSHA = () => {
    if (!latestAuditLog) {
      toast.error("No audit snapshot found. Please generate one first.");
      return;
    }

    setIsExporting(true);
    try {
      const data = JSON.parse(latestAuditLog.details) as AuditData;
      generateOSHAReport(data);
      toast.success("OSHA Report generated successfully.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to parse audit data for PDF generation.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-3xl font-bold tracking-tight">Compliance Audits</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-6 w-6 text-primary" />
            Vault Snapshots
          </CardTitle>
          <CardDescription>
            Compile current shop data into an immutable vault record.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full gap-2" 
            size="lg"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
            {isGenerating ? 'Compiling Vault Data...' : 'Generate New Snapshot'}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            OSHA Compliance Export
          </CardTitle>
          <CardDescription>
            Transform the latest vault snapshot into a professional PDF report.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-background/50 p-4 rounded-lg border border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Latest Snapshot</p>
              <p className="text-xs text-muted-foreground">
                {latestAuditLog 
                  ? new Date(Number(latestAuditLog.timestamp.toMillis())).toLocaleString()
                  : "No snapshots available"}
              </p>
            </div>
            <Button 
              variant="default" 
              onClick={handleExportOSHA} 
              disabled={!latestAuditLog || isExporting}
              className="gap-2"
            >
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Export for OSHA
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Raw Data Portability</CardTitle>
          <CardDescription>Export your raw records for external backup or compliance analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <Button variant="outline" onClick={() => handleExportCSV(inventory, 'Inventory')} className="justify-start">
              <Download className="mr-2 h-4 w-4" /> Export Inventory (CSV)
            </Button>
            <Button variant="outline" onClick={() => handleExportCSV(spills, 'Spills')} className="justify-start">
              <Download className="mr-2 h-4 w-4" /> Export Spills (CSV)
            </Button>
            <Button variant="outline" onClick={() => handleExportCSV(deadlines, 'Deadlines')} className="justify-start">
              <Download className="mr-2 h-4 w-4" /> Export Deadlines (CSV)
            </Button>
            <Button variant="secondary" onClick={handleExportFullJSON} className="justify-start mt-2">
              <FileJson className="mr-2 h-4 w-4" /> Export Full Vault (JSON)
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold mb-4">Audit History</h2>
        <div className="space-y-3">
          {shopLogs.slice(0, 10).map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block">
                  {log.action}
                </span>
                <span className="text-xs">
                  {new Date(Number(log.timestamp.toMillis())).toLocaleString()}
                </span>
              </div>
              <div className="text-right max-w-[150px] truncate italic text-muted-foreground text-xs">
                {log.action === 'FULL_SAFETY_AUDIT' ? 'Snapshot saved' : log.details}
              </div>
            </div>
          ))}
          {shopLogs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No activity logs found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileJson, Download, RefreshCw } from 'lucide-react';
import { useReducer } from 'spacetimedb/react';
import { reducers } from '@/module_bindings';

export default function Audits() {
  const [isGenerating, setIsGenerating] = useState(false);
  const generateSafetyAudit = useReducer(reducers.generateSafetyAudit);

  const handleGenerate = () => {
    setIsGenerating(true);
    generateSafetyAudit();
    // In a real app, we'd wait for a subscription update or a specific event
    // to know the report is ready. For now, we mock a brief delay.
    setTimeout(() => {
      setIsGenerating(false);
      alert("Audit generation triggered on server. Check logs.");
    }, 1000);
  };

  const mockDownload = () => {
    const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ note: "Mock report data" }));
    const dlAnchorElem = document.getElementById('downloadAnchorElem');
    if (dlAnchorElem) {
      dlAnchorElem.setAttribute("href", data);
      dlAnchorElem.setAttribute("download", "safety_audit.json");
      dlAnchorElem.click();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Compliance Audits</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-6 w-6 text-primary" />
            Safety Audit Report
          </CardTitle>
          <CardDescription>
            Generate a comprehensive 30-day safety report including inventory levels, spills, and deadlines.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full gap-2" 
            size="lg"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <RefreshCw className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate 30-Day Audit'}
          </Button>

          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-medium mb-2">Recent Reports</h3>
            <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">safety_audit_latest.json</p>
                <p className="text-xs text-muted-foreground">Generated today</p>
              </div>
              <Button variant="outline" size="sm" onClick={mockDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <a id="downloadAnchorElem" style={{display:"none"}}></a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

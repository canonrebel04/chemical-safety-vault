import { useTable } from 'spacetimedb/react';
import { tables } from '@/module_bindings';
import { useAuth } from '@/contexts/AuthContext';
import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function ActivityFeed() {
  const { user } = useAuth();
  const allLogs: any[] = (useTable(tables.audit_logs) as any) || [];
  
  const shopLogs = allLogs
    .filter(l => l.shopId.toHexString() === user?.shopId.toHexString())
    .sort((a, b) => Number(b.timestamp.toMillis()) - Number(a.timestamp.toMillis()))
    .slice(0, 5); // Get the last 5 entries

  if (shopLogs.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {shopLogs.map((log) => (
            <div key={log.id} className="flex flex-col gap-1 text-sm border-l-2 border-primary/20 pl-3 py-1">
              <div className="flex justify-between items-center text-muted-foreground text-xs">
                <span className="font-mono uppercase tracking-widest text-[10px]">
                  {log.action}
                </span>
                <span>
                  {new Date(Number(log.timestamp.toMillis())).toLocaleString(undefined, { 
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </span>
              </div>
              <p className="font-medium line-clamp-2">{log.details}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

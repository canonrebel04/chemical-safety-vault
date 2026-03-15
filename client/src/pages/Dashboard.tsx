import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShieldAlert, Calendar } from 'lucide-react';
import { useTable } from 'spacetimedb/react';
import { tables } from '@/module_bindings';

import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const allInventory: any[] = (useTable(tables.chemical_inventory) as any) || [];
  const allSpills: any[] = (useTable(tables.spill_reports) as any) || [];
  const allDeadlines: any[] = (useTable(tables.compliance_deadlines) as any) || [];

  const inventory = allInventory.filter(i => i.shopId.toHexString() === user?.shopId.toHexString());
  const spills = allSpills.filter(s => s.shopId.toHexString() === user?.shopId.toHexString());
  const deadlines = allDeadlines.filter(d => d.shopId.toHexString() === user?.shopId.toHexString());

  const activeDeadlines = deadlines.filter((d: any) => d.status === 'Pending').length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Recent Spills</CardTitle>
            <ShieldAlert className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spills.length}</div>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Deadlines</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeadlines}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Live Inventory Summary</h2>
        <div className="space-y-4">
          {inventory.slice(0, 5).map((item: any) => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">CAS: {item.casNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{item.quantity} {item.unit}</p>
                  <p className="text-xs text-muted-foreground">{item.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          {inventory.length === 0 && (
            <p className="text-sm text-muted-foreground">No items in inventory.</p>
          )}
        </div>
      </div>
    </div>
  );
}

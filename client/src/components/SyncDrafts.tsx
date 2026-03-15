import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { RefreshCw, Wifi, WifiOff, Trash2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { offlineManager, DraftForm } from '@/lib/offline-drafts';
import { useReducer } from 'spacetimedb/react';
import { reducers } from '@/module_bindings';
import { toast } from 'sonner';

export function SyncDrafts() {
  const [drafts, setDrafts] = useState<DraftForm[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  const addInventoryItem = useReducer(reducers.addInventoryItem);
  const logSpill = useReducer(reducers.logSpill);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setDrafts(offlineManager.getDrafts());

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSync = async () => {
    if (drafts.length === 0) return;
    setIsSyncing(true);
    let successCount = 0;

    for (const draft of drafts) {
      try {
        if (draft.type === 'inventory') {
          await addInventoryItem(draft.data);
        } else if (draft.type === 'spill') {
          await logSpill(draft.data);
        }
        offlineManager.removeDraft(draft.id);
        successCount++;
      } catch (error) {
        console.error('Failed to sync draft:', draft, error);
      }
    }

    const updatedDrafts = offlineManager.getDrafts();
    setDrafts(updatedDrafts);
    setIsSyncing(false);

    if (successCount > 0) {
      toast.success(`Successfully synced ${successCount} drafts!`);
    }
    if (updatedDrafts.length > 0) {
      toast.error(`${updatedDrafts.length} drafts failed to sync.`);
    }
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to discard all offline drafts?')) {
      offlineManager.clearDrafts();
      setDrafts([]);
      toast.info('Drafts cleared.');
    }
  };

  if (!isOnline) {
    return (
      <div className="fixed top-20 left-4 right-4 z-50 animate-pulse">
        <div className="bg-orange-500 text-white p-2 rounded-lg text-center text-xs font-bold flex items-center justify-center gap-2">
          <WifiOff className="h-4 w-4" />
          Offline Mode - Data will be saved as drafts.
        </div>
      </div>
    );
  }

  if (drafts.length === 0) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <Card className="shadow-lg border-orange-500/50 bg-orange-50/10 backdrop-blur-md">
        <CardContent className="p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-green-500" />
            <p className="text-xs font-medium">
              You have <span className="font-bold">{drafts.length}</span> unsynced drafts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleSync} disabled={isSyncing} className="h-8 gap-1">
              <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
              Sync
            </Button>
            <Button size="icon" variant="ghost" onClick={handleClear} className="h-8 w-8 text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

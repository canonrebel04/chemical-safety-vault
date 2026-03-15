import { useEffect, useRef } from 'react';
import { useTable, useReducer } from 'spacetimedb/react';
import { tables, reducers } from '@/module_bindings';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner'; // Assuming sonner or similar is used for toasts, or I'll implement a helper

export function useDeadlineChecker() {
  const { user } = useAuth();
  const allDeadlines: any[] = (useTable(tables.compliance_deadlines) as any) || [];
  const logDeadlineReminder = useReducer(reducers.logDeadlineReminder);
  const processedDeadlines = useRef<Set<number>>(new Set());

  const shopId = user?.shopId?.toHexString();

  useEffect(() => {
    if (!shopId) return;

    // Request notification permission on first load
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkDeadlines = () => {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const shopDeadlines = allDeadlines.filter(
        d => d.shopId.toHexString() === shopId && d.status !== 'Completed'
      );

      shopDeadlines.forEach(deadline => {
        if (processedDeadlines.current.has(deadline.id)) return;

        const dueDate = new Date(Number(deadline.dueDate.toMillis()));
        let message = '';
        let type: 'overdue' | 'upcoming' | null = null;

        if (dueDate < now) {
          message = `OVERDUE: ${deadline.type} - ${deadline.description}`;
          type = 'overdue';
        } else if (dueDate < nextWeek) {
          message = `UPCOMING: ${deadline.type} due on ${dueDate.toLocaleDateString()}`;
          type = 'upcoming';
        }

        if (type) {
          showNotification(message, type);
          logDeadlineReminder({ deadlineId: deadline.id, message });
          processedDeadlines.current.add(deadline.id);
        }
      });
    };

    checkDeadlines();
  }, [allDeadlines, shopId, logDeadlineReminder]);
}

function showNotification(message: string, type: 'overdue' | 'upcoming') {
  // In-app Toast
  if (type === 'overdue') {
    toast.error(message, { duration: 10000 });
  } else {
    toast.warning(message, { duration: 5000 });
  }

  // Browser Push Notification (PWA)
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Chemical Safety Vault', {
      body: message,
      icon: '/vite.svg',
    });
  }
}

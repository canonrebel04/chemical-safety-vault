import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Package, ShieldAlert, FileText, Calendar, Users, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDeadlineChecker } from '@/hooks/useDeadlineChecker';

export default function Layout() {
  const location = useLocation();
  useDeadlineChecker();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Inventory', path: '/inventory', icon: Package },
    { name: 'SDS', path: '/sds', icon: FileText },
    { name: 'Spills', path: '/spills', icon: ShieldAlert },
    { name: 'Deadlines', path: '/deadlines', icon: Calendar },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Billing', path: '/billing', icon: CreditCard },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-16">
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 max-w-2xl">
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/50 pb-safe">
        <ul className="flex items-center justify-around p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[64px]",
                    isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-6 w-6 mb-1" />
                  <span className="text-[10px] font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

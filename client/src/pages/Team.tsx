import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Users, UserPlus, Copy, Check, LogOut, Bell, BellOff } from 'lucide-react';
import { useTable, useReducer } from 'spacetimedb/react';
import { tables, reducers } from '@/module_bindings';
import { useAuth } from '@/contexts/AuthContext';
import { Identity } from 'spacetimedb';

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const joinSchema = z.object({
  shopId: z.string().min(1, 'Shop ID is required'),
});

export default function Team() {
  const { user, logout } = useAuth();
  const users: any[] = (useTable(tables.users) as any) || [];
  const invites: any[] = (useTable(tables.invites) as any) || [];
  const inviteUser = useReducer(reducers.inviteUser);
  const acceptInvite = useReducer(reducers.acceptInvite);
  
  const [copied, setCopied] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? Notification.permission : 'default'
  );

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const inviteForm = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '' },
  });

  const joinForm = useForm<z.infer<typeof joinSchema>>({
    resolver: zodResolver(joinSchema),
    defaultValues: { shopId: '' },
  });

  const teamMembers = users.filter(u => u.shopId.toHexString() === user?.shopId.toHexString());
  const shopInvites = invites.filter(i => i.shopId.toHexString() === user?.shopId.toHexString());

  function onInvite(values: z.infer<typeof inviteSchema>) {
    inviteUser({ email: values.email });
    inviteForm.reset();
  }

  function onJoin(values: z.infer<typeof joinSchema>) {
    try {
      const targetShopId = Identity.fromString(values.shopId);
      acceptInvite({ shopId: targetShopId });
      joinForm.reset();
    } catch (e) {
      alert("Invalid Shop ID format");
    }
  }

  const copyShopId = () => {
    if (user?.shopId) {
      navigator.clipboard.writeText(user.shopId.toHexString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Team</h1>
        <Button variant="ghost" size="sm" onClick={logout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Stay updated on compliance deadlines.</CardDescription>
          </div>
          {notificationPermission === 'granted' ? (
            <div className="flex items-center text-green-500 text-sm font-medium">
              <Bell className="mr-2 h-4 w-4" />
              Enabled
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={requestPermission} className="text-orange-500">
              <BellOff className="mr-2 h-4 w-4" />
              Enable
            </Button>
          )}
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shop Information</CardTitle>
          <CardDescription>Share this ID with your team members to have them join your vault.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="bg-muted p-2 rounded flex-1 font-mono text-xs truncate">
              {user?.shopId.toHexString()}
            </div>
            <Button size="icon" variant="outline" onClick={copyShopId}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id.toHexString()} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{member.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                  </div>
                  {member.id.toHexString() === user?.id.toHexString() && (
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded">You</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite Member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...inviteForm}>
              <form onSubmit={inviteForm.handleSubmit(onInvite)} className="space-y-4">
                <FormField
                  control={inviteForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="technician@shop.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Send Invite</Button>
              </form>
            </Form>

            {shopInvites.length > 0 && (
              <div className="mt-6 space-y-2">
                <p className="text-sm font-medium">Pending Invites</p>
                {shopInvites.filter(i => i.status === 'pending').map((invite) => (
                  <div key={invite.id} className="text-xs bg-muted p-2 rounded flex justify-between">
                    <span>{invite.inviteeEmail}</span>
                    <span className="text-orange-500 italic">Pending</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Join Another Shop</CardTitle>
            <CardDescription>Enter a Shop ID to switch your affiliation.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...joinForm}>
              <form onSubmit={joinForm.handleSubmit(onJoin)} className="space-y-4">
                <FormField
                  control={joinForm.control}
                  name="shopId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Paste Shop ID here..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="secondary" className="w-full">Join Shop</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

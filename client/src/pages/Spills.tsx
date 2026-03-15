import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Droplets, Loader2 } from 'lucide-react';
import { useTable, useReducer } from 'spacetimedb/react';
import { tables, reducers } from '@/module_bindings';
import { offlineManager } from '@/lib/offline-drafts';
import { toast } from 'sonner';

const formSchema = z.object({
  chemicalId: z.string().min(1, 'Please select a chemical'),
  amountSpilled: z.string().min(1, 'Amount must be provided'),
  description: z.string().min(5, 'Provide a brief description'),
  actionsTaken: z.string().min(5, 'Describe actions taken'),
  witnesses: z.string().optional(),
});

import { useAuth } from '@/contexts/AuthContext';

export default function Spills() {
  const { user } = useAuth();
  const allInventory: any[] = (useTable(tables.chemical_inventory) as any) || [];
  const allSpills: any[] = (useTable(tables.spill_reports) as any) || [];

  const inventory = allInventory.filter(i => i.shopId.toHexString() === user?.shopId.toHexString());
  const spills = allSpills.filter(s => s.shopId.toHexString() === user?.shopId.toHexString());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const logSpill = useReducer(reducers.logSpill);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chemicalId: '',
      amountSpilled: '',
      description: '',
      actionsTaken: '',
      witnesses: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      chemicalId: parseInt(values.chemicalId, 10),
      amountSpilled: parseFloat(values.amountSpilled),
      description: values.description,
      actionsTaken: values.actionsTaken,
      witnesses: values.witnesses || ''
    };

    if (!navigator.onLine) {
      offlineManager.saveDraft('spill', data);
      toast.success('Offline: Saved as draft');
      setIsAddOpen(false);
      form.reset();
      return;
    }

    setIsSubmitting(true);
    try {
      await logSpill(data);
      setIsAddOpen(false);
      form.reset();
      toast.success('Spill logged successfully');
    } catch (error) {
      toast.error('Failed to log spill');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Spill Logs</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="destructive" className="rounded-full shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log New Spill</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="chemicalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chemical Spilled</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a chemical" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {inventory.map((item: any) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                              {item.name} ({item.casNumber})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amountSpilled"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount Spilled (approx)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description of Incident</FormLabel>
                      <FormControl>
                        <Textarea placeholder="How did it happen?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="actionsTaken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Actions Taken</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Clean up procedures used" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="witnesses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Witnesses (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Names of people present" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" variant="destructive" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Submit Report
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {spills.map((spill: any) => {
          const chemical = inventory.find((c: any) => c.id === spill.chemicalId);
          return (
            <Card key={spill.id} className="border-l-4 border-l-destructive">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-destructive" />
                    {chemical?.name || 'Unknown Chemical'}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {new Date(Number(spill.date.toMillis())).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="font-semibold">Amount:</span> {spill.amountSpilled} {chemical?.unit}</p>
                <p><span className="font-semibold">Description:</span> {spill.description}</p>
                <p><span className="font-semibold">Actions:</span> {spill.actionsTaken}</p>
              </CardContent>
            </Card>
          );
        })}
        {spills.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No spills recorded. Keep up the safe work!
          </div>
        )}
      </div>
    </div>
  );
}

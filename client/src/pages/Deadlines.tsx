import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Plus, AlertCircle } from 'lucide-react';
import { useTable, useReducer } from 'spacetimedb/react';
import { Timestamp } from 'spacetimedb';
import { tables, reducers } from '@/module_bindings';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required'),
});

import { useAuth } from '@/contexts/AuthContext';

export default function Deadlines() {
  const { user } = useAuth();
  const allDeadlines: any[] = (useTable(tables.compliance_deadlines) as any) || [];
  const deadlines = allDeadlines.filter(d => d.shopId.toHexString() === user?.shopId.toHexString());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const createDeadline = useReducer(reducers.createDeadline);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '',
      description: '',
      dueDate: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const dueDate = new Date(values.dueDate);
    createDeadline({
      type: values.type,
      description: values.description,
      dueDate: Timestamp.fromDate(dueDate)
    });
    setIsAddOpen(false);
    form.reset();
  }

  const now = new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Deadlines</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="rounded-full shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Compliance Deadline</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regulation Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="e.g., OSHA, EPA" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="OSHA">OSHA</SelectItem>
                          <SelectItem value="EPA">EPA</SelectItem>
                          <SelectItem value="HIPAA">HIPAA</SelectItem>
                          <SelectItem value="Internal">Internal</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Submit annual hazard report" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">Create Deadline</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {[...deadlines]
          .sort((a, b) => Number(a.dueDate) - Number(b.dueDate))
          .map((deadline) => {
            const dueDate = new Date(Number(deadline.dueDate) / 1000);
            const isOverdue = dueDate < now && deadline.status !== 'Completed';
            
            return (
              <Card key={deadline.id} className={cn(
                "border-l-4",
                isOverdue ? "border-l-destructive bg-destructive/10" : "border-l-primary"
              )}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {isOverdue ? <AlertCircle className="h-5 w-5 text-destructive" /> : <Calendar className="h-5 w-5 text-primary" />}
                      {deadline.type}
                    </CardTitle>
                    <span className={cn(
                      "text-xs font-semibold px-2 py-1 rounded-full",
                      isOverdue ? "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground"
                    )}>
                      {deadline.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-base">{deadline.description}</p>
                  <p className={cn("font-medium", isOverdue && "text-destructive")}>
                    Due: {dueDate.toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            );
        })}
        {deadlines.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No compliance deadlines upcoming.
          </div>
        )}
      </div>
    </div>
  );
}

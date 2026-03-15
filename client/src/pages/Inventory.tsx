import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Plus, QrCode } from 'lucide-react';
import { useTable, useReducer } from 'spacetimedb/react';
import { tables, reducers } from '@/module_bindings';

const formSchema = z.object({
  casNumber: z.string().min(1, 'CAS Number is required'),
  name: z.string().min(1, 'Name is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  unit: z.string().min(1, 'Unit is required'),
  location: z.string().min(1, 'Location is required'),
});

import { useAuth } from '@/contexts/AuthContext';

export default function Inventory() {
  const { user } = useAuth();
  const allInventory: any[] = (useTable(tables.chemical_inventory) as any) || [];
  const inventory = allInventory.filter(i => i.shopId.toHexString() === user?.shopId.toHexString());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const addInventoryItem = useReducer(reducers.addInventoryItem);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      casNumber: '',
      name: '',
      quantity: '',
      unit: '',
      location: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addInventoryItem({
      casNumber: values.casNumber,
      name: values.name,
      quantity: parseFloat(values.quantity),
      unit: values.unit,
      location: values.location
    });
    setIsAddOpen(false);
    form.reset();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="rounded-full shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Chemical</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="casNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CAS Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 67-64-1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Acetone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. L, kg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Shelf A1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Add Item</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Button variant="outline" className="w-full gap-2 py-6 border-dashed border-2">
        <QrCode className="h-5 w-5" />
        Scan Barcode (Placeholder)
      </Button>

      <div className="space-y-4">
        {inventory.map((item: any) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">CAS: </span>
                  <span className="font-medium">{item.casNumber}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Qty: </span>
                  <span className="font-medium">{item.quantity} {item.unit}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Loc: </span>
                  <span className="font-medium">{item.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {inventory.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No items found. Tap + to add.
          </div>
        )}
      </div>
    </div>
  );
}

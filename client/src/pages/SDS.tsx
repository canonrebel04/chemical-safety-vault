import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, UploadCloud, Link as LinkIcon } from 'lucide-react';
import { useTable, useReducer } from 'spacetimedb/react';
import { Timestamp } from 'spacetimedb';
import { tables, reducers } from '@/module_bindings';

const formSchema = z.object({
  chemicalId: z.string().min(1, 'Please select a chemical'),
  file: z.any().refine((files) => files?.length == 1, 'File is required.'),
});

export default function SDS() {
  const inventory: any[] = (useTable(tables.chemical_inventory) as any) || [];
  const sdsDocs: any[] = (useTable(tables.sds_documents) as any) || [];
  const [isUploading, setIsUploading] = useState(false);
  const uploadSds = useReducer(reducers.uploadSds);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chemicalId: '',
    },
  });

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUploading(true);
    try {
      const file = values.file[0] as File;
      // Mock S3 upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockS3Url = `https://s3.mock/sds/${file.name}`;
      
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 3); // Mock expiry 3 years from now

      uploadSds({
        chemicalId: parseInt(values.chemicalId, 10),
        filename: file.name,
        s3Url: mockS3Url,
        expiryDate: Timestamp.fromDate(expiryDate)
      });
      
      form.reset();
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">SDS Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload New SDS</CardTitle>
          <CardDescription>Link a safety data sheet to an inventory item.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="chemicalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chemical</FormLabel>
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

              <FormItem>
                <FormLabel>SDS PDF Document</FormLabel>
                <FormControl>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
                    <UploadCloud className="h-8 w-8 mb-2" />
                    <Input 
                      type="file" 
                      accept=".pdf" 
                      className="cursor-pointer max-w-xs"
                      {...fileRef}
                    />
                  </div>
                </FormControl>
                <FormMessage>{form.formState.errors.file?.message as string}</FormMessage>
              </FormItem>

              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload & Link SDS'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold mb-4">Linked Documents</h2>
        <div className="space-y-3">
          {sdsDocs.map((doc: any) => {
            const chemical = inventory.find((c: any) => c.id === doc.chemicalId);
            return (
              <Card key={doc.id} className="bg-card/50">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium text-sm truncate max-w-[150px]">{doc.filename}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" />
                        {chemical?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={doc.s3Url} target="_blank" rel="noreferrer">View</a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          {sdsDocs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center p-4">No SDS documents uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

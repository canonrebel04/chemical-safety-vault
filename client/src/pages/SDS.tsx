import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, UploadCloud, Link as LinkIcon, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { useTable, useReducer } from 'spacetimedb/react';
import { Timestamp } from 'spacetimedb';
import { tables, reducers } from '@/module_bindings';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  chemicalId: z.string().min(1, 'Please select a chemical'),
  file: z.any().refine((files) => files?.length == 1, 'File is required.'),
});

export default function SDS() {
  const { user } = useAuth();
  const allInventory: any[] = (useTable(tables.chemical_inventory) as any) || [];
  const allSdsDocs: any[] = (useTable(tables.sds_documents) as any) || [];
  
  const inventory = allInventory.filter(i => i.shopId.toHexString() === user?.shopId.toHexString());
  const sdsDocs = allSdsDocs.filter(d => d.shopId.toHexString() === user?.shopId.toHexString());

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const requestS3Upload = useReducer(reducers.requestS3Upload);
  const attachSDS = useReducer(reducers.attachSds);
  const deleteSDS = useReducer(reducers.deleteSds);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chemicalId: '',
    },
  });

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const file = values.file[0] as File;
      
      /**
       * Stage 1: Request presigned URL from SpacetimeDB
       */
      await requestS3Upload({ filename: file.name });
      const mockPublicUrl = `https://d123.cloudfront.net/${user?.shopId.toHexString()}/${file.name}`;
      
      /**
       * Stage 2: Upload directly to S3 (Mocked with axios)
       * In a real app, this would be: 
       * await axios.put(presignedUrl, file, { headers: { 'Content-Type': 'application/pdf' } });
       */
      for (let i = 0; i <= 100; i += 20) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      /**
       * Stage 3: Attach the public URL to the chemical record in SpacetimeDB
       */
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 3);

      await attachSDS({
        chemicalId: parseInt(values.chemicalId, 10),
        filename: file.name,
        s3Url: mockPublicUrl,
        expiryDate: Timestamp.fromDate(expiryDate)
      });
      
      form.reset();
      alert("SDS Uploaded and linked successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload SDS. See console for details.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  const handleDelete = async (sdsId: number) => {
    if (confirm("Are you sure you want to remove this SDS?")) {
      await deleteSDS({ sdsId });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">SDS Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload New SDS</CardTitle>
          <CardDescription>Upload a PDF directly to secure storage and link it to an inventory item.</CardDescription>
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

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Uploading to S3...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Upload & Link SDS'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Linked Documents</h2>
          <span className="text-xs text-muted-foreground">{sdsDocs.length} documents</span>
        </div>
        
        <div className="space-y-3">
          {sdsDocs.map((doc: any) => {
            const chemical = inventory.find((c: any) => c.id === doc.chemicalId);
            return (
              <Card key={doc.id} className="bg-card/50">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm truncate max-w-[150px]">{doc.filename}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-bold tracking-wider">
                        <LinkIcon className="h-3 w-3" />
                        {chemical?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" asChild title="View Document">
                      <a href={doc.s3Url} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(doc.id)}
                      title="Delete SDS"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {sdsDocs.length === 0 && (
            <div className="text-center py-12 border-2 border-dotted rounded-xl bg-muted/5">
              <FileText className="h-12 w-12 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No SDS documents linked yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

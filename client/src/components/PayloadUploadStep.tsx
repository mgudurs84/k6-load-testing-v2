import { useState, useRef } from 'react';
import { Upload, FileJson, Check, AlertCircle, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ApiEndpoint } from '@shared/mock-data';

export interface PayloadFile {
  apiId: string;
  fileName: string;
  data: any[];
  recordCount: number;
}

interface PayloadUploadStepProps {
  selectedApis: ApiEndpoint[];
  payloads: PayloadFile[];
  onPayloadsChange: (payloads: PayloadFile[]) => void;
}

export function PayloadUploadStep({
  selectedApis,
  payloads,
  onPayloadsChange,
}: PayloadUploadStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const getPayloadForApi = (apiId: string) => {
    return payloads.find((p) => p.apiId === apiId);
  };

  const handleFileUpload = (apiId: string, file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        // Ensure it's an array
        const dataArray = Array.isArray(parsed) ? parsed : [parsed];

        if (dataArray.length === 0) {
          setErrors((prev) => ({
            ...prev,
            [apiId]: 'File contains no data',
          }));
          return;
        }

        // Clear any previous errors
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[apiId];
          return newErrors;
        });

        // Update payloads
        const newPayload: PayloadFile = {
          apiId,
          fileName: file.name,
          data: dataArray,
          recordCount: dataArray.length,
        };

        const existingIndex = payloads.findIndex((p) => p.apiId === apiId);
        if (existingIndex >= 0) {
          const updated = [...payloads];
          updated[existingIndex] = newPayload;
          onPayloadsChange(updated);
        } else {
          onPayloadsChange([...payloads, newPayload]);
        }
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          [apiId]: 'Invalid JSON file. Please upload a valid JSON array.',
        }));
      }
    };

    reader.onerror = () => {
      setErrors((prev) => ({
        ...prev,
        [apiId]: 'Failed to read file',
      }));
    };

    reader.readAsText(file);
  };

  const handleRemovePayload = (apiId: string) => {
    onPayloadsChange(payloads.filter((p) => p.apiId !== apiId));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[apiId];
      return newErrors;
    });
  };

  const getMethodBadgeVariant = (method: string) => {
    switch (method) {
      case 'GET':
        return 'default';
      case 'POST':
        return 'secondary';
      case 'PUT':
        return 'outline';
      case 'DELETE':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-3xl font-bold" data-testid="text-payload-title">
          Upload Payload Data
        </h2>
        <p className="text-muted-foreground">
          Upload JSON files containing test data for each API endpoint
        </p>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <FileJson className="mt-0.5 h-5 w-5 text-primary" />
          <div className="text-sm">
            <p className="font-medium">JSON File Format</p>
            <p className="text-muted-foreground">
              Upload a JSON file containing an array of objects. Each object represents one request payload.
            </p>
            <pre className="mt-2 rounded bg-muted p-2 text-xs">
{`[
  {"patientId": "P001", "name": "John Doe"},
  {"patientId": "P002", "name": "Jane Smith"}
]`}
            </pre>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {selectedApis.map((api) => {
          const payload = getPayloadForApi(api.id);
          const error = errors[api.id];

          return (
            <Card key={api.id} data-testid={`card-api-payload-${api.id}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Badge variant={getMethodBadgeVariant(api.method)}>
                      {api.method}
                    </Badge>
                    <span className="font-mono text-sm">{api.path}</span>
                  </div>
                  <Badge variant="outline">{api.category}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  {api.description}
                </p>

                {!payload ? (
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      ref={(el) => (fileInputRefs.current[api.id] = el)}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(api.id, file);
                        }
                      }}
                      data-testid={`input-file-${api.id}`}
                    />
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-dashed py-8"
                      onClick={() => fileInputRefs.current[api.id]?.click()}
                      data-testid={`button-upload-${api.id}`}
                    >
                      <Upload className="h-5 w-5" />
                      Choose JSON File
                    </Button>
                    {error && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium" data-testid={`text-filename-${api.id}`}>
                            {payload.fileName}
                          </p>
                          <p className="text-sm text-muted-foreground" data-testid={`text-records-${api.id}`}>
                            {payload.recordCount.toLocaleString()} records loaded
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              data-testid={`button-preview-${api.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Payload Preview - {api.path}</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="max-h-96">
                              <pre className="rounded-lg bg-muted p-4 text-xs">
                                {JSON.stringify(payload.data.slice(0, 5), null, 2)}
                              </pre>
                              {payload.recordCount > 5 && (
                                <p className="mt-2 text-center text-sm text-muted-foreground">
                                  ... and {payload.recordCount - 5} more records
                                </p>
                              )}
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePayload(api.id)}
                          data-testid={`button-remove-${api.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Upload Progress</p>
            <p className="text-sm text-muted-foreground">
              {payloads.length} of {selectedApis.length} APIs configured
            </p>
          </div>
          <div className="flex items-center gap-2">
            {payloads.length === selectedApis.length ? (
              <Badge variant="default" className="gap-1">
                <Check className="h-3 w-3" />
                All APIs Ready
              </Badge>
            ) : (
              <Badge variant="secondary">
                {selectedApis.length - payloads.length} remaining
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ExternalLink, Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CAELTestResultsProps {
  runId: string;
  runUrl: string;
  testId: string;
  githubToken: string;
  onBack: () => void;
}

interface WorkflowStatus {
  id: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: string | null;
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface Artifact {
  id: number;
  name: string;
  size: number;
  createdAt: string;
  downloadUrl: string;
}

export function CAELTestResults({ runId, runUrl, testId, githubToken, onBack }: CAELTestResultsProps) {
  const [status, setStatus] = useState<WorkflowStatus | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshStatus = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/github/workflow-status/${runId}`, {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workflow status');
      }

      const data = await response.json();
      setStatus(data);

      // If completed, fetch artifacts
      if (data.status === 'completed') {
        await fetchArtifacts();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh status');
    } finally {
      setLoading(false);
    }
  };

  const fetchArtifacts = async () => {
    try {
      const response = await fetch(`/api/github/workflow-artifacts/${runId}`, {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch artifacts');
      }

      const data = await response.json();
      setArtifacts(data.artifacts || []);
    } catch (err) {
      console.error('Error fetching artifacts:', err);
    }
  };

  const getStatusBadge = () => {
    if (!status) return null;

    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      queued: { variant: 'secondary', label: 'Queued' },
      in_progress: { variant: 'default', label: 'Running' },
      completed: { variant: status.conclusion === 'success' ? 'default' : 'destructive', label: status.conclusion || 'Completed' },
    };

    const statusInfo = variants[status.status] || { variant: 'outline', label: status.status };

    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="space-y-6" data-testid="cael-test-results">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">CAEL Load Test Results</h2>
          <p className="text-muted-foreground">Test ID: {testId}</p>
        </div>
        <Button variant="outline" onClick={onBack} data-testid="button-back-to-dashboard">
          Back to Dashboard
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Workflow Status</CardTitle>
              <CardDescription>GitHub Actions workflow run</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              <Button
                variant="outline"
                size="sm"
                onClick={refreshStatus}
                disabled={loading}
                data-testid="button-refresh-status"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Run ID</p>
              <p className="font-mono text-sm">{runId}</p>
            </div>
            {status && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{status.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm">{new Date(status.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Updated</p>
                  <p className="text-sm">{new Date(status.updatedAt).toLocaleString()}</p>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={runUrl} target="_blank" rel="noopener noreferrer" data-testid="link-github-run">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {artifacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Artifacts</CardTitle>
            <CardDescription>Download test results and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {artifacts.map((artifact) => (
                <div
                  key={artifact.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                  data-testid={`artifact-${artifact.id}`}
                >
                  <div>
                    <p className="font-medium">{artifact.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(artifact.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={artifact.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`button-download-artifact-${artifact.id}`}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {status?.status === 'in_progress' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Test is currently running. Click the refresh button to check for updates and artifacts.
          </AlertDescription>
        </Alert>
      )}

      {!status && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Click the refresh button to check the workflow status
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Calendar, Clock, Search, PlayCircle, CheckCircle2, XCircle, Loader } from 'lucide-react';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import type { TestConfiguration, TestRun } from '@shared/schema';
import { healthcareApps } from '@shared/mock-data';
import { format } from 'date-fns';

const statusConfig = {
  pending: { icon: Clock, color: 'bg-app-yellow/10 text-app-yellow border-app-yellow/20', label: 'Pending' },
  running: { icon: Loader, color: 'bg-app-blue/10 text-app-blue border-app-blue/20', label: 'Running' },
  completed: { icon: CheckCircle2, color: 'bg-app-green/10 text-app-green border-app-green/20', label: 'Completed' },
  failed: { icon: XCircle, color: 'bg-method-delete/10 text-method-delete border-method-delete/20', label: 'Failed' },
};

export default function TestHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'running' | 'completed' | 'failed'>('all');

  const { data: testConfigurations = [], isLoading: configurationsLoading } = useQuery<TestConfiguration[]>({
    queryKey: ['/api/test-configurations'],
  });

  const { data: testRuns = [], isLoading: runsLoading } = useQuery<TestRun[]>({
    queryKey: ['/api/test-runs'],
  });

  const enrichedRuns = testRuns.map((run) => {
    const config = testConfigurations.find((c) => c.id === run.testConfigurationId);
    const app = healthcareApps.find((a) => a.id === config?.applicationId);
    return { ...run, config, app };
  });

  const filteredRuns = enrichedRuns.filter((run) => {
    const matchesSearch =
      run.config?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.app?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || run.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: testRuns.length,
    pending: testRuns.filter((r) => r.status === 'pending').length,
    running: testRuns.filter((r) => r.status === 'running').length,
    completed: testRuns.filter((r) => r.status === 'completed').length,
    failed: testRuns.filter((r) => r.status === 'failed').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto max-w-7xl px-6 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="mb-2 text-4xl font-bold" data-testid="text-history-title">Test History</h1>
            <p className="text-muted-foreground">View and manage your load test configurations and runs</p>
          </div>

          <div className="grid gap-6 md:grid-cols-5">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Total Tests</p>
              <p className="mt-1 text-3xl font-semibold" data-testid="text-stat-total">{stats.total}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="mt-1 text-3xl font-semibold text-app-yellow" data-testid="text-stat-pending">{stats.pending}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Running</p>
              <p className="mt-1 text-3xl font-semibold text-app-blue" data-testid="text-stat-running">{stats.running}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="mt-1 text-3xl font-semibold text-app-green" data-testid="text-stat-completed">{stats.completed}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="mt-1 text-3xl font-semibold text-method-delete" data-testid="text-stat-failed">{stats.failed}</p>
            </Card>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search test runs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-tests"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="all" data-testid="tab-filter-all">All</TabsTrigger>
                <TabsTrigger value="pending" data-testid="tab-filter-pending">Pending</TabsTrigger>
                <TabsTrigger value="running" data-testid="tab-filter-running">Running</TabsTrigger>
                <TabsTrigger value="completed" data-testid="tab-filter-completed">Completed</TabsTrigger>
                <TabsTrigger value="failed" data-testid="tab-filter-failed">Failed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {configurationsLoading || runsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredRuns.length === 0 ? (
            <Card className="p-12 text-center">
              <PlayCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No test runs found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start a new load test to see results here'}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRuns.map((run) => {
                const StatusIcon = statusConfig[run.status].icon;
                const duration = run.completedAt
                  ? Math.round((new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime()) / 1000 / 60)
                  : null;

                return (
                  <Card key={run.id} className="p-6 hover-elevate" data-testid={`card-test-run-${run.id}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold" data-testid={`text-test-name-${run.id}`}>
                            {run.config?.name || 'Unnamed Test'}
                          </h3>
                          <Badge className={`border ${statusConfig[run.status].color}`} variant="outline">
                            <StatusIcon className={`mr-1 h-3 w-3 ${run.status === 'running' ? 'animate-spin' : ''}`} />
                            {statusConfig[run.status].label}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(run.startedAt), 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                          {duration !== null && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{duration} min</span>
                            </div>
                          )}
                          {run.app && <Badge variant="secondary">{run.app.name}</Badge>}
                        </div>

                        {run.config && (
                          <div className="flex items-center gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">VUs:</span>{' '}
                              <span className="font-medium">{run.config.virtualUsers}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Duration:</span>{' '}
                              <span className="font-medium">{run.config.duration}m</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">APIs:</span>{' '}
                              <span className="font-medium">{run.config.selectedApiIds.length}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <Button variant="outline" data-testid={`button-view-details-${run.id}`}>
                        View Details
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

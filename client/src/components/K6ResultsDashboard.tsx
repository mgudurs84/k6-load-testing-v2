import { Activity, CheckCircle2, XCircle, Clock, Zap, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface K6Results {
  avgResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  requestsPerSecond: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
}

interface K6ResultsDashboardProps {
  results: K6Results;
  onAnalyzeWithAI: () => void;
}

export function K6ResultsDashboard({ results, onAnalyzeWithAI }: K6ResultsDashboardProps) {
  const successRate = ((results.successfulRequests / results.totalRequests) * 100).toFixed(2);
  const thresholds = {
    responseTime: results.avgResponseTime < 200 ? 'good' : results.avgResponseTime < 500 ? 'warning' : 'error',
    errorRate: results.errorRate < 1 ? 'good' : results.errorRate < 5 ? 'warning' : 'error',
  };

  return (
    <div className="space-y-6" data-testid="k6-results-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">K6 Load Test Results</h2>
          <p className="text-sm text-muted-foreground mt-1">Comprehensive performance metrics from your test run</p>
        </div>
        <Button 
          onClick={onAnalyzeWithAI} 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          data-testid="button-analyze-ai"
        >
          <Zap className="w-4 h-4 mr-2" />
          Analyze with Vertex AI
        </Button>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {thresholds.responseTime === 'good' && thresholds.errorRate === 'good' ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Test Passed
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-amber-500" />
                Test Completed with Warnings
              </>
            )}
          </CardTitle>
          <CardDescription>
            Success Rate: {successRate}% ({results.successfulRequests.toLocaleString()} / {results.totalRequests.toLocaleString()} requests)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={parseFloat(successRate)} className="h-2" />
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Response Time */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.avgResponseTime}ms</div>
            <Badge 
              variant={thresholds.responseTime === 'good' ? 'default' : 'destructive'} 
              className="mt-2"
              data-testid="badge-response-time-status"
            >
              {thresholds.responseTime === 'good' ? 'Good' : 'Needs Attention'}
            </Badge>
          </CardContent>
        </Card>

        {/* Error Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.errorRate}%</div>
            <Badge 
              variant={thresholds.errorRate === 'good' ? 'default' : 'destructive'} 
              className="mt-2"
              data-testid="badge-error-rate-status"
            >
              {thresholds.errorRate === 'good' ? 'Low' : 'High'}
            </Badge>
          </CardContent>
        </Card>

        {/* Requests Per Second */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Throughput
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.requestsPerSecond}</div>
            <p className="text-sm text-muted-foreground mt-2">requests/sec</p>
          </CardContent>
        </Card>

        {/* Total Requests */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.totalRequests.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {results.failedRequests.toLocaleString()} failed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Percentile Response Times */}
      <Card>
        <CardHeader>
          <CardTitle>Response Time Percentiles</CardTitle>
          <CardDescription>Distribution of response times across all requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">95th Percentile (p95)</p>
                <p className="text-xs text-muted-foreground">95% of requests completed within this time</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{results.p95ResponseTime}ms</p>
              </div>
            </div>
            <Progress value={Math.min((results.p95ResponseTime / 1000) * 100, 100)} className="h-2" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">99th Percentile (p99)</p>
                <p className="text-xs text-muted-foreground">99% of requests completed within this time</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{results.p99ResponseTime}ms</p>
              </div>
            </div>
            <Progress value={Math.min((results.p99ResponseTime / 1000) * 100, 100)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Request Breakdown</CardTitle>
          <CardDescription>Detailed analysis of request outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="text-lg font-semibold">{results.successfulRequests.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-lg font-semibold">{results.failedRequests.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-lg font-semibold">{results.totalRequests.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

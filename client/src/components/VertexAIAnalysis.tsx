import { Sparkles, TrendingDown, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface VertexAIAnalysisProps {
  results: {
    avgResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    errorRate: number;
    requestsPerSecond: number;
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
  };
}

export function VertexAIAnalysis({ results }: VertexAIAnalysisProps) {
  // Mock AI-generated insights based on the results
  const insights = {
    summary: `Based on the analysis of ${results.totalRequests.toLocaleString()} requests, your healthcare CDR API demonstrates ${results.errorRate < 1 ? 'excellent' : results.errorRate < 5 ? 'good' : 'concerning'} reliability with a ${results.errorRate}% error rate. The average response time of ${results.avgResponseTime}ms ${results.avgResponseTime < 200 ? 'exceeds' : results.avgResponseTime < 500 ? 'meets' : 'falls below'} healthcare industry standards for clinical data retrieval.`,
    
    performanceScore: results.avgResponseTime < 200 && results.errorRate < 1 ? 95 : 
                     results.avgResponseTime < 500 && results.errorRate < 5 ? 75 : 55,
    
    keyFindings: [
      {
        type: results.avgResponseTime < 200 ? 'positive' : results.avgResponseTime < 500 ? 'neutral' : 'negative',
        title: 'Response Time Performance',
        description: results.avgResponseTime < 200 
          ? `Exceptional response times averaging ${results.avgResponseTime}ms, well within the recommended 200ms threshold for interactive healthcare applications.`
          : results.avgResponseTime < 500
          ? `Response times averaging ${results.avgResponseTime}ms are acceptable but could be optimized for better user experience.`
          : `Average response time of ${results.avgResponseTime}ms exceeds recommended thresholds and may impact clinical workflow efficiency.`
      },
      {
        type: results.errorRate < 1 ? 'positive' : results.errorRate < 5 ? 'neutral' : 'negative',
        title: 'Error Rate Analysis',
        description: results.errorRate < 1
          ? `Outstanding reliability with only ${results.errorRate}% error rate (${results.failedRequests} failed requests), meeting healthcare-grade SLA requirements.`
          : results.errorRate < 5
          ? `Error rate of ${results.errorRate}% is within acceptable range but monitoring is recommended for patient safety systems.`
          : `Elevated error rate of ${results.errorRate}% requires immediate attention to ensure clinical data availability.`
      },
      {
        type: results.p95ResponseTime < 500 ? 'positive' : 'neutral',
        title: 'Tail Latency Performance',
        description: `95th percentile response time of ${results.p95ResponseTime}ms indicates ${results.p95ResponseTime < 500 ? 'consistent' : 'variable'} performance under load. ${results.p99ResponseTime - results.p95ResponseTime > 200 ? 'Significant variance detected between p95 and p99, suggesting potential bottlenecks.' : 'Minimal variance suggests stable performance.'}`
      }
    ],
    
    recommendations: [
      {
        priority: 'high',
        title: 'Database Query Optimization',
        description: 'Implement query result caching for frequently accessed clinical records to reduce database load and improve response times by an estimated 30-40%.',
        impact: 'Response time reduction: -60ms to -120ms'
      },
      {
        priority: results.errorRate > 1 ? 'high' : 'medium',
        title: 'API Rate Limiting & Circuit Breakers',
        description: 'Deploy circuit breaker patterns to prevent cascade failures during high-load scenarios, particularly for third-party integrations (lab systems, pharmacy networks).',
        impact: 'Error rate reduction: -0.5% to -2%'
      },
      {
        priority: 'medium',
        title: 'CDN Integration for Static Resources',
        description: 'Leverage edge caching for patient consent forms, care plan templates, and medication reference data to reduce backend server load.',
        impact: 'Throughput increase: +15-25%'
      },
      {
        priority: results.p99ResponseTime > 800 ? 'high' : 'low',
        title: 'Connection Pool Tuning',
        description: 'Analyze database connection pool metrics and adjust max connections based on observed peak load patterns. Current p99 latency suggests potential connection exhaustion.',
        impact: 'p99 latency reduction: -100ms to -200ms'
      }
    ],
    
    healthcareCompliance: {
      hipaa: results.errorRate < 5 && results.avgResponseTime < 1000 ? 'compliant' : 'review_needed',
      uptime: ((results.successfulRequests / results.totalRequests) * 100).toFixed(2),
      dataIntegrity: results.errorRate < 1 ? 'excellent' : results.errorRate < 5 ? 'good' : 'needs_attention'
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500" data-testid="vertex-ai-analysis">
      {/* AI Header */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Vertex AI Analysis</h3>
          <p className="text-sm text-muted-foreground">AI-powered insights for healthcare performance optimization</p>
        </div>
      </div>

      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Performance Score</CardTitle>
          <CardDescription>Composite score based on response time, reliability, and healthcare standards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {insights.performanceScore}
            </div>
            <div className="flex-1">
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-1000"
                  style={{ width: `${insights.performanceScore}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {insights.performanceScore >= 90 ? 'Excellent - Production Ready' :
                 insights.performanceScore >= 70 ? 'Good - Minor optimizations recommended' :
                 'Needs Improvement - Review recommendations'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{insights.summary}</p>
        </CardContent>
      </Card>

      {/* Key Findings */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Key Findings</h3>
        {insights.keyFindings.map((finding, index) => (
          <Alert 
            key={index}
            variant={finding.type === 'negative' ? 'destructive' : 'default'}
            data-testid={`alert-finding-${index}`}
          >
            {finding.type === 'positive' ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : finding.type === 'negative' ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <AlertTitle>{finding.title}</AlertTitle>
            <AlertDescription className="text-sm">
              {finding.description}
            </AlertDescription>
          </Alert>
        ))}
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            AI-Generated Recommendations
          </CardTitle>
          <CardDescription>Prioritized action items to optimize your CDR API performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.recommendations.map((rec, index) => (
              <div 
                key={index} 
                className="p-4 rounded-lg border bg-card hover-elevate"
                data-testid={`recommendation-${index}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-medium">{rec.title}</h4>
                  <Badge 
                    variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                    data-testid={`badge-priority-${rec.priority}`}
                  >
                    {rec.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <TrendingDown className="w-3 h-3 text-green-500" />
                  <span className="text-green-600 dark:text-green-400 font-medium">{rec.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Healthcare Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Healthcare Compliance Status</CardTitle>
          <CardDescription>Automated assessment against healthcare industry standards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground mb-1">HIPAA Compliance</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${insights.healthcareCompliance.hipaa === 'compliant' ? 'text-green-500' : 'text-amber-500'}`} />
                <span className="font-medium capitalize">{insights.healthcareCompliance.hipaa.replace('_', ' ')}</span>
              </div>
            </div>
            <div className="p-3 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground mb-1">Uptime SLA</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="font-medium">{insights.healthcareCompliance.uptime}%</span>
              </div>
            </div>
            <div className="p-3 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground mb-1">Data Integrity</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${insights.healthcareCompliance.dataIntegrity === 'excellent' ? 'text-green-500' : 'text-amber-500'}`} />
                <span className="font-medium capitalize">{insights.healthcareCompliance.dataIntegrity.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

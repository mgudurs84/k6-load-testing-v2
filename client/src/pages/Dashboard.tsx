import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Layers, TrendingUp, Trophy } from 'lucide-react';
import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { StepIndicator, Step } from '@/components/StepIndicator';
import { ApplicationCard } from '@/components/ApplicationCard';
import { ApiEndpointList } from '@/components/ApiEndpointList';
import { TestConfiguration } from '@/components/TestConfiguration';
import { TestReview } from '@/components/TestReview';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SaveTestDialog } from '@/components/SaveTestDialog';
import { K6ResultsDashboard } from '@/components/K6ResultsDashboard';
import { VertexAIAnalysis } from '@/components/VertexAIAnalysis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { healthcareApps, apiEndpointsByApp } from '@shared/mock-data';

type WizardStep = 'dashboard' | 'application' | 'apis' | 'configure' | 'review' | 'results';

export default function Dashboard() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<WizardStep>('dashboard');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedApiIds, setSelectedApiIds] = useState<string[]>([]);
  const [testConfig, setTestConfig] = useState({
    virtualUsers: 100,
    rampUpTime: 5,
    duration: 10,
    thinkTime: 3,
    responseTimeThreshold: undefined as number | undefined,
    errorRateThreshold: undefined as number | undefined,
  });
  const [apps, setApps] = useState(healthcareApps);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const selectedApp = apps.find((app) => app.id === selectedAppId);
  const availableApis = selectedAppId ? apiEndpointsByApp[selectedAppId] || [] : [];
  const selectedApis = availableApis.filter((api) => selectedApiIds.includes(api.id));

  const filteredApps = apps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'favorites' && app.isFavorite) ||
      (activeTab === 'recent' && app.isFavorite);
    return matchesSearch && matchesTab;
  });

  const steps: Step[] = [
    {
      number: 1,
      label: 'Application',
      status:
        currentStep === 'application'
          ? 'active'
          : currentStep === 'apis' || currentStep === 'configure' || currentStep === 'review' || currentStep === 'results'
            ? 'completed'
            : 'pending',
    },
    {
      number: 2,
      label: 'APIs',
      status:
        currentStep === 'apis'
          ? 'active'
          : currentStep === 'configure' || currentStep === 'review' || currentStep === 'results'
            ? 'completed'
            : 'pending',
    },
    {
      number: 3,
      label: 'Configure',
      status: 
        currentStep === 'configure' 
          ? 'active' 
          : currentStep === 'review' || currentStep === 'results'
            ? 'completed' 
            : 'pending',
    },
    {
      number: 4,
      label: 'Review',
      status: 
        currentStep === 'review' 
          ? 'active' 
          : currentStep === 'results'
            ? 'completed'
            : 'pending',
    },
    {
      number: 5,
      label: 'Results',
      status: currentStep === 'results' ? 'active' : 'pending',
    },
  ];

  const breadcrumbItems =
    currentStep === 'dashboard'
      ? ['Dashboard']
      : currentStep === 'application'
        ? ['Dashboard', 'Select Application']
        : currentStep === 'apis'
          ? ['Dashboard', selectedApp?.name || 'Application', 'API Selection']
          : currentStep === 'configure'
            ? ['Dashboard', selectedApp?.name || 'Application', 'Configure Test']
            : currentStep === 'review'
              ? ['Dashboard', selectedApp?.name || 'Application', 'Review']
              : ['Dashboard', selectedApp?.name || 'Application', 'Test Results'];

  const toggleFavorite = (appId: string) => {
    setApps((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, isFavorite: !app.isFavorite } : app))
    );
    toast({
      title: apps.find((a) => a.id === appId)?.isFavorite ? 'Removed from favorites' : 'Added to favorites',
    });
  };

  const handleSelectApp = (appId: string) => {
    setSelectedAppId(appId);
    setSelectedApiIds([]);
    setCurrentStep('apis');
  };

  const handleToggleApi = (apiId: string) => {
    setSelectedApiIds((prev) =>
      prev.includes(apiId) ? prev.filter((id) => id !== apiId) : [...prev, apiId]
    );
  };

  const handleContinueToConfig = () => {
    if (selectedApiIds.length === 0) {
      toast({
        title: 'No APIs selected',
        description: 'Please select at least one API endpoint',
        variant: 'destructive',
      });
      return;
    }
    setCurrentStep('configure');
  };

  const handleTriggerTest = () => {
    setShowSaveDialog(true);
  };

  const handleSaveAndTrigger = (name: string) => {
    if (!selectedAppId) return;

    // Close the dialog immediately
    setShowSaveDialog(false);

    toast({
      title: 'Load test triggered!',
      description: `Testing ${selectedApiIds.length} APIs with ${testConfig.virtualUsers} virtual users`,
    });

    // Simulate test execution and generate mock results
    setTimeout(() => {
      const mockResults = {
        avgResponseTime: Math.floor(Math.random() * 300) + 150,
        p95ResponseTime: Math.floor(Math.random() * 200) + 300,
        p99ResponseTime: Math.floor(Math.random() * 200) + 450,
        errorRate: Math.random() * 2,
        requestsPerSecond: Math.floor(Math.random() * 30) + 40,
        totalRequests: testConfig.virtualUsers * testConfig.duration * 50,
        successfulRequests: 0,
        failedRequests: 0,
      };
      mockResults.successfulRequests = Math.floor(
        mockResults.totalRequests * (1 - mockResults.errorRate / 100)
      );
      mockResults.failedRequests = mockResults.totalRequests - mockResults.successfulRequests;

      setTestResults(mockResults);
      setShowAIAnalysis(false);
      setCurrentStep('results');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto max-w-7xl px-6 py-8">
        {currentStep === 'dashboard' && (
          <div className="space-y-12">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-chart-2/10 to-chart-3/10 p-12 text-center">
              <h1 className="mb-3 text-5xl font-bold" data-testid="text-hero-title">
                CDR Pulse - Intelligent Performance Testing
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground" data-testid="text-hero-subtitle">
                Test your CDR applications with enterprise-grade performance testing
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <StatsCard title="Total Applications" value="24" icon={Layers} iconColor="bg-app-blue/10" />
              <StatsCard title="Tests Completed" value="1,247" icon={TrendingUp} iconColor="bg-app-green/10" />
              <StatsCard title="Success Rate" value="98.5%" icon={Trophy} iconColor="bg-app-yellow/10" />
            </div>

            <div>
              <Button
                size="lg"
                className="gap-2"
                onClick={() => setCurrentStep('application')}
                data-testid="button-start-wizard"
              >
                Start New Load Test
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {currentStep !== 'dashboard' && (
          <div className="space-y-8">
            <Breadcrumb items={breadcrumbItems} />

            <StepIndicator steps={steps} />

            {currentStep === 'application' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="mb-2 text-3xl font-bold" data-testid="text-select-app-title">Select Your Application</h2>
                  <p className="text-muted-foreground">Choose the CDR application you want to test</p>
                </div>

                <div className="flex items-center gap-4">
                  <Input
                    type="search"
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                    data-testid="input-search-apps"
                  />
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
                      <TabsTrigger value="recent" data-testid="tab-recent">Recently Used</TabsTrigger>
                      <TabsTrigger value="favorites" data-testid="tab-favorites">Favorites</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredApps.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      {...app}
                      onToggleFavorite={() => toggleFavorite(app.id)}
                      onSelect={() => handleSelectApp(app.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {currentStep === 'apis' && selectedApp && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="mb-2 text-3xl font-bold" data-testid="text-select-apis-title">{selectedApp.name}</h2>
                    <p className="text-muted-foreground">Select APIs to include in your load test</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total APIs</p>
                    <p className="text-2xl font-semibold">{selectedApp.apiCount}</p>
                  </div>
                </div>

                <ApiEndpointList
                  endpoints={availableApis}
                  selectedIds={selectedApiIds}
                  onToggle={handleToggleApi}
                  onSelectAll={() => setSelectedApiIds(availableApis.map((api) => api.id))}
                  onClearAll={() => setSelectedApiIds([])}
                />

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('application')}
                    data-testid="button-back-to-apps"
                  >
                    Back to Applications
                  </Button>
                  <Button
                    onClick={handleContinueToConfig}
                    className="gap-2"
                    disabled={selectedApiIds.length === 0}
                    data-testid="button-continue-config"
                  >
                    Continue to Configuration
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 'configure' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="mb-2 text-3xl font-bold" data-testid="text-config-title">Configure Load Test Parameters</h2>
                  <p className="text-muted-foreground">Set up your performance testing parameters for optimal results</p>
                </div>

                <TestConfiguration config={testConfig} onChange={setTestConfig} />

                <div className="rounded-lg border p-6">
                  <h3 className="mb-4 font-semibold">Test Configuration Summary</h3>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-semibold text-primary">{testConfig.virtualUsers}</p>
                      <p className="mt-1 text-sm text-muted-foreground">Virtual Users</p>
                    </div>
                    <div>
                      <p className="text-3xl font-semibold text-chart-4">{testConfig.rampUpTime}m</p>
                      <p className="mt-1 text-sm text-muted-foreground">Ramp-up Time</p>
                    </div>
                    <div>
                      <p className="text-3xl font-semibold text-app-orange">{testConfig.duration}m</p>
                      <p className="mt-1 text-sm text-muted-foreground">Test Duration</p>
                    </div>
                    <div>
                      <p className="text-3xl font-semibold text-app-pink">{selectedApiIds.length}</p>
                      <p className="mt-1 text-sm text-muted-foreground">APIs Selected</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep('apis')} data-testid="button-back-to-apis">
                    Back to API Selection
                  </Button>
                  <Button onClick={() => setCurrentStep('review')} className="gap-2" data-testid="button-review">
                    Review Configuration
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 'review' && selectedApp && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="mb-2 text-3xl font-bold" data-testid="text-review-title">Review Your Load Test Configuration</h2>
                  <p className="text-muted-foreground">Verify all settings before triggering the test</p>
                </div>

                <TestReview
                  application={selectedApp}
                  selectedApis={selectedApis}
                  config={testConfig}
                  onTrigger={handleTriggerTest}
                  onBack={() => setCurrentStep('configure')}
                />
              </div>
            )}

            {currentStep === 'results' && testResults && (
              <div className="space-y-8">
                {!showAIAnalysis ? (
                  <K6ResultsDashboard 
                    results={testResults}
                    onAnalyzeWithAI={() => setShowAIAnalysis(true)}
                  />
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAIAnalysis(false)}
                        data-testid="button-back-to-results"
                      >
                        ← Back to K6 Results
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setCurrentStep('dashboard');
                          setSelectedAppId(null);
                          setSelectedApiIds([]);
                          setTestResults(null);
                          setShowAIAnalysis(false);
                          setTestConfig({
                            virtualUsers: 100,
                            rampUpTime: 5,
                            duration: 10,
                            thinkTime: 3,
                            responseTimeThreshold: undefined,
                            errorRateThreshold: undefined,
                          });
                        }}
                        data-testid="button-new-test"
                      >
                        Start New Test
                      </Button>
                    </div>
                    <VertexAIAnalysis results={testResults} />
                  </>
                )}
                
                {!showAIAnalysis && (
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentStep('dashboard');
                        setSelectedAppId(null);
                        setSelectedApiIds([]);
                        setTestResults(null);
                        setShowAIAnalysis(false);
                        setTestConfig({
                          virtualUsers: 100,
                          rampUpTime: 5,
                          duration: 10,
                          thinkTime: 3,
                          responseTimeThreshold: undefined,
                          errorRateThreshold: undefined,
                        });
                      }}
                      data-testid="button-back-dashboard"
                    >
                      Back to Dashboard
                    </Button>
                    <Button
                      onClick={() => setCurrentStep('review')}
                      data-testid="button-run-again"
                    >
                      Run Test Again
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <SaveTestDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={handleSaveAndTrigger}
        defaultName={selectedApp ? `${selectedApp.name} Test` : ''}
      />
    </div>
  );
}

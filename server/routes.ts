import type { Express } from "express";
import { createServer, type Server } from "http";

// Mock data for test configurations and runs
const mockTestConfigurations = [
  {
    id: "config-1",
    name: "CDR Clinical API Baseline Test",
    applicationId: "cdr-clinical",
    selectedApiIds: ["ep-1", "ep-2", "ep-3"],
    virtualUsers: 100,
    rampUpTime: 5,
    duration: 10,
    thinkTime: 3,
    responseTimeThreshold: 500,
    errorRateThreshold: 1,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "config-2",
    name: "Member Portal API Load Test",
    applicationId: "member-portal",
    selectedApiIds: ["ep-1", "ep-2"],
    virtualUsers: 200,
    rampUpTime: 10,
    duration: 15,
    thinkTime: 2,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockTestRuns = [
  {
    id: "run-1",
    testConfigurationId: "config-1",
    status: "completed",
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    results: {
      avgResponseTime: 180,
      p95ResponseTime: 350,
      p99ResponseTime: 480,
      errorRate: 0.5,
      requestsPerSecond: 50,
      totalRequests: 30000,
      successfulRequests: 29850,
      failedRequests: 150,
    },
  },
  {
    id: "run-2",
    testConfigurationId: "config-1",
    status: "completed",
    startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    results: {
      avgResponseTime: 210,
      p95ResponseTime: 390,
      p99ResponseTime: 520,
      errorRate: 0.8,
      requestsPerSecond: 45,
      totalRequests: 27000,
      successfulRequests: 26784,
      failedRequests: 216,
    },
  },
  {
    id: "run-3",
    testConfigurationId: "config-2",
    status: "running",
    startedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    completedAt: null,
    results: null,
  },
];

export async function registerRoutes(app: Express): Promise<Server> {
  // Test Configurations CRUD - Mock implementation
  app.get("/api/test-configurations", async (req, res) => {
    res.json(mockTestConfigurations);
  });

  app.get("/api/test-configurations/:id", async (req, res) => {
    const configuration = mockTestConfigurations.find((c) => c.id === req.params.id);
    if (!configuration) {
      return res.status(404).json({ error: "Test configuration not found" });
    }
    res.json(configuration);
  });

  app.post("/api/test-configurations", async (req, res) => {
    const newConfig = {
      id: `config-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTestConfigurations.push(newConfig);
    res.status(201).json(newConfig);
  });

  app.put("/api/test-configurations/:id", async (req, res) => {
    const index = mockTestConfigurations.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Test configuration not found" });
    }
    mockTestConfigurations[index] = {
      ...mockTestConfigurations[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    res.json(mockTestConfigurations[index]);
  });

  app.delete("/api/test-configurations/:id", async (req, res) => {
    const index = mockTestConfigurations.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Test configuration not found" });
    }
    mockTestConfigurations.splice(index, 1);
    res.status(204).send();
  });

  // Test Runs CRUD - Mock implementation
  app.get("/api/test-runs", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const runs = limit ? mockTestRuns.slice(0, limit) : mockTestRuns;
    res.json(runs);
  });

  app.get("/api/test-runs/:id", async (req, res) => {
    const run = mockTestRuns.find((r) => r.id === req.params.id);
    if (!run) {
      return res.status(404).json({ error: "Test run not found" });
    }
    res.json(run);
  });

  app.get("/api/test-configurations/:configId/runs", async (req, res) => {
    const runs = mockTestRuns.filter((r) => r.testConfigurationId === req.params.configId);
    res.json(runs);
  });

  app.post("/api/test-runs", async (req, res) => {
    const newRun = {
      id: `run-${Date.now()}`,
      ...req.body,
      startedAt: new Date().toISOString(),
    };
    mockTestRuns.push(newRun);
    res.status(201).json(newRun);
  });

  app.patch("/api/test-runs/:id", async (req, res) => {
    const index = mockTestRuns.findIndex((r) => r.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Test run not found" });
    }
    mockTestRuns[index] = {
      ...mockTestRuns[index],
      ...req.body,
    };
    res.json(mockTestRuns[index]);
  });

  const httpServer = createServer(app);

  return httpServer;
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTestConfigurationSchema, insertTestRunSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test Configurations CRUD
  app.get("/api/test-configurations", async (req, res) => {
    try {
      const configurations = await storage.getAllTestConfigurations();
      res.json(configurations);
    } catch (error) {
      console.error("Error fetching test configurations:", error);
      res.status(500).json({ error: "Failed to fetch test configurations" });
    }
  });

  app.get("/api/test-configurations/:id", async (req, res) => {
    try {
      const configuration = await storage.getTestConfiguration(req.params.id);
      if (!configuration) {
        return res.status(404).json({ error: "Test configuration not found" });
      }
      res.json(configuration);
    } catch (error) {
      console.error("Error fetching test configuration:", error);
      res.status(500).json({ error: "Failed to fetch test configuration" });
    }
  });

  app.post("/api/test-configurations", async (req, res) => {
    try {
      const validatedData = insertTestConfigurationSchema.parse(req.body);
      const configuration = await storage.createTestConfiguration(validatedData);
      res.status(201).json(configuration);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      console.error("Error creating test configuration:", error);
      res.status(500).json({ error: "Failed to create test configuration" });
    }
  });

  app.put("/api/test-configurations/:id", async (req, res) => {
    try {
      const partialSchema = insertTestConfigurationSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const configuration = await storage.updateTestConfiguration(req.params.id, validatedData);
      if (!configuration) {
        return res.status(404).json({ error: "Test configuration not found" });
      }
      res.json(configuration);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      console.error("Error updating test configuration:", error);
      res.status(500).json({ error: "Failed to update test configuration" });
    }
  });

  app.delete("/api/test-configurations/:id", async (req, res) => {
    try {
      await storage.deleteTestConfiguration(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting test configuration:", error);
      res.status(500).json({ error: "Failed to delete test configuration" });
    }
  });

  // Test Runs CRUD
  app.get("/api/test-runs", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const runs = await storage.getAllTestRuns(limit);
      res.json(runs);
    } catch (error) {
      console.error("Error fetching test runs:", error);
      res.status(500).json({ error: "Failed to fetch test runs" });
    }
  });

  app.get("/api/test-runs/:id", async (req, res) => {
    try {
      const run = await storage.getTestRun(req.params.id);
      if (!run) {
        return res.status(404).json({ error: "Test run not found" });
      }
      res.json(run);
    } catch (error) {
      console.error("Error fetching test run:", error);
      res.status(500).json({ error: "Failed to fetch test run" });
    }
  });

  app.get("/api/test-configurations/:configId/runs", async (req, res) => {
    try {
      const runs = await storage.getTestRunsByConfigId(req.params.configId);
      res.json(runs);
    } catch (error) {
      console.error("Error fetching test runs for configuration:", error);
      res.status(500).json({ error: "Failed to fetch test runs" });
    }
  });

  app.post("/api/test-runs", async (req, res) => {
    try {
      const validatedData = insertTestRunSchema.parse(req.body);
      const run = await storage.createTestRun(validatedData);
      res.status(201).json(run);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      console.error("Error creating test run:", error);
      res.status(500).json({ error: "Failed to create test run" });
    }
  });

  app.patch("/api/test-runs/:id", async (req, res) => {
    try {
      const partialSchema = insertTestRunSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const run = await storage.updateTestRun(req.params.id, validatedData);
      if (!run) {
        return res.status(404).json({ error: "Test run not found" });
      }
      res.json(run);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      console.error("Error updating test run:", error);
      res.status(500).json({ error: "Failed to update test run" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

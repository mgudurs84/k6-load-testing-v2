import {
  type User,
  type InsertUser,
  type TestConfiguration,
  type InsertTestConfiguration,
  type TestRun,
  type InsertTestRun,
  users,
  testConfigurations,
  testRuns,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, inArray } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createTestConfiguration(config: InsertTestConfiguration): Promise<TestConfiguration>;
  getTestConfiguration(id: string): Promise<TestConfiguration | undefined>;
  getAllTestConfigurations(): Promise<TestConfiguration[]>;
  updateTestConfiguration(id: string, config: Partial<InsertTestConfiguration>): Promise<TestConfiguration | undefined>;
  deleteTestConfiguration(id: string): Promise<void>;

  createTestRun(run: InsertTestRun): Promise<TestRun>;
  getTestRun(id: string): Promise<TestRun | undefined>;
  getTestRunsByConfigId(configId: string): Promise<TestRun[]>;
  getAllTestRuns(limit?: number): Promise<TestRun[]>;
  updateTestRun(id: string, updates: Partial<InsertTestRun>): Promise<TestRun | undefined>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createTestConfiguration(config: InsertTestConfiguration): Promise<TestConfiguration> {
    const result = await db.insert(testConfigurations).values(config).returning();
    return result[0];
  }

  async getTestConfiguration(id: string): Promise<TestConfiguration | undefined> {
    const result = await db.select().from(testConfigurations).where(eq(testConfigurations.id, id)).limit(1);
    return result[0];
  }

  async getAllTestConfigurations(): Promise<TestConfiguration[]> {
    return db.select().from(testConfigurations).orderBy(desc(testConfigurations.createdAt));
  }

  async updateTestConfiguration(id: string, config: Partial<InsertTestConfiguration>): Promise<TestConfiguration | undefined> {
    const result = await db
      .update(testConfigurations)
      .set({ ...config, updatedAt: new Date() })
      .where(eq(testConfigurations.id, id))
      .returning();
    return result[0];
  }

  async deleteTestConfiguration(id: string): Promise<void> {
    await db.delete(testConfigurations).where(eq(testConfigurations.id, id));
  }

  async createTestRun(run: InsertTestRun): Promise<TestRun> {
    const result = await db.insert(testRuns).values(run).returning();
    return result[0];
  }

  async getTestRun(id: string): Promise<TestRun | undefined> {
    const result = await db.select().from(testRuns).where(eq(testRuns.id, id)).limit(1);
    return result[0];
  }

  async getTestRunsByConfigId(configId: string): Promise<TestRun[]> {
    return db.select().from(testRuns).where(eq(testRuns.testConfigurationId, configId)).orderBy(desc(testRuns.startedAt));
  }

  async getAllTestRuns(limit: number = 50): Promise<TestRun[]> {
    return db.select().from(testRuns).orderBy(desc(testRuns.startedAt)).limit(limit);
  }

  async updateTestRun(id: string, updates: Partial<InsertTestRun>): Promise<TestRun | undefined> {
    const result = await db.update(testRuns).set(updates).where(eq(testRuns.id, id)).returning();
    return result[0];
  }
}

export const storage = new DbStorage();

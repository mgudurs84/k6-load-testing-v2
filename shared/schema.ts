import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const testConfigurations = pgTable("test_configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  applicationId: text("application_id").notNull(),
  selectedApiIds: text("selected_api_ids").array().notNull(),
  virtualUsers: integer("virtual_users").notNull(),
  rampUpTime: integer("ramp_up_time").notNull(),
  duration: integer("duration").notNull(),
  thinkTime: integer("think_time").notNull(),
  responseTimeThreshold: integer("response_time_threshold"),
  errorRateThreshold: integer("error_rate_threshold"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTestConfigurationSchema = createInsertSchema(testConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTestConfiguration = z.infer<typeof insertTestConfigurationSchema>;
export type TestConfiguration = typeof testConfigurations.$inferSelect;

export const testRuns = pgTable("test_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  testConfigurationId: varchar("test_configuration_id").notNull().references(() => testConfigurations.id, { onDelete: 'cascade' }),
  status: text("status").notNull().$type<'pending' | 'running' | 'completed' | 'failed'>(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  results: jsonb("results"),
});

export const insertTestRunSchema = createInsertSchema(testRuns).omit({
  id: true,
  startedAt: true,
});

export type InsertTestRun = z.infer<typeof insertTestRunSchema>;
export type TestRun = typeof testRuns.$inferSelect;

import { db } from './db';
import { testConfigurations, testRuns } from '@shared/schema';

async function seed() {
  if (!db) {
    console.log('Database not available, skipping seed');
    return;
  }

  console.log('Seeding database...');

  const existingConfigs = await db.select().from(testConfigurations).limit(1);
  
  if (existingConfigs.length > 0) {
    console.log('Database already seeded, skipping');
    return;
  }

  const config1 = await db.insert(testConfigurations).values({
    name: 'CDR Clinical API Baseline Test',
    applicationId: 'cdr-clinical',
    selectedApiIds: ['ep-1', 'ep-2', 'ep-3'],
    virtualUsers: 100,
    rampUpTime: 5,
    duration: 10,
    thinkTime: 3,
    responseTimeThreshold: 500,
    errorRateThreshold: 1,
  }).returning();

  const config2 = await db.insert(testConfigurations).values({
    name: 'Member Portal API Load Test',
    applicationId: 'member-portal',
    selectedApiIds: ['ep-1', 'ep-2'],
    virtualUsers: 200,
    rampUpTime: 10,
    duration: 15,
    thinkTime: 2,
  }).returning();

  await db.insert(testRuns).values([
    {
      testConfigurationId: config1[0].id,
      status: 'completed',
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), 
      results: {
        avgResponseTime: 180,
        p95ResponseTime: 350,
        p99ResponseTime: 480,
        errorRate: 0.5,
        requestsPerSecond: 50,
      },
    },
    {
      testConfigurationId: config1[0].id,
      status: 'completed',
      completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      results: {
        avgResponseTime: 210,
        p95ResponseTime: 390,
        p99ResponseTime: 520,
        errorRate: 0.8,
        requestsPerSecond: 45,
      },
    },
    {
      testConfigurationId: config2[0].id,
      status: 'running',
      completedAt: null,
      results: null,
    },
  ]);

  console.log('Database seeded successfully');
}

seed().catch(console.error);

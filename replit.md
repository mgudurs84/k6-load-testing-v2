# CDR Pulse

## Overview

This is CDR Pulse, an intelligent performance testing dashboard application designed for healthcare CDR (Clinical Data Repository) applications. It provides a web-based interface for configuring, executing, and monitoring load tests on healthcare APIs. The application follows a wizard-based workflow that guides users through selecting applications, choosing API endpoints, configuring test parameters, and reviewing test results.

The system enables healthcare organizations to ensure their clinical data exchange platforms can handle production-level traffic while maintaining performance standards required for patient care systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**Rationale**: Vite provides fast hot module replacement during development and optimized production builds. React's component-based architecture supports the complex wizard flow and dashboard interfaces required for test configuration.

**UI Component System**: Radix UI primitives with shadcn/ui design system and Tailwind CSS for styling.

**Rationale**: Radix UI provides accessible, unstyled primitives that can be customized to match healthcare application design standards. The shadcn/ui layer adds a consistent design language inspired by modern dashboards (Linear, Vercel, Stripe) while maintaining accessibility standards critical for healthcare applications.

**State Management**: React hooks for local state, TanStack Query (React Query) for server state management.

**Rationale**: TanStack Query handles API data fetching, caching, and synchronization automatically, reducing boilerplate code. Local state with hooks manages wizard progression and form state.

**Routing**: Wouter for lightweight client-side routing.

**Rationale**: Wouter provides a minimal routing solution suitable for the application's simple navigation structure (Dashboard and Test History pages).

**Design System**: Custom design tokens following the "New York" style variant with neutral color scheme, supporting both light and dark modes.

**Rationale**: Healthcare applications require professional, trustworthy interfaces. The design guidelines reference Linear and Stripe's clean aesthetics while incorporating healthcare-appropriate trust signals.

### Backend Architecture

**Runtime**: Node.js with Express.js framework.

**Rationale**: Express provides a minimal, flexible HTTP server that integrates well with the monorepo structure where frontend and backend share TypeScript types.

**Development vs Production**: Separate entry points (index-dev.ts uses Vite middleware, index-prod.ts serves static files).

**Rationale**: Development mode integrates Vite's HMR for fast iteration. Production mode serves pre-built static assets for optimal performance.

**API Structure**: RESTful endpoints following resource-based routing patterns:
- `/api/test-configurations` - CRUD operations for test configurations
- `/api/test-runs` - Managing and retrieving test execution results

**Rationale**: RESTful design provides intuitive, predictable endpoints that align with standard HTTP semantics, making the API easy to understand and consume.

**Validation**: Zod schemas shared between frontend and backend for type-safe validation.

**Rationale**: Sharing schemas ensures consistency between client and server validation logic, preventing runtime type mismatches.

### Data Storage

**Database**: PostgreSQL accessed via Neon serverless driver.

**Rationale**: PostgreSQL provides ACID compliance and rich data types (JSONB for test results) required for healthcare data integrity. Neon's serverless approach simplifies deployment and scaling.

**ORM**: Drizzle ORM with schema-first design.

**Rationale**: Drizzle provides type-safe database access with minimal runtime overhead. The schema-first approach generates TypeScript types automatically, ensuring type safety throughout the application.

**Schema Design**:
- `users` - Authentication and user management
- `test_configurations` - Stores reusable test setups (application, APIs, parameters)
- `test_runs` - Records test execution history and results with JSONB for flexible metrics storage

**Rationale**: Separating configurations from runs allows users to save and reuse test setups while maintaining a complete audit trail of all test executions.

**Migrations**: Drizzle Kit manages schema migrations with SQL generation.

**Rationale**: SQL migrations provide explicit control over schema changes with the ability to review before applying, critical for production healthcare systems.

### External Dependencies

**Neon PostgreSQL**: Serverless PostgreSQL database platform.

**Integration**: Connection via `@neondatabase/serverless` driver using `DATABASE_URL` environment variable.

**TanStack Query**: Server state management library.

**Integration**: Configured with custom query client that handles authentication and error states.

**Radix UI**: Accessible component primitives (20+ components including dialogs, dropdowns, tooltips, etc.).

**Integration**: Wrapped with shadcn/ui styling layer and consumed throughout the component tree.

**Tailwind CSS**: Utility-first CSS framework.

**Integration**: Custom configuration extends base theme with healthcare-appropriate color palette, spacing scales, and design tokens.

**Wouter**: Lightweight routing library.

**Integration**: Provides navigation between Dashboard and Test History views without requiring full React Router overhead.

**Lucide React**: Icon library.

**Integration**: Icons imported as React components and used throughout UI for visual indicators and actions.

**date-fns**: Date formatting and manipulation.

**Integration**: Used in Test History page to format timestamps for test run displays.

**Mock Data**: Healthcare applications and API endpoints defined in `shared/mock-data.ts`.

**Rationale**: Most applications use static mock data for demonstration. However, the CAEL application features real GitHub Actions integration (see CAEL Integration section below).

## CAEL GitHub Actions Integration

### Overview

The CAEL (Clinical Analytics Exchange Layer) application is the only application with real GitHub Actions integration, while all other applications use mock data. This hybrid approach allows demonstration of the full workflow with real performance testing for CAEL.

### Architecture Decision

**Separate Flow**: CAEL bypasses the standard wizard (Application → APIs → Payloads → Configure → Review → Results) and instead uses a dedicated flow:

1. User selects CAEL application (flagged with `isRealIntegration: true`)
2. GitHub token modal appears for authentication
3. Workflow is triggered on GitHub Actions with hardcoded parameters
4. User views real test results from GitHub Actions artifacts

### Components

**GitHubTokenModal** (`client/src/components/GitHubTokenModal.tsx`): 
- Modal dialog for GitHub personal access token input
- Validates token format (must start with `ghp_` or `github_pat_`)
- Token is passed to backend API for workflow triggering
- Token is stored in Replit secrets for security

**CAELTestResults** (`client/src/components/CAELTestResults.tsx`):
- Displays real K6 load test results from GitHub Actions artifacts
- Shows workflow status (queued, in_progress, completed)
- Manual "Refresh Results" button to fetch latest status and artifacts
- Displays metrics from JSON artifacts: response times, error rates, throughput
- Back button returns to dashboard

**Dashboard Flow** (`client/src/pages/Dashboard.tsx`):
- Detects CAEL via `isRealIntegration` flag in `handleSelectApp`
- Shows token modal instead of wizard for CAEL
- Renders `CAELTestResults` component when workflow is triggered
- Regular wizard flow remains unchanged for all other applications

### Backend API Routes

**POST `/api/github/trigger-workflow`**:
- Accepts GitHub token from frontend
- Triggers workflow dispatch on `github-actions-tests/k6-performance-test` repository
- Hardcoded test parameters:
  - `stage2_duration`: "30s"
  - `stage2_target`: "10"
  - `parallelism`: "2"
  - `test_id`: timestamp-based unique ID
  - `test_url`: "https://cael-dev.example.com/api/v1/patients"
- Returns workflow `runId` and `runUrl` for tracking

**GET `/api/github/workflow-status/:runId`**:
- Fetches current status of GitHub Actions workflow run
- Returns `status` (queued, in_progress, completed, etc.) and `conclusion` (success, failure, etc.)

**GET `/api/github/workflow-artifacts/:runId`**:
- Lists all artifacts from completed workflow run
- Returns array of artifacts with download URLs
- Frontend fetches and parses JSON artifacts containing K6 metrics

### Security

- GitHub tokens are **never** stored in code or version control
- Tokens are passed from user input to backend API
- Backend uses token header: `Authorization: token ${githubToken}`
- Token validation happens on both frontend (format check) and backend (GitHub API)
- Replit secrets management can be used for production deployments

### Testing

The CAEL integration requires a valid GitHub personal access token with `repo` and `actions` permissions on the `github-actions-tests/k6-performance-test` repository. Without a valid token, the workflow trigger will fail gracefully with error toasts shown to the user.

### Future Enhancements

1. Automatic status polling instead of manual refresh
2. Display artifact fetch failures to user (currently only logged)
3. Support for custom test parameters instead of hardcoded values
4. Unit/integration tests for GitHub API routes

## Payload Upload Feature

### Overview

The wizard includes a "Upload Payloads" step between API selection and test configuration. This allows users to upload JSON files containing test data for each selected API endpoint. The system uses OpenAPI specifications to generate templates and validate uploaded payloads.

### Wizard Flow (6 Steps)

1. **Application** - Select the CDR application to test
2. **APIs** - Choose API endpoints to include in the load test
3. **Payloads** - Upload JSON files with test data for each API
4. **Configure** - Set virtual users, duration, ramp-up time, and thresholds
5. **Review** - Verify all settings including uploaded payloads
6. **Results** - View test execution results and AI analysis

### OpenAPI-Driven Template Generation

The system uses OpenAPI specifications to provide intelligent template generation and validation.

**Key Files:**
- `shared/openapi-types.ts` - TypeScript types for OpenAPI schemas, templates, and validation
- `shared/openapi-specs.ts` - Sample OpenAPI specs for all mock healthcare applications
- `shared/template-generator.ts` - Utilities for generating templates and validating payloads

**Features:**
- **Generate Template Button**: Downloads a JSON template based on the API's OpenAPI spec
- **Schema Details Dialog**: Shows required fields, field descriptions, and sample JSON
- **Automatic Validation**: Uploaded files are validated against the OpenAPI schema
- **Validation Feedback**: Shows valid/invalid record counts and field-level errors

**Supported Applications with OpenAPI Specs:**
- CDR Clinical API (patients, appointments, records, billing)
- Clinical Data API (encounters, observations)
- Insurance Claims API (claims, eligibility)
- Pharmacy Network API (prescriptions, dispensations)
- Member Portal API (members, messages)
- Provider Directory API (providers)

### Components

**PayloadUploadStep** (`client/src/components/PayloadUploadStep.tsx`):
- Displays file upload card for each selected API
- "Generate Template" button to download OpenAPI-based JSON template
- Schema view dialog showing required fields and descriptions
- Accepts JSON files containing array of payload objects
- Shows file name, record count, and validation status
- Validation feedback with row-level error details
- Supports preview dialog with first 5 records
- Allows removal and re-upload of payload files
- Tracks upload progress across all APIs

### Template Generation Flow

```
1. User clicks "Generate Template" for an API
          ↓
2. System looks up OpenAPI spec for that endpoint
          ↓
3. Extracts request body schema with required fields
          ↓
4. Generates JSON template with example values
          ↓
5. User downloads and fills template with real data
          ↓
6. User uploads completed JSON file
          ↓
7. System validates against OpenAPI schema
          ↓
8. Shows validation results (valid/invalid counts, errors)
```

### JSON File Format

Upload a JSON file with an array of objects. Each object represents one request payload:

```json
[
  {"patientId": "P001", "firstName": "John", "lastName": "Doe", "dateOfBirth": "1990-01-15"},
  {"patientId": "P002", "firstName": "Jane", "lastName": "Smith", "dateOfBirth": "1985-03-22"}
]
```

### Validation Rules

The system validates uploaded payloads against the OpenAPI schema:
- **Required fields**: Checks all required fields are present
- **Data types**: Validates string, integer, number, boolean, array, object types
- **Formats**: Validates date (YYYY-MM-DD), email, date-time formats
- **Enums**: Validates values match allowed enum options
- **Nested objects**: Validates nested object structures

### State Management

- Payloads are stored in React state (in-memory)
- Payloads persist when navigating between wizard steps
- Payloads are filtered when APIs are deselected (preserves relevant uploads)
- Payloads are cleared when starting a new test
- Validation results are stored with each payload

### TestReview Integration

The review step displays:
- Total files uploaded count
- Total records across all payload files
- APIs configured vs total selected
- Expandable details showing per-API payload status
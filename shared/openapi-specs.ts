import type { OpenApiSpec } from './openapi-types';

export const openApiSpecs: Record<string, OpenApiSpec> = {
  'cdr-clinical': {
    openapi: '3.0.0',
    info: {
      title: 'CDR Clinical API',
      version: '1.0.0',
      description: 'Healthcare data exchange platform for clinical information sharing',
    },
    paths: {
      '/api/v1/patients': {
        get: {
          operationId: 'getPatients',
          summary: 'Retrieve patient information',
          description: 'Retrieve patient information and basic demographics',
          parameters: [
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 100 },
              description: 'Maximum number of patients to return',
            },
            {
              name: 'offset',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 0 },
              description: 'Number of patients to skip',
            },
          ],
        },
        post: {
          operationId: 'createPatient',
          summary: 'Create new patient record',
          description: 'Create new patient records with validation',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['patientId', 'firstName', 'lastName', 'dateOfBirth'],
                  properties: {
                    patientId: {
                      type: 'string',
                      description: 'Unique patient identifier',
                      example: 'P001',
                    },
                    firstName: {
                      type: 'string',
                      description: 'Patient first name',
                      example: 'John',
                    },
                    lastName: {
                      type: 'string',
                      description: 'Patient last name',
                      example: 'Doe',
                    },
                    dateOfBirth: {
                      type: 'string',
                      format: 'date',
                      description: 'Date of birth (YYYY-MM-DD)',
                      example: '1990-01-15',
                    },
                    gender: {
                      type: 'string',
                      enum: ['male', 'female', 'other', 'unknown'],
                      description: 'Patient gender',
                      example: 'male',
                    },
                    email: {
                      type: 'string',
                      format: 'email',
                      description: 'Patient email address',
                      example: 'john.doe@email.com',
                    },
                    phone: {
                      type: 'string',
                      description: 'Patient phone number',
                      example: '+1-555-123-4567',
                    },
                    address: {
                      type: 'object',
                      properties: {
                        street: { type: 'string', example: '123 Main St' },
                        city: { type: 'string', example: 'Boston' },
                        state: { type: 'string', example: 'MA' },
                        zipCode: { type: 'string', example: '02101' },
                      },
                    },
                    insuranceId: {
                      type: 'string',
                      description: 'Insurance policy ID',
                      example: 'INS-12345',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/patients/{id}/records': {
        get: {
          operationId: 'getPatientRecords',
          summary: 'Fetch clinical history',
          description: 'Fetch complete clinical history and medical records',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Patient ID',
              example: 'P001',
            },
          ],
        },
        put: {
          operationId: 'updatePatientRecords',
          summary: 'Update clinical records',
          description: 'Update existing clinical records and notes',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Patient ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['patientId', 'recordType'],
                  properties: {
                    patientId: {
                      type: 'string',
                      description: 'Patient ID to update',
                      example: 'P001',
                    },
                    recordType: {
                      type: 'string',
                      enum: ['diagnosis', 'prescription', 'lab_result', 'procedure', 'note'],
                      description: 'Type of clinical record',
                      example: 'diagnosis',
                    },
                    recordDate: {
                      type: 'string',
                      format: 'date',
                      description: 'Date of the record',
                      example: '2024-01-15',
                    },
                    providerId: {
                      type: 'string',
                      description: 'Healthcare provider ID',
                      example: 'DR-456',
                    },
                    notes: {
                      type: 'string',
                      description: 'Clinical notes',
                      example: 'Patient presents with...',
                    },
                    icdCode: {
                      type: 'string',
                      description: 'ICD-10 diagnosis code',
                      example: 'J06.9',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/appointments': {
        get: {
          operationId: 'getAppointments',
          summary: 'List appointments',
          description: 'List upcoming and past appointments',
          parameters: [
            {
              name: 'patientId',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Filter by patient ID',
            },
            {
              name: 'startDate',
              in: 'query',
              required: false,
              schema: { type: 'string', format: 'date' },
              description: 'Start date filter',
            },
            {
              name: 'endDate',
              in: 'query',
              required: false,
              schema: { type: 'string', format: 'date' },
              description: 'End date filter',
            },
          ],
        },
        post: {
          operationId: 'createAppointment',
          summary: 'Schedule appointment',
          description: 'Schedule new patient appointments',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['patientId', 'providerId', 'appointmentDate', 'appointmentTime'],
                  properties: {
                    patientId: {
                      type: 'string',
                      description: 'Patient ID',
                      example: 'P001',
                    },
                    providerId: {
                      type: 'string',
                      description: 'Healthcare provider ID',
                      example: 'DR-456',
                    },
                    appointmentDate: {
                      type: 'string',
                      format: 'date',
                      description: 'Appointment date',
                      example: '2024-02-15',
                    },
                    appointmentTime: {
                      type: 'string',
                      description: 'Appointment time (HH:MM)',
                      example: '14:30',
                    },
                    appointmentType: {
                      type: 'string',
                      enum: ['checkup', 'follow_up', 'consultation', 'procedure', 'emergency'],
                      description: 'Type of appointment',
                      example: 'checkup',
                    },
                    duration: {
                      type: 'integer',
                      description: 'Duration in minutes',
                      example: 30,
                    },
                    notes: {
                      type: 'string',
                      description: 'Appointment notes',
                      example: 'Annual physical exam',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/billing/invoices': {
        get: {
          operationId: 'getInvoices',
          summary: 'Retrieve invoices',
          description: 'Retrieve billing information and invoices',
          parameters: [
            {
              name: 'patientId',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Filter by patient ID',
            },
            {
              name: 'status',
              in: 'query',
              required: false,
              schema: { type: 'string', enum: ['pending', 'paid', 'overdue'] },
              description: 'Filter by invoice status',
            },
          ],
        },
      },
      '/api/v1/patients/{id}': {
        delete: {
          operationId: 'deletePatient',
          summary: 'Remove patient records',
          description: 'Remove patient records (GDPR compliance)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Patient ID to delete',
            },
          ],
        },
      },
    },
  },
  'clinical-data': {
    openapi: '3.0.0',
    info: {
      title: 'Clinical Data API',
      version: '1.0.0',
      description: 'Comprehensive clinical data management system',
    },
    paths: {
      '/api/v1/encounters': {
        post: {
          operationId: 'createEncounter',
          summary: 'Create clinical encounter',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['patientId', 'encounterId', 'encounterDate', 'encounterType'],
                  properties: {
                    encounterId: {
                      type: 'string',
                      description: 'Unique encounter identifier',
                      example: 'ENC-001',
                    },
                    patientId: {
                      type: 'string',
                      description: 'Patient ID',
                      example: 'P001',
                    },
                    encounterDate: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Encounter date and time',
                      example: '2024-01-15T09:30:00Z',
                    },
                    encounterType: {
                      type: 'string',
                      enum: ['inpatient', 'outpatient', 'emergency', 'observation'],
                      description: 'Type of encounter',
                      example: 'outpatient',
                    },
                    facilityId: {
                      type: 'string',
                      description: 'Healthcare facility ID',
                      example: 'FAC-123',
                    },
                    attendingPhysician: {
                      type: 'string',
                      description: 'Attending physician ID',
                      example: 'DR-456',
                    },
                    chiefComplaint: {
                      type: 'string',
                      description: 'Chief complaint',
                      example: 'Chest pain',
                    },
                    dischargeDate: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Discharge date (if applicable)',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/observations': {
        post: {
          operationId: 'createObservation',
          summary: 'Record clinical observation',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['patientId', 'observationType', 'value', 'observationDate'],
                  properties: {
                    observationId: {
                      type: 'string',
                      description: 'Unique observation ID',
                      example: 'OBS-001',
                    },
                    patientId: {
                      type: 'string',
                      description: 'Patient ID',
                      example: 'P001',
                    },
                    encounterId: {
                      type: 'string',
                      description: 'Related encounter ID',
                      example: 'ENC-001',
                    },
                    observationType: {
                      type: 'string',
                      enum: ['vital_signs', 'lab_result', 'imaging', 'assessment'],
                      description: 'Type of observation',
                      example: 'vital_signs',
                    },
                    code: {
                      type: 'string',
                      description: 'LOINC or other standard code',
                      example: '8867-4',
                    },
                    value: {
                      type: 'string',
                      description: 'Observation value',
                      example: '72',
                    },
                    unit: {
                      type: 'string',
                      description: 'Unit of measurement',
                      example: 'bpm',
                    },
                    observationDate: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Date and time of observation',
                      example: '2024-01-15T10:00:00Z',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  'insurance-claims': {
    openapi: '3.0.0',
    info: {
      title: 'Insurance Claims API',
      version: '1.0.0',
      description: 'Claims processing and insurance verification system',
    },
    paths: {
      '/api/v1/claims': {
        post: {
          operationId: 'submitClaim',
          summary: 'Submit insurance claim',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['claimId', 'patientId', 'providerId', 'serviceDate', 'diagnosisCodes', 'totalAmount'],
                  properties: {
                    claimId: {
                      type: 'string',
                      description: 'Unique claim identifier',
                      example: 'CLM-001',
                    },
                    patientId: {
                      type: 'string',
                      description: 'Patient ID',
                      example: 'P001',
                    },
                    subscriberId: {
                      type: 'string',
                      description: 'Insurance subscriber ID',
                      example: 'SUB-12345',
                    },
                    providerId: {
                      type: 'string',
                      description: 'Healthcare provider ID',
                      example: 'PRV-456',
                    },
                    facilityId: {
                      type: 'string',
                      description: 'Facility ID',
                      example: 'FAC-789',
                    },
                    serviceDate: {
                      type: 'string',
                      format: 'date',
                      description: 'Date of service',
                      example: '2024-01-15',
                    },
                    diagnosisCodes: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'ICD-10 diagnosis codes',
                      example: ['J06.9', 'R05'],
                    },
                    procedureCodes: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'CPT procedure codes',
                      example: ['99213', '87880'],
                    },
                    totalAmount: {
                      type: 'number',
                      description: 'Total claim amount',
                      example: 250.00,
                    },
                    placeOfService: {
                      type: 'string',
                      enum: ['office', 'hospital_inpatient', 'hospital_outpatient', 'emergency', 'telehealth'],
                      description: 'Place of service code',
                      example: 'office',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/eligibility': {
        post: {
          operationId: 'checkEligibility',
          summary: 'Check insurance eligibility',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['subscriberId', 'memberId', 'serviceDate'],
                  properties: {
                    subscriberId: {
                      type: 'string',
                      description: 'Insurance subscriber ID',
                      example: 'SUB-12345',
                    },
                    memberId: {
                      type: 'string',
                      description: 'Member ID',
                      example: 'MEM-67890',
                    },
                    serviceDate: {
                      type: 'string',
                      format: 'date',
                      description: 'Date of service',
                      example: '2024-01-15',
                    },
                    serviceType: {
                      type: 'string',
                      enum: ['medical', 'dental', 'vision', 'pharmacy'],
                      description: 'Type of service',
                      example: 'medical',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  'pharmacy-network': {
    openapi: '3.0.0',
    info: {
      title: 'Pharmacy Network API',
      version: '1.0.0',
      description: 'Pharmacy network management and prescription processing',
    },
    paths: {
      '/api/v1/prescriptions': {
        post: {
          operationId: 'createPrescription',
          summary: 'Create prescription order',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['prescriptionId', 'patientId', 'prescriberId', 'medication', 'dosage'],
                  properties: {
                    prescriptionId: {
                      type: 'string',
                      description: 'Unique prescription identifier',
                      example: 'RX-001',
                    },
                    patientId: {
                      type: 'string',
                      description: 'Patient ID',
                      example: 'P001',
                    },
                    prescriberId: {
                      type: 'string',
                      description: 'Prescriber ID (physician)',
                      example: 'DR-456',
                    },
                    medication: {
                      type: 'object',
                      required: ['name', 'ndc'],
                      properties: {
                        name: {
                          type: 'string',
                          description: 'Medication name',
                          example: 'Amoxicillin',
                        },
                        ndc: {
                          type: 'string',
                          description: 'National Drug Code',
                          example: '0781-2613-01',
                        },
                        strength: {
                          type: 'string',
                          description: 'Medication strength',
                          example: '500mg',
                        },
                        form: {
                          type: 'string',
                          enum: ['tablet', 'capsule', 'liquid', 'injection', 'cream'],
                          description: 'Drug form',
                          example: 'capsule',
                        },
                      },
                    },
                    dosage: {
                      type: 'string',
                      description: 'Dosage instructions',
                      example: '1 capsule 3 times daily',
                    },
                    quantity: {
                      type: 'integer',
                      description: 'Quantity to dispense',
                      example: 30,
                    },
                    refills: {
                      type: 'integer',
                      description: 'Number of refills allowed',
                      example: 2,
                    },
                    pharmacyId: {
                      type: 'string',
                      description: 'Dispensing pharmacy ID',
                      example: 'PHARM-789',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/dispensations': {
        post: {
          operationId: 'recordDispensation',
          summary: 'Record medication dispensation',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['dispensationId', 'prescriptionId', 'pharmacyId', 'dispensedDate'],
                  properties: {
                    dispensationId: {
                      type: 'string',
                      description: 'Unique dispensation ID',
                      example: 'DISP-001',
                    },
                    prescriptionId: {
                      type: 'string',
                      description: 'Related prescription ID',
                      example: 'RX-001',
                    },
                    pharmacyId: {
                      type: 'string',
                      description: 'Pharmacy ID',
                      example: 'PHARM-789',
                    },
                    pharmacistId: {
                      type: 'string',
                      description: 'Dispensing pharmacist ID',
                      example: 'RPH-123',
                    },
                    dispensedDate: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Date and time of dispensation',
                      example: '2024-01-15T14:30:00Z',
                    },
                    quantityDispensed: {
                      type: 'integer',
                      description: 'Quantity dispensed',
                      example: 30,
                    },
                    daysSupply: {
                      type: 'integer',
                      description: 'Days supply',
                      example: 10,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  'member-portal': {
    openapi: '3.0.0',
    info: {
      title: 'Member Portal API',
      version: '1.0.0',
      description: 'Patient portal and member management system',
    },
    paths: {
      '/api/v1/members': {
        post: {
          operationId: 'registerMember',
          summary: 'Register new member',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'firstName', 'lastName', 'dateOfBirth', 'memberId'],
                  properties: {
                    memberId: {
                      type: 'string',
                      description: 'Unique member identifier',
                      example: 'MEM-001',
                    },
                    email: {
                      type: 'string',
                      format: 'email',
                      description: 'Member email address',
                      example: 'member@email.com',
                    },
                    firstName: {
                      type: 'string',
                      description: 'First name',
                      example: 'Jane',
                    },
                    lastName: {
                      type: 'string',
                      description: 'Last name',
                      example: 'Smith',
                    },
                    dateOfBirth: {
                      type: 'string',
                      format: 'date',
                      description: 'Date of birth',
                      example: '1985-03-22',
                    },
                    phone: {
                      type: 'string',
                      description: 'Phone number',
                      example: '+1-555-987-6543',
                    },
                    preferredLanguage: {
                      type: 'string',
                      enum: ['en', 'es', 'fr', 'zh', 'vi'],
                      description: 'Preferred language',
                      example: 'en',
                    },
                    communicationPreferences: {
                      type: 'object',
                      properties: {
                        email: { type: 'boolean', example: true },
                        sms: { type: 'boolean', example: true },
                        phone: { type: 'boolean', example: false },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/messages': {
        post: {
          operationId: 'sendMessage',
          summary: 'Send secure message',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['fromMemberId', 'toProviderId', 'subject', 'body'],
                  properties: {
                    messageId: {
                      type: 'string',
                      description: 'Unique message ID',
                      example: 'MSG-001',
                    },
                    fromMemberId: {
                      type: 'string',
                      description: 'Sender member ID',
                      example: 'MEM-001',
                    },
                    toProviderId: {
                      type: 'string',
                      description: 'Recipient provider ID',
                      example: 'DR-456',
                    },
                    subject: {
                      type: 'string',
                      description: 'Message subject',
                      example: 'Follow-up question',
                    },
                    body: {
                      type: 'string',
                      description: 'Message body',
                      example: 'I have a question about my recent visit...',
                    },
                    priority: {
                      type: 'string',
                      enum: ['low', 'normal', 'high', 'urgent'],
                      description: 'Message priority',
                      example: 'normal',
                    },
                    attachments: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          fileName: { type: 'string' },
                          fileType: { type: 'string' },
                          fileSize: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  'provider-directory': {
    openapi: '3.0.0',
    info: {
      title: 'Provider Directory API',
      version: '1.0.0',
      description: 'Healthcare provider directory and credential management',
    },
    paths: {
      '/api/v1/providers': {
        post: {
          operationId: 'registerProvider',
          summary: 'Register healthcare provider',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['npi', 'firstName', 'lastName', 'specialty', 'licenseNumber'],
                  properties: {
                    npi: {
                      type: 'string',
                      description: 'National Provider Identifier',
                      example: '1234567890',
                    },
                    firstName: {
                      type: 'string',
                      description: 'Provider first name',
                      example: 'Sarah',
                    },
                    lastName: {
                      type: 'string',
                      description: 'Provider last name',
                      example: 'Johnson',
                    },
                    credentials: {
                      type: 'string',
                      description: 'Professional credentials',
                      example: 'MD, FACP',
                    },
                    specialty: {
                      type: 'string',
                      description: 'Medical specialty',
                      example: 'Internal Medicine',
                    },
                    licenseNumber: {
                      type: 'string',
                      description: 'State license number',
                      example: 'LIC-MA-12345',
                    },
                    licenseState: {
                      type: 'string',
                      description: 'License state',
                      example: 'MA',
                    },
                    acceptingNewPatients: {
                      type: 'boolean',
                      description: 'Whether accepting new patients',
                      example: true,
                    },
                    languages: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Languages spoken',
                      example: ['English', 'Spanish'],
                    },
                    practiceLocations: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          facilityId: { type: 'string' },
                          address: { type: 'string' },
                          phone: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export function getOpenApiSpec(appId: string): OpenApiSpec | undefined {
  return openApiSpecs[appId];
}

export function getApiPathKey(path: string): string {
  return path.replace(/\{[^}]+\}/g, '{id}');
}

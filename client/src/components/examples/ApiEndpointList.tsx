import { ApiEndpointList } from '../ApiEndpointList';
import { useState } from 'react';

const mockEndpoints = [
  {
    id: 'ep-1',
    method: 'GET' as const,
    path: '/api/v1/patients',
    category: 'Patient Data',
    description: 'Retrieve patient information and basic demographics',
    estimatedResponseTime: '~120ms',
  },
  {
    id: 'ep-2',
    method: 'POST' as const,
    path: '/api/v1/patients',
    category: 'Patient Data',
    description: 'Create new patient records with validation',
    estimatedResponseTime: '~250ms',
  },
  {
    id: 'ep-3',
    method: 'GET' as const,
    path: '/api/v1/appointments',
    category: 'Appointments',
    description: 'List upcoming and past appointments',
    estimatedResponseTime: '~180ms',
  },
  {
    id: 'ep-4',
    method: 'DELETE' as const,
    path: '/api/v1/patients/{id}',
    category: 'Patient Data',
    description: 'Remove patient records (GDPR compliance)',
    estimatedResponseTime: '~200ms',
  },
];

export default function ApiEndpointListExample() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['ep-1', 'ep-3']);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6">
      <ApiEndpointList
        endpoints={mockEndpoints}
        selectedIds={selectedIds}
        onToggle={handleToggle}
        onSelectAll={() => setSelectedIds(mockEndpoints.map((e) => e.id))}
        onClearAll={() => setSelectedIds([])}
      />
    </div>
  );
}

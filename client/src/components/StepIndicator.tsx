import { Check } from 'lucide-react';

export interface Step {
  number: number;
  label: string;
  status: 'completed' | 'active' | 'pending';
}

interface StepIndicatorProps {
  steps: Step[];
}

export function StepIndicator({ steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0" data-testid="step-indicator">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                step.status === 'completed'
                  ? 'border-green-500 bg-green-500 text-white'
                  : step.status === 'active'
                    ? 'border-primary bg-primary text-white'
                    : 'border-muted bg-background text-muted-foreground'
              }`}
              data-testid={`step-${step.number}-${step.status}`}
            >
              {step.status === 'completed' ? (
                <Check className="h-5 w-5" />
              ) : (
                <span className="font-semibold">{step.number}</span>
              )}
            </div>
            <span
              className={`text-sm font-medium ${
                step.status === 'active' ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`mx-4 h-0.5 w-24 ${
                steps[index + 1].status === 'completed' || steps[index + 1].status === 'active'
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

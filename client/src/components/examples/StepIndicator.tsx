import { StepIndicator, Step } from '../StepIndicator';

export default function StepIndicatorExample() {
  const steps: Step[] = [
    { number: 1, label: 'Application', status: 'completed' },
    { number: 2, label: 'APIs', status: 'completed' },
    { number: 3, label: 'Configure', status: 'active' },
    { number: 4, label: 'Review', status: 'pending' },
  ];

  return (
    <div className="p-12">
      <StepIndicator steps={steps} />
    </div>
  );
}

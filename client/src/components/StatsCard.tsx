import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatsCard({ title, value, icon: Icon, iconColor = 'bg-primary/10' }: StatsCardProps) {
  return (
    <Card className="p-6 hover-elevate" data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-4xl font-semibold" data-testid={`text-stat-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {value}
          </p>
        </div>
        <div className={`rounded-full p-3 ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}

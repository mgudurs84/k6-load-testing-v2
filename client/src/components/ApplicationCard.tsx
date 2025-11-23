import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';

interface ApplicationCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  apiCount: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelect: () => void;
}

const colorClasses: Record<string, string> = {
  blue: 'bg-app-blue/10 text-app-blue',
  green: 'bg-app-green/10 text-app-green',
  purple: 'bg-app-purple/10 text-app-purple',
  orange: 'bg-app-orange/10 text-app-orange',
  yellow: 'bg-app-yellow/10 text-app-yellow',
  pink: 'bg-app-pink/10 text-app-pink',
  teal: 'bg-app-teal/10 text-app-teal',
  indigo: 'bg-app-indigo/10 text-app-indigo',
};

export function ApplicationCard({
  id,
  name,
  description,
  icon,
  color,
  apiCount,
  isFavorite,
  onToggleFavorite,
  onSelect,
}: ApplicationCardProps) {
  const Icon = (LucideIcons as any)[icon] || LucideIcons.Box;

  return (
    <Card className="group relative p-6 transition-all hover:shadow-md" data-testid={`card-app-${id}`}>
      <button
        onClick={onToggleFavorite}
        className="absolute right-4 top-4 hover-elevate active-elevate-2 rounded-full p-1"
        data-testid={`button-favorite-${id}`}
      >
        <Star
          className={`h-5 w-5 transition-colors ${
            isFavorite ? 'fill-app-yellow text-app-yellow' : 'text-muted-foreground'
          }`}
        />
      </button>

      <div className="space-y-4">
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold" data-testid={`text-app-name-${id}`}>{name}</h3>
            <Badge variant="secondary" className="text-xs" data-testid={`badge-api-count-${id}`}>
              {apiCount} APIs
            </Badge>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
        </div>

        <Button
          onClick={onSelect}
          className="w-full"
          data-testid={`button-select-${id}`}
        >
          Select
        </Button>
      </div>
    </Card>
  );
}

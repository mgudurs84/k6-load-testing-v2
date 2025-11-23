import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  items: string[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          <span
            className={index === items.length - 1 ? 'font-medium text-foreground' : ''}
            data-testid={`breadcrumb-item-${index}`}
          >
            {item}
          </span>
        </div>
      ))}
    </nav>
  );
}

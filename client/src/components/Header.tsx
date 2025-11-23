import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-2">
            <span className="text-lg font-bold text-white">K6</span>
          </div>
          <span className="text-lg font-semibold">K6 Load Testing</span>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-full pl-9"
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="relative hover-elevate active-elevate-2 rounded-full p-2"
            data-testid="button-notifications"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute right-0 top-0 h-5 w-5 rounded-full p-0 text-xs">
              3
            </Badge>
          </button>

          <div className="flex items-center gap-2">
            <Avatar data-testid="avatar-user">
              <AvatarImage src="" alt="Sarah Chen" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                SC
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Sarah Chen</span>
          </div>
        </div>
      </div>
    </header>
  );
}

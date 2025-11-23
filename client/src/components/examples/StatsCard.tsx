import { StatsCard } from '../StatsCard';
import { Layers, TrendingUp, Trophy } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      <StatsCard title="Total Applications" value="24" icon={Layers} iconColor="bg-app-blue/10" />
      <StatsCard title="Tests Completed" value="1,247" icon={TrendingUp} iconColor="bg-app-green/10" />
      <StatsCard title="Success Rate" value="98.5%" icon={Trophy} iconColor="bg-app-yellow/10" />
    </div>
  );
}

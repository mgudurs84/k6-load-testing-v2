import { ApplicationCard } from '../ApplicationCard';
import { useState } from 'react';

export default function ApplicationCardExample() {
  const [isFavorite, setIsFavorite] = useState(true);

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      <ApplicationCard
        id="cdr-clinical"
        name="CDR Clinical API"
        description="Healthcare data exchange platform for clinical information sharing and management"
        icon="Activity"
        color="blue"
        apiCount={24}
        isFavorite={isFavorite}
        onToggleFavorite={() => {
          setIsFavorite(!isFavorite);
          console.log('Favorite toggled');
        }}
        onSelect={() => console.log('Application selected')}
      />
      <ApplicationCard
        id="member-portal"
        name="Member Portal API"
        description="Patient portal and member management system for healthcare organizations"
        icon="Users"
        color="purple"
        apiCount={32}
        isFavorite={false}
        onToggleFavorite={() => console.log('Favorite toggled')}
        onSelect={() => console.log('Application selected')}
      />
    </div>
  );
}

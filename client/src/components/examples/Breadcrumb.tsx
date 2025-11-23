import { Breadcrumb } from '../Breadcrumb';

export default function BreadcrumbExample() {
  return (
    <div className="p-6">
      <Breadcrumb items={['Applications', 'CDR Clinical API', 'API Selection']} />
    </div>
  );
}

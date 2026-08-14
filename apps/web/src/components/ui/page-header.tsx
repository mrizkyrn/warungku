import { Link } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';

interface PageHeaderProps {
  to: string;
  params?: Record<string, unknown>;
  title: string;
  description?: string;
}

export function PageHeader({ to, params, title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <Link
        to={to}
        params={params}
        className="text-foreground group hover:text-primary focus-visible:border-ring focus-visible:ring-ring/50 -mx-2 inline-flex items-center gap-2 rounded-lg p-2 text-2xl font-semibold transition-colors outline-none hover:bg-transparent focus-visible:ring-3"
      >
        <span aria-hidden="true" className="text-primary text-xl">
          <ArrowLeftIcon className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
        </span>
        <h1 className="text-foreground text-xl font-semibold sm:text-2xl">{title}</h1>
      </Link>
      {description && <p className="text-muted-foreground text-sm">{description}</p>}
    </div>
  );
}

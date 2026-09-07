import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Compass className="h-16 w-16 text-primary" />
      <h1 className="mt-6 font-display text-6xl font-bold">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6">
        <span className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90">
          Back to Home
        </span>
      </Link>
    </div>
  );
}

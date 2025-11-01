'use client';

export function NotFoundContent() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-8 text-center">
      <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-foreground">
        404 - Page Not Found
      </h1>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
    </div>
  );
}

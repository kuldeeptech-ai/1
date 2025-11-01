import { getSearchResults } from '@/lib/actions';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { MovieList } from '@/components/MovieList';

export const revalidate = 3600; // Revalidate every hour

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  const initialMovies = query ? await getSearchResults(query, 1) : [];

  // Bind the query argument to the fetcher function on the server
  const boundGetSearchResults = query ? getSearchResults.bind(null, query) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {query ? `Results for "${query}"` : 'Search'}
      </h1>
      <Suspense fallback={<SearchResultsSkeleton />}>
        {query && boundGetSearchResults ? (
            <MovieList
              initialMovies={initialMovies}
              fetcher={boundGetSearchResults}
              fetcherKey={query}
            />
        ) : (
          <p className="text-muted-foreground">Please enter a search term to find movies and series.</p>
        )}
      </Suspense>
    </div>
  );
}

function SearchResultsSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="space-y-2">
                <div className="aspect-[2/3] w-full animate-pulse rounded-lg bg-muted"></div>
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
            </div>
        ))}
        </div>
    );
}

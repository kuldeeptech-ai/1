
'use client';

import { useState, useEffect } from 'react';
import { MovieCard } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import type { Movie } from '@/lib/types';

interface MovieListProps {
  initialMovies: Movie[];
  fetcher: (page: number) => Promise<Movie[]>;
  fetcherKey?: string; // A key to reset the state when the fetcher context changes (e.g., new category or search query)
}

export function MovieList({ initialMovies, fetcher, fetcherKey }: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialMovies.length > 0);

  // Reset state when the fetcherKey changes (e.g., new search query)
  useEffect(() => {
    setMovies(initialMovies);
    setPage(2);
    setHasMore(initialMovies.length > 0);
  }, [fetcherKey, initialMovies]);


  const loadMoreMovies = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newMovies = await fetcher(page);
      if (newMovies.length > 0) {
        setMovies((prevMovies) => [...prevMovies, ...newMovies]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more movies:', error);
      setHasMore(false); // Stop trying if there's an error
    } finally {
      setIsLoading(false);
    }
  };
  
  if (movies.length === 0) {
     return (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted">
            <p className="text-center text-muted-foreground">No content found.</p>
        </div>
     )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {movies.map((movie, index) => (
          <MovieCard key={`${movie.path}-${index}`} movie={movie} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        {hasMore && (
          <Button onClick={loadMoreMovies} disabled={isLoading} variant="outline">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Load More
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
        {!hasMore && movies.length > 0 && (
          <p className="text-muted-foreground">You've reached the end.</p>
        )}
      </div>
    </>
  );
}

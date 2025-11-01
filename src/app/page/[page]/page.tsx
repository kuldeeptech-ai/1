import { MovieCard } from '@/components/MovieCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getHomepageMovies } from '@/lib/actions';

export const revalidate = 3600; // Revalidate every hour

interface PageProps {
  params: {
    page?: string;
  };
}

export default async function Page({ params }: PageProps) {
  const page = params?.page ? parseInt(params.page, 10) : 1;

  if (isNaN(page) || page < 1) {
    notFound();
  }

  const movies = await getHomepageMovies(page);

  const currentPage = page;
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-headline text-xl font-bold tracking-tight text-foreground sm:text-4xl">
        Page {currentPage}
      </h1>
      {movies && movies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {movies.map((movie) => (
              <MovieCard key={movie.path} movie={movie} />
            ))}
          </div>
          <div className="mt-12 flex justify-center gap-4">
            {currentPage > 1 && (
              <Button asChild variant="outline">
                <Link href={prevPage === 1 ? '/' : `/page/${prevPage}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Link>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href={`/page/${nextPage}`}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-muted">
          <p className="text-center text-muted-foreground">Could not load movies for this page. The source site might be down or you've reached the end.</p>
        </div>
      )}
    </div>
  );
}

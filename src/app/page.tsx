import { getHomepageMovies, getCategories } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MovieList } from '@/components/MovieList';

export const revalidate = 3600; // Revalidate every hour

async function CategoryBrowser() {
  const categories = await getCategories();
  return (
    <div className="mb-12">
      <div className="flex justify-center flex-wrap gap-3 p-0">
        {categories.map((category) => (
          <Link href={category.path} key={category.path} passHref>
            <Button
              className={cn(
                'h-auto p-0 text-white font-bold text-[12px] animate-bump transition-all duration-500',
                'bg-gradient-to-r from-red-600 to-black',
                'shadow-[0_6px_15px_-2px_rgba(255,0,0,0.5)]',
                'hover:saturate-200 hover:-translate-y-1'
              )}
            >
              <div className="px-3 py-1.5">{category.name}</div>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  const initialMovies = await getHomepageMovies(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryBrowser />

      <h1 className="mb-8 font-headline text-xl font-bold tracking-tight text-foreground sm:text-4xl">
        Trending & Recent
      </h1>
      <MovieList
        initialMovies={initialMovies}
        fetcher={getHomepageMovies}
      />
    </div>
  );
}

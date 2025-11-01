import { getCategoryMovies } from '@/lib/actions';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { MovieList } from '@/components/MovieList';

export const revalidate = 3600; // Revalidate every hour

interface CategoryPageProps {
  params: {
    slug: string[];
  };
}

// Function to generate metadata
export async function generateMetadata({ params }: CategoryPageProps) {
  const slug = params.slug || [];
  const path = slug.join('/');
  
  // Capitalize each part of the slug for the title
  const title = slug.map(part => part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ')).join(' ');
  
  if (!title) {
      return { title: 'Category Not Found' };
  }

  return {
    title: `${title} - hdlove4u`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const slug = params.slug || [];
  const path = slug.join('/');

  const title = slug.map(part => part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ')).join(' ');
  const initialMovies = await getCategoryMovies(path, 1);
  
  // Bind the path argument to the fetcher function on the server
  const boundGetCategoryMovies = getCategoryMovies.bind(null, path);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-headline text-xl font-bold tracking-tight text-foreground sm:text-4xl">
        Category: {title}
      </h1>
      <Suspense fallback={<CategoryResultsSkeleton />}>
        <MovieList
          initialMovies={initialMovies}
          fetcher={boundGetCategoryMovies}
          fetcherKey={path}
        />
      </Suspense>
    </div>
  );
}


function CategoryResultsSkeleton() {
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

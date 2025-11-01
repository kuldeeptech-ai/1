import { NextResponse } from 'next/server';
import { getMovieDetails } from '@/lib/actions';

export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  const path = params.slug.join('/');
  
  if (!path) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const movieDetails = await getMovieDetails(path);

  if (!movieDetails) {
    return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
  }

  return NextResponse.json({ movie: movieDetails });
}

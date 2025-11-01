
import * as cheerio from 'cheerio';
import type { Movie, MovieDetails, DownloadLink, Category, Episode } from './types';

const BASE_URL = "https://vegamovies.you";

async function fetchHtml(url: string) {
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      },
    });
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.statusText}`);
      return null;
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

function parseMovies(html: string): Movie[] {
  const $ = cheerio.load(html);
  const movies: Movie[] = [];
  const seenPaths = new Set<string>();

  $('article.post-item').each((_, element) => {
    const a = $(element).find('h3.entry-title a');
    const path = a.attr('href');
    const title = a.text().trim();
    let imageUrl = $(element).find('img.blog-picture').attr('src') || '';

    if (path && title && imageUrl && !seenPaths.has(path)) {
      movies.push({ title, imageUrl, path: new URL(path).pathname });
      seenPaths.add(path);
    }
  });

  return movies;
}

export async function getHomepageMovies(page: number = 1): Promise<Movie[]> {
  const url = page > 1 ? `${BASE_URL}/page/${page}/` : BASE_URL;
  const html = await fetchHtml(url);
  if (!html) return [];
  return parseMovies(html);
}

export async function getSearchResults(query: string): Promise<Movie[]> {
  const url = `${BASE_URL}/?s=${encodeURIComponent(query)}`;
  const html = await fetchHtml(url);
  if (!html) return [];
  return parseMovies(html);
}

export async function getCategoryMovies(path: string, page: number = 1): Promise<Movie[]> {
    const cleanPath = path.startsWith('/category/') ? path : `/category/${path}`;
    const pagePath = page > 1 ? `/page/${page}/` : '';
    const url = `${BASE_URL}${cleanPath}${pagePath}`;
    
    const html = await fetchHtml(url);
    if (!html) return [];
    return parseMovies(html);
}


export async function getMovieDetails(path: string): Promise<MovieDetails | null> {
  const finalPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${BASE_URL}${finalPath}`;
  const html = await fetchHtml(url);
  if (!html) return null;

  const $ = cheerio.load(html);
  
  const title = $('h1.entry-title').text().trim() || '';
  if (!title) return null;

  const movieInfo: Partial<MovieDetails> = {};
  
  // Extract main description from the first <p> in entry-content
  movieInfo.description = $('div.entry-content > p').first().text().trim();
  
  // Extract synopsis if available
  const synopsisHeading = $('h3:contains("Movie-SYNOPSIS/PLOT:")');
  if (synopsisHeading.length > 0) {
      movieInfo.synopsis = synopsisHeading.next('p').text().trim();
  }

  // Extract featured image
  let imageUrl = $('div.entry-content p:has(img[src*="/uploads/posts/covers/"]) img').attr('src') || '';
  if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${BASE_URL}${imageUrl}`;
  }
  
  // Extract other details from the "Movie Info" section
  const movieInfoText = $('h3:contains("Movie Info")').next('p').html();
  if (movieInfoText) {
    const lines = movieInfoText.split('<br>').map(line => cheerio.load(line).text().trim());
    lines.forEach(line => {
      if (line.includes('IMDb Rating:')) movieInfo.rating = line.split('IMDb Rating:')[1]?.trim();
      if (line.includes('Release Year:')) movieInfo.year = line.split('Release Year:')[1]?.trim();
      if (line.includes('Language:')) movieInfo.language = line.split('Language:')[1]?.trim();
      if (line.includes('Runtime :')) movieInfo.duration = line.split('Runtime :')[1]?.trim();
      if (line.includes('Genres:')) movieInfo.category = line.split('Genres:')[1]?.trim();
    });
  }

  // IMDB ID from iframe
  const iframeSrc = $('div.tabs__content iframe').attr('src');
  if (iframeSrc) {
    const imdbIdMatch = iframeSrc.match(/tt\d+/);
    if (imdbIdMatch) {
      movieInfo.imdbId = imdbIdMatch[0];
    }
  }

  // Download links
  const downloadLinks: DownloadLink[] = [];
  $('div.download-links-div a.btn').each((_, element) => {
    const link = $(element);
    const href = link.attr('href');
    const text = link.find('button.dwd-button').text().trim();
    if (href) {
      downloadLinks.push({
        url: href,
        quality: text || 'Download',
        title: text || 'Download',
      });
    }
  });

  return {
    title,
    imageUrl,
    path,
    description: movieInfo.description || 'No description available.',
    synopsis: movieInfo.synopsis,
    downloadLinks: downloadLinks,
    category: movieInfo.category,
    releaseDate: movieInfo.releaseDate,
    imdbId: movieInfo.imdbId,
    year: movieInfo.year,
    rating: movieInfo.rating,
    duration: movieInfo.duration,
    language: movieInfo.language,
    tags: movieInfo.tags,
  };
}

export async function getCategories(): Promise<Category[]> {
    const url = BASE_URL;
    const html = await fetchHtml(url);
    if (!html) return [];

    const $ = cheerio.load(html);
    const categories: Category[] = [];
    const seenCategories = new Set<string>();

    $('ul#menu-primary-menu > li.menu-item-has-children > ul.sub-menu > li > a').each((_, element) => {
        const a = $(element);
        const name = a.text().trim();
        const href = a.attr('href');

        if (name && href && !seenCategories.has(name)) {
            const path = new URL(href).pathname;
            if(path.startsWith('/category/')) {
               categories.push({
                    name,
                    path: path,
                });
                seenCategories.add(name);
            }
        }
    });
    
    // Add some default categories if scraping fails
    if(categories.length === 0){
        return [
            { name: "Bollywood", path: "/category/bollywood/" },
            { name: "Hollywood", path: "/category/hollywood/" },
            { name: "South Hindi", path: "/category/south-hindi-dubbed-movies/" },
            { name: "Web Series", path: "/category/web-series/" },
            { name: "TV Shows", path: "/category/tv-shows/" },
        ];
    }

    return categories;
}

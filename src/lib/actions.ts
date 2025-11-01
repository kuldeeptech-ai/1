
'use server';

import * as cheerio from 'cheerio';
import type { Movie, MovieDetails, DownloadLink, Category } from './types';

const BASE_URL = "https://vegamovies.you";

async function fetchHtml(url: string) {
  console.log(`Fetching URL: ${url}`);
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
       if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${BASE_URL}${imageUrl}`;
      }
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

export async function getSearchResults(query: string, page: number = 1): Promise<Movie[]> {
  const url = page > 1
    ? `${BASE_URL}/page/${page}/?s=${encodeURIComponent(query)}`
    : `${BASE_URL}/?s=${encodeURIComponent(query)}`;
  const html = await fetchHtml(url);
  if (!html) return [];
  return parseMovies(html);
}


export async function getCategoryMovies(path: string, page: number = 1): Promise<Movie[]> {
    let basePath = path.startsWith('/') ? path : `/${path}`;

    if (basePath.startsWith('/category')) {
        basePath = basePath.replace('/category', '');
    }

    const pagePath = page > 1 ? `page/${page}/` : '';
    const url = `${BASE_URL}${basePath}${pagePath}`;
    
    console.log(`Fetching CATEGORY URL: ${url}`);
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

  let imageUrl = $('meta[property="og:image"]').attr('content') || '';
  if (imageUrl) {
    if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${BASE_URL}/uploads/posts/covers/${imageUrl}`;
    }
  } else {
    imageUrl = $('div.entry-content p:has(img[src*="/uploads/posts/covers/"]) img').attr('src') || '';
    if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${BASE_URL}${imageUrl}`;
    }
  }
  
  const movieInfo: Partial<MovieDetails> = { paragraphs: [] };
  
  const allParagraphs: string[] = [];
  $('div.entry-content > p').each((_, el) => {
      const pText = $(el).text().trim();
      if (pText && !pText.toLowerCase().includes('vegamovies.you is the best') && !pText.includes('IMDb Rating:')) {
          allParagraphs.push(pText);
      }
  });

  movieInfo.paragraphs = allParagraphs.length > 1 ? allParagraphs.slice(0, -1) : allParagraphs;


  const description = movieInfo.paragraphs?.join('\n\n') || 'No description available.';
  
  const dateText = $('div.post-meta-wrap .date-time time').text().trim();
  if (dateText) {
    movieInfo.releaseDate = dateText;
  }

  const iframeSrc = $('div.tabs__content iframe').attr('src');
  if (iframeSrc) {
    const imdbIdMatch = iframeSrc.match(/tt\d+/);
    if (imdbIdMatch) {
      movieInfo.imdbId = imdbIdMatch[0];
    }
  }

  const downloadLinks: DownloadLink[] = [];
$('h5.wp-block-heading').each((_, headingEl) => {
    const groupTitle = $(headingEl).text().trim();
    if (groupTitle.toLowerCase().includes('download') || groupTitle.toLowerCase().includes('g-direct')) {
        let nextEl = $(headingEl).next();
        while (nextEl.length && !nextEl.is('h5')) {
            nextEl.find('a.btn').each((_, linkEl) => {
                const link = $(linkEl);
                const href = link.attr('href');
                const text = link.find('button.dwd-button').text().trim();
                if (href) {
                    downloadLinks.push({
                        groupTitle: groupTitle,
                        url: href,
                        quality: text.split('[')[0]?.trim() || 'Download',
                        title: text || 'Download',
                    });
                }
            });
            nextEl = nextEl.next();
        }
    }
});


  const screenshots: string[] = [];
  $('h3:contains("Screenshots")').next('div.container').find('p img').each((_, el) => {
    const src = $(el).attr('src');
    if (src) {
        screenshots.push(src.startsWith('http') ? src : `${BASE_URL}${src}`);
    }
  });

  const pWithMovieInfo = $('div.entry-content > p:contains("IMDb Rating:")');
  if (pWithMovieInfo.length > 0) {
    const infoHtml = pWithMovieInfo.html();
    if (infoHtml) {
      const lines = infoHtml.split('<br>');
      lines.forEach(line => {
        const textLine = cheerio.load(line).text().trim();
        if (textLine.includes('IMDb Rating:')) movieInfo.rating = textLine.replace(/👉/g, '').split('IMDb Rating:')[1]?.trim();
        if (textLine.includes('Movie Name')) movieInfo.title_from_info = textLine.split('Movie Name:')[1]?.trim();
        if (textLine.includes('Release Year:')) movieInfo.year = textLine.split('Release Year:')[1]?.trim();
        if (textLine.includes('Language:')) movieInfo.language = textLine.split('Language:')[1]?.trim();
        if (textLine.includes('Size:')) movieInfo.size = textLine.split('Size:')[1]?.trim();
        if (textLine.includes('Format:')) movieInfo.format = textLine.split('Format:')[1]?.trim();
        if (textLine.includes('Runtime :')) movieInfo.duration = textLine.split('Runtime :')[1]?.trim();
        if (textLine.includes('Quality:')) movieInfo.quality = textLine.split('Quality:')[1]?.trim();
        if (textLine.includes('Genres:')) movieInfo.category = textLine.split('Genres:')[1]?.trim();
        if (textLine.includes('Writers:')) movieInfo.writers = textLine.split('Writers:')[1]?.trim();
        if (textLine.includes('Cast:')) movieInfo.stars = textLine.split('Cast:')[1]?.trim();
        if (textLine.includes('Director:')) movieInfo.director = textLine.split('Director:')[1]?.trim();
      });
    }
  }


  if (!title) return null;

  return {
    title: movieInfo.title_from_info || title,
    imageUrl,
    path,
    description: description,
    paragraphs: movieInfo.paragraphs,
    downloadLinks: downloadLinks,
    category: movieInfo.category,
    releaseDate: movieInfo.releaseDate,
    tags: movieInfo.tags,
    imdbId: movieInfo.imdbId,
    year: movieInfo.year,
    screenshots,
    rating: movieInfo.rating,
    language: movieInfo.language,
    size: movieInfo.size,
    format: movieInfo.format,
    duration: movieInfo.duration,
    quality: movieInfo.quality,
    writers: movieInfo.writers,
    stars: movieInfo.stars,
    director: movieInfo.director,
  };
}

export async function getCategories(): Promise<Category[]> {
    return [
      { name: "Dual Audio [Hindi] 720P", path: "/category/dual-audio-hindi-english-movies/" },
      { name: "Hollywood Movies 1080P", path: "/category/hollywood-movies/" },
      { name: "Telugu", path: "/category/telugu-movies-free-download/" },
      { name: "Action", path: "/category/action/" },
      { name: "Adventure", path: "/category/adventure/" },
      { name: "Animation", path: "/category/animation/" },
      { name: "Cartoon", path: "/category/cartoon/" },
      { name: "Comedy", path: "/category/comedy/" },
      { name: "Crime", path: "/category/crime/" },
      { name: "Documentary", path: "/category/documentary/" },
      { name: "Drama", path: "/category/drama/" },
      { name: "Family", path: "/category/family/" },
      { name: "Fantasy", path: "/category/fantasy/" },
      { name: "History", path: "/category/history/" },
      { name: "Horror", path: "/category/horror/" },
      { name: "Mystery", path: "/category/mystery/" },
      { name: "Romance", path: "/category/romance/" },
      { name: "Thriller", path: "/category/thriller/" },
      { name: "War", path: "/category/war/" },
      { name: "Web Series", path: "/category/tv-shows/" },
      { name: "Tamil 720P", path: "/category/tamil-movies/" },
      { name: "Pakistani", path: "/category/pakistani-movies/" },
      { name: "Punjabi Movies 720P", path: "/category/punjabi-movies/" },
      ];
}

export async function getRecentPosts(): Promise<{title: string, path: string}[]> {
  const url = BASE_URL;
  const html = await fetchHtml(url);
  if (!html) return [];

  const $ = cheerio.load(html);
  const posts: {title: string, path: string}[] = [];

  $('#recent-posts-2 ul li a').each((_, element) => {
    const a = $(element);
    const title = a.text().trim();
    const href = a.attr('href');
    if (title && href) {
      posts.push({
        title,
        path: new URL(href).pathname,
      });
    }
  });

  return posts;
}

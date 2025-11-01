
export interface Movie {
  title: string;
  imageUrl: string;
  path: string;
}

export interface DownloadLink {
  groupTitle: string;
  quality: string;
  url: string;
  title: string;
}

export interface Episode {
  number: number;
  title: string;
  downloadLinks: DownloadLink[];
}

export interface MovieDetails extends Movie {
  description: string;
  paragraphs?: string[];
  downloadLinks: DownloadLink[];
  episodeList?: Episode[];
  synopsis?: string;
  category?: string;
  rating?: string;
  year?: string;
  duration?: string;
  views?: string;
  downloads?: string;
  music?: string;
  releaseDate?: string;
  language?: string;
  totalRuntime?: string;
  trailer?: {
    url: string;
    thumbnail?: string;
    duration?: string;
    views?: string;
    likes?: string;
  };
  screenshots?: string[];
  qualities?: { name: string; size: string }[];
  stars?: string;
  director?: string;
  imdbUrl?: string;
  imdbId?: string;
  tags?: string[];
  size?: string;
  format?: string;
  quality?: string;
  writers?: string;
}

export interface Category {
  name: string;
  path: string;
  path_group?: string;
}

# **App Name**: NetVlyx

## Core Features:

- Content Fetching: Fetches movie/series data from 'https://hdhub4u.cologne/' using a proxy to bypass CORS issues.
- Data Parsing: Parses the fetched HTML to extract movie titles, descriptions, and direct download links, potentially decrypting the links using custom scripts.
- Search Functionality: Allows users to search for movies and series; the tool scrapes the search result page of the source website.
- Ad Removal: Filters out ads, pop-ups, and redirects from the scraped content to provide a clean user experience.
- Content Display: Presents movie titles, descriptions, and download links in a user-friendly layout.
- Homepage Trending Display: Display the list of trending contents at the homepage.
- Content Categories: Allow user to browser contents via Categories and Sub-categories

## Style Guidelines:

- Primary color: Dark Gray (#212121) to maintain a modern cinematic look, similar to dark mode interfaces which are optimal for media consumption.
- Background color: Very dark gray (#121212), almost black, complements the dark gray primary and accentuates the content.
- Accent color: Vivid Orange (#FF9800), analogous to yellow but much more saturated, used for interactive elements and highlights, providing good contrast.
- Headline font: 'Poppins', a geometric sans-serif font, for titles and headings, lending a contemporary feel. Note: currently only Google Fonts are supported.
- Body font: 'Inter', a grotesque sans-serif font, for descriptions and text, prioritizing readability and a modern aesthetic. Note: currently only Google Fonts are supported.
- Use clean, minimalist icons for navigation and actions, ensuring they are easily recognizable and consistent throughout the app.
- Implement a grid-based layout to display movie/series thumbnails, titles, and descriptions in an organized manner.
- Use subtle transition animations when displaying content or navigating between pages to enhance the user experience without being distracting.
import { supabase } from './supabase';
import { Movie, Series, License } from '@/types';

// Get available movies for user's country
export async function getAvailableMovies(countryCode: string, limit = 20) {
  const { data, error } = await supabase
    .from('movies')
    .select(`
      *,
      licenses(authorized_countries, license_start_date, license_end_date, licensing_status)
    `)
    .eq('licensing_status', 'active')
    .gte('license_end_date', new Date().toISOString())
    .limit(limit);

  if (error) throw error;

  // Filter by country availability
  return data.filter((movie: any) =>
    movie.licenses.some((license: any) =>
      license.authorized_countries.includes(countryCode)
    )
  );
}

// Get trending movies
export async function getTrendingMovies(countryCode: string, limit = 10) {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('licensing_status', 'active')
    .gte('license_end_date', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// Get movies by genre
export async function getMoviesByGenre(
  genre: string,
  countryCode: string,
  limit = 20
) {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .contains('genres', [genre])
    .eq('licensing_status', 'active')
    .gte('license_end_date', new Date().toISOString())
    .limit(limit);

  if (error) throw error;
  return data;
}

// Search content
export async function searchContent(
  query: string,
  countryCode: string,
  contentType?: 'movie' | 'series'
) {
  let dbQuery = supabase.from('movies');

  if (contentType === 'series') {
    dbQuery = supabase.from('series');
  }

  const { data, error } = await (dbQuery as any)
    .select('*')
    .or(`title.ilike.%${query}%,synopsis.ilike.%${query}%`)
    .eq('licensing_status', 'active')
    .gte('license_end_date', new Date().toISOString());

  if (error) throw error;
  return data;
}

// Get movie details with all related data
export async function getMovieDetails(movieId: string) {
  const { data, error } = await supabase
    .from('movies')
    .select(
      `
      *,
      licenses(*),
      content_regions(*)
    `
    )
    .eq('id', movieId)
    .single();

  if (error) throw error;
  return data;
}

// Get series details with seasons and episodes
export async function getSeriesDetails(seriesId: string) {
  const { data, error } = await supabase
    .from('series')
    .select(
      `
      *,
      seasons(
        *,
        episodes(*)
      ),
      licenses(*),
      content_regions(*)
    `
    )
    .eq('id', seriesId)
    .single();

  if (error) throw error;
  return data;
}

// Check if content is available in user's country
export async function isContentAvailable(
  contentId: string,
  contentType: 'movie' | 'series',
  countryCode: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('content_id', contentId)
    .eq('content_type', contentType)
    .gte('end_date', new Date().toISOString());

  if (error) throw error;

  return data.some((license: License) =>
    license.authorized_countries.includes(countryCode)
  );
}

// Get recommended content for user
export async function getRecommendedContent(
  userId: string,
  countryCode: string,
  limit = 20
) {
  // Get user's watch history
  const { data: watchHistory } = await supabase
    .from('watch_history')
    .select('content_id')
    .eq('user_id', userId)
    .limit(10);

  // Get genres from watched content
  const watchedIds = watchHistory?.map((w: any) => w.content_id) || [];

  if (watchedIds.length === 0) {
    return getTrendingMovies(countryCode, limit);
  }

  const { data: watchedContent } = await supabase
    .from('movies')
    .select('genres')
    .in('id', watchedIds);

  const genres = Array.from(
    new Set(watchedContent?.flatMap((m: any) => m.genres || []))
  );

  // Get similar content
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .or(genres.map((g) => `genres.cs.{${g}}`).join(','))
    .not('id', 'in', `(${watchedIds.join(',')})`)
    .eq('licensing_status', 'active')
    .limit(limit);

  if (error) throw error;
  return data;
}

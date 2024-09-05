import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface User {
  id: string;
  email: string;
}

export interface SearchQuery {
  id: string;
  user_id: string;
  query: string;
  optimized_query: string;
}

export interface SearchResult {
  id: string;
  query_id: string;
  title: string;
  authors: string[];
  abstract: string;
  url: string;
  published_year: number;
  citation_count: number;
}

export interface AuthorRelationship {
  id: string;
  author1: string;
  author2: string;
  co_authored_count: number;
}

export interface UserSettings {
  user_id: string;
  default_search_count: number;
  min_year?: number;
  max_year?: number;
  preferred_languages: string[];
}

export async function createUser(email: string): Promise<User> {
  const { data, error } = await supabase.auth.signUp({ email });
  if (error) throw error;
  return data.user as User;
}

export async function getUser(userId: string): Promise<User | null> {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export async function createSearchQuery(userId: string, query: string, optimizedQuery: string): Promise<SearchQuery> {
  const { data, error } = await supabase
    .from('search_queries')
    .insert({ user_id: userId, query, optimized_query: optimizedQuery })
    .single();
  if (error) throw error;
  return data;
}

export async function getSearchQueries(userId: string): Promise<SearchQuery[]> {
  const { data, error } = await supabase.from('search_queries').select('*').eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function createSearchResult(result: Omit<SearchResult, 'id'>): Promise<SearchResult> {
  const { data, error } = await supabase.from('search_results').insert(result).single();
  if (error) throw error;
  return data;
}

export async function getSearchResults(queryId: string): Promise<SearchResult[]> {
  const { data, error } = await supabase.from('search_results').select('*').eq('query_id', queryId);
  if (error) throw error;
  return data;
}

export async function createAuthorRelationship(author1: string, author2: string): Promise<AuthorRelationship> {
  const { data, error } = await supabase.from('author_relationships').insert({ author1, author2 }).single();
  if (error) throw error;
  return data;
}

export async function getAuthorRelationships(author: string): Promise<AuthorRelationship[]> {
  const { data, error } = await supabase
    .from('author_relationships')
    .select('*')
    .or(`author1.eq.${author},author2.eq.${author}`);
  if (error) throw error;
  return data;
}

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const { data, error } = await supabase.from('user_settings').select('*').eq('user_id', userId).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateUserSettings(settings: UserSettings): Promise<UserSettings> {
  const { data, error } = await supabase.from('user_settings').upsert(settings).single();
  if (error) throw error;
  return data;
}

export async function exportUserData(userId: string): Promise<{ queries: SearchQuery[]; results: SearchResult[] }> {
  const queries = await getSearchQueries(userId);
  const results = await Promise.all(queries.map(q => getSearchResults(q.id)));
  return {
    queries,
    results: results.flat(),
  };
}

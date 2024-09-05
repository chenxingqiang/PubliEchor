export {
  supabase,
  createUser,
  getUser,
  createSearchQuery,
  getSearchQueries,
  createSearchResult,
  getSearchResults,
  createAuthorRelationship,
  getAuthorRelationships,
  getUserSettings,
  updateUserSettings,
  exportUserData,
} from './client';

export type { User, SearchQuery, SearchResult, AuthorRelationship, UserSettings } from './client';

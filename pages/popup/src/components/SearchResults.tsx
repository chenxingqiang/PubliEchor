// pages/popup/src/components/SearchResults.tsx

import { AuthorRelationship, getAuthorRelationships, getSearchResults, SearchResult } from '@packages/supabase-client';
import React, { useEffect, useState } from 'react';

const SearchResults: React.FC<{ queryId: string }> = ({ queryId }) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [authorRelationships, setAuthorRelationships] = useState<AuthorRelationship[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const searchResults = await getSearchResults(queryId);
      setResults(searchResults);
    };
    fetchResults();
  }, [queryId]);

  const handleAuthorClick = async (author: string) => {
    const relationships = await getAuthorRelationships(author);
    setAuthorRelationships(relationships);
  };

  return (
    <div>
      <h2>Search Results</h2>
      {results.map(result => (
        <div key={result.id}>
          <h3>{result.title}</h3>
          <p>Authors: {result.authors.join(', ')}</p>
          <p>Year: {result.published_year}</p>
          <p>Citations: {result.citation_count}</p>
          <a href={result.url} target="_blank" rel="noopener noreferrer">
            View Paper
          </a>
          <button onClick={() => handleAuthorClick(result.authors[0])}>Analyze Main Author</button>
        </div>
      ))}

      {authorRelationships.length > 0 && (
        <div>
          <h3>Author Relationships</h3>
          {authorRelationships.map(relationship => (
            <p key={relationship.id}>
              {relationship.author1} and {relationship.author2} have co-authored {relationship.co_authored_count}{' '}
              papers.
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;

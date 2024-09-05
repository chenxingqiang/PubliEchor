import React, { useState, useEffect } from 'react';
import { getAuthorRelationships } from '@packages/supabase-client';
import AuthorNetworkVisualization from './AuthorNetworkVisualization';

interface Author {
  name: string;
  id: string;
}

interface Relationship {
  source: string;
  target: string;
  strength: number;
}

const AuthorNetwork: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAuthorRelationships();

        // Process the data to create nodes (authors) and links (relationships)
        const authorsMap = new Map<string, Author>();
        const relationshipsArray: Relationship[] = [];

        data.forEach(relation => {
          if (!authorsMap.has(relation.author1)) {
            authorsMap.set(relation.author1, { name: relation.author1, id: relation.author1 });
          }
          if (!authorsMap.has(relation.author2)) {
            authorsMap.set(relation.author2, { name: relation.author2, id: relation.author2 });
          }
          relationshipsArray.push({
            source: relation.author1,
            target: relation.author2,
            strength: relation.co_authored_count,
          });
        });

        setAuthors(Array.from(authorsMap.values()));
        setRelationships(relationshipsArray);
      } catch (err) {
        setError('Failed to fetch author relationships');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Author Network</h1>
      <AuthorNetworkVisualization authors={authors} relationships={relationships} />
    </div>
  );
};

export default AuthorNetwork;

// pages/popup/src/Popup.tsx

import { getSearchQueries, getUserSettings } from '@packages/supabase-client';
import React, { useEffect, useState } from 'react';
import { getCurrentUserId } from '../../chrome-extension/lib/background/auth';
import SearchResults from './components/SearchResults';
import Settings from './components/Settings';

const Popup: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [settings, setSettings] = useState(null);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePopup = async () => {
      try {
        setLoading(true);
        const currentUserId = await getCurrentUserId();
        if (!currentUserId) {
          throw new Error('User not authenticated');
        }
        setUserId(currentUserId);

        const [userSettings, userQueries] = await Promise.all([
          getUserSettings(currentUserId),
          getSearchQueries(currentUserId),
        ]);

        setSettings(userSettings);
        setQueries(userQueries);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializePopup();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">PubliEchor</h1>
      <Settings settings={settings} onUpdate={setSettings} />
      <h2 className="text-xl font-semibold mt-4 mb-2">Recent Searches</h2>
      {queries.map(query => (
        <SearchResults key={query.id} queryId={query.id} />
      ))}
    </div>
  );
};

export default Popup;

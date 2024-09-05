import React, { useState, useEffect } from 'react';
import { getUserSettings, updateUserSettings, UserSettings } from '@packages/supabase-client';

const Options: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error('User not authenticated');
        const userSettings = await getUserSettings(userId);
        setSettings(userSettings);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSettingChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;
    const { name, value } = e.target;
    const updatedSettings = { ...settings, [name]: value };
    setSettings(updatedSettings);
    try {
      await updateUserSettings(updatedSettings);
    } catch (error) {
      setError('Failed to update settings');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!settings) return <div>No settings found</div>;

  return (
    <div>
      <h1>PubliEchor Settings</h1>
      <form>
        <label>
          Default search count:
          <input
            type="number"
            name="default_search_count"
            value={settings.default_search_count}
            onChange={handleSettingChange}
          />
        </label>
        <label>
          Minimum year:
          <input type="number" name="min_year" value={settings.min_year || ''} onChange={handleSettingChange} />
        </label>
        <label>
          Maximum year:
          <input type="number" name="max_year" value={settings.max_year || ''} onChange={handleSettingChange} />
        </label>
        <label>
          Preferred languages (comma-separated):
          <input
            type="text"
            name="preferred_languages"
            value={settings.preferred_languages.join(',')}
            onChange={e =>
              handleSettingChange({
                ...e,
                target: { ...e.target, value: e.target.value.split(',') },
              })
            }
          />
        </label>
      </form>
    </div>
  );
};

export default Options;

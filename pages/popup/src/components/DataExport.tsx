// pages/popup/src/components/DataExport.tsx

import React, { useState } from 'react';
import { exportUserData } from '@packages/supabase-client';

const DataExport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');
      const data = await exportUserData(userId);

      // Convert data to CSV
      const csv = convertToCSV(data);

      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'publiechor_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleExport} disabled={loading}>
        {loading ? 'Exporting...' : 'Export Data'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

function convertToCSV(data: any): string {
  // Implement CSV conversion logic here
  // This is a placeholder implementation
  return JSON.stringify(data);
}

export default DataExport;

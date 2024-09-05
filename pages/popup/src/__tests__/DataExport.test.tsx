// pages/popup/src/__tests__/DataExport.test.tsx

import { exportUserData } from '@packages/supabase-client';
import { fireEvent, render, waitFor } from '@testing-library/react';
import DataExport from '../components/DataExport';

jest.mock('@packages/supabase-client', () => ({
  exportUserData: jest.fn(),
}));

describe('DataExport Component', () => {
  it('renders without crashing', () => {
    render(<DataExport />);
  });

  it('handles data export', async () => {
    const mockData = { queries: [], results: [] };
    (exportUserData as jest.Mock).mockResolvedValue(mockData);

    const { getByText } = render(<DataExport />);

    fireEvent.click(getByText('Export Data'));

    await waitFor(() => {
      expect(exportUserData).toHaveBeenCalled();
    });

    // You might want to add more assertions here to check if the CSV file is created and downloaded
  });

  it('displays error message on export failure', async () => {
    (exportUserData as jest.Mock).mockRejectedValue(new Error('Export failed'));

    const { getByText } = render(<DataExport />);

    fireEvent.click(getByText('Export Data'));

    await waitFor(() => {
      expect(getByText('Export failed')).toBeInTheDocument();
    });
  });
});

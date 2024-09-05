import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Settings from '../components/Settings';
import { getUserSettings, updateUserSettings } from '@packages/supabase-client';

jest.mock('@packages/supabase-client', () => ({
  getUserSettings: jest.fn(),
  updateUserSettings: jest.fn(),
}));

describe('Settings Component', () => {
  const mockSettings = {
    default_search_count: 10,
    min_year: 2000,
    max_year: 2023,
  };

  beforeEach(() => {
    (getUserSettings as jest.Mock).mockResolvedValue(mockSettings);
    (updateUserSettings as jest.Mock).mockResolvedValue(mockSettings);
  });

  it('renders user settings', async () => {
    render(<Settings />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2000')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2023')).toBeInTheDocument();
    });
  });

  it('updates settings on change', async () => {
    render(<Settings />);

    const defaultSearchCountInput = await screen.findByLabelText('Default search count:');
    fireEvent.change(defaultSearchCountInput, { target: { value: '20' } });

    await waitFor(() => {
      expect(updateUserSettings).toHaveBeenCalledWith({
        ...mockSettings,
        default_search_count: '20',
      });
    });
  });

  it('displays error message on update failure', async () => {
    (updateUserSettings as jest.Mock).mockRejectedValue(new Error('Update failed'));

    render(<Settings />);

    const defaultSearchCountInput = await screen.findByLabelText('Default search count:');
    fireEvent.change(defaultSearchCountInput, { target: { value: '20' } });

    await waitFor(() => {
      expect(screen.getByText('Error updating settings: Update failed')).toBeInTheDocument();
    });
  });
});

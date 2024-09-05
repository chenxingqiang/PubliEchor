import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Popup from '../Popup';
import { getUserSettings, getSearchQueries } from '@packages/supabase-client';

// Mock the Supabase client functions
jest.mock('@packages/supabase-client', () => ({
  getUserSettings: jest.fn(),
  getSearchQueries: jest.fn(),
}));

describe('Popup Component', () => {
  beforeEach(() => {
    (getUserSettings as jest.Mock).mockResolvedValue({
      default_search_count: 10,
      min_year: 2000,
      max_year: 2023,
    });
    (getSearchQueries as jest.Mock).mockResolvedValue([{ id: '1', query: 'test query' }]);
  });

  it('renders without crashing', async () => {
    render(<Popup />);
    await waitFor(() => {
      expect(screen.getByText('PubliEchor')).toBeInTheDocument();
    });
  });

  it('displays user settings', async () => {
    render(<Popup />);
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument(); // default_search_count
      expect(screen.getByText('2000')).toBeInTheDocument(); // min_year
      expect(screen.getByText('2023')).toBeInTheDocument(); // max_year
    });
  });

  it('displays recent searches', async () => {
    render(<Popup />);
    await waitFor(() => {
      expect(screen.getByText('Recent Searches')).toBeInTheDocument();
      expect(screen.getByText('test query')).toBeInTheDocument();
    });
  });
});

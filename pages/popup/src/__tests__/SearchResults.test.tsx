import { getSearchResults } from '@packages/supabase-client';
import { render, screen } from '@testing-library/react';
import SearchResults from '../components/SearchResults';

jest.mock('@packages/supabase-client', () => ({
  getSearchResults: jest.fn(),
}));

describe('SearchResults Component', () => {
  const mockResults = [
    {
      id: '1',
      title: 'Test Paper',
      authors: ['John Doe', 'Jane Smith'],
      published_year: 2022,
      citation_count: 10,
      url: 'https://example.com/paper1',
    },
  ];

  beforeEach(() => {
    (getSearchResults as jest.Mock).mockResolvedValue(mockResults);
  });

  it('renders search results', async () => {
    render(<SearchResults queryId="test-query-id" />);

    await screen.findByText('Test Paper');
    expect(screen.getByText('John Doe, Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Year: 2022')).toBeInTheDocument();
    expect(screen.getByText('Citations: 10')).toBeInTheDocument();
    expect(screen.getByText('View Paper')).toHaveAttribute('href', 'https://example.com/paper1');
  });

  it('displays loading state', () => {
    render(<SearchResults queryId="test-query-id" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles empty results', async () => {
    (getSearchResults as jest.Mock).mockResolvedValue([]);
    render(<SearchResults queryId="test-query-id" />);

    await screen.findByText('No results found');
  });
});

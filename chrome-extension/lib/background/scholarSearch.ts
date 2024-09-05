// chrome-extension/lib/background/scholarSearch.ts

import axios from 'axios';
import { SearchResult, UserSettings } from '@packages/supabase-client';

export async function performGoogleScholarSearch(query: string, settings: UserSettings): Promise<SearchResult[]> {
  try {
    // 注意：这里使用的是假设的第三方 API。您需要替换为实际的 API 或实现网页抓取逻辑。
    const response = await axios.get('https://api.example.com/google-scholar', {
      params: {
        q: query,
        num: settings.default_search_count,
        as_ylo: settings.min_year,
        as_yhi: settings.max_year,
      },
    });

    return response.data.map((item: any) => ({
      title: item.title,
      authors: item.authors,
      abstract: item.abstract,
      url: item.url,
      published_year: item.year,
      citation_count: item.citations,
    }));
  } catch (error) {
    console.error('Error performing Google Scholar search:', error);
    throw error;
  }
}

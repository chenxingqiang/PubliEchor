// chrome-extension/lib/background/index.ts

import { createSearchQuery, createSearchResult, getUserSettings } from '@packages/supabase-client';
import { optimizeQuery } from './queryOptimizer'; // 我们需要创建这个函数

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'addContextMenu') {
    chrome.contextMenus.create({
      id: 'scholarSearch',
      title: 'Scholar Search',
      contexts: ['selection'],
    });
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'scholarSearch') {
    chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' }, async response => {
      const selectedText = response.selectedText;
      const userId = await getCurrentUserId(); // 我们需要实现这个函数来获取当前用户ID
      const settings = await getUserSettings(userId);
      const optimizedQuery = await optimizeQuery(selectedText);

      const searchQuery = await createSearchQuery(userId, selectedText, optimizedQuery);

      // 这里我们需要实现实际的Google Scholar搜索功能
      const searchResults = await performGoogleScholarSearch(optimizedQuery, settings);

      for (const result of searchResults) {
        await createSearchResult({
          query_id: searchQuery.id,
          ...result,
        });
      }

      // 通知用户搜索完成
      chrome.tabs.sendMessage(tab.id, {
        action: 'searchComplete',
        results: searchResults,
      });
    });
  }
});

async function getCurrentUserId(): Promise<string> {
  // 实现获取当前用户ID的逻辑
  // 这可能涉及检查存储的身份验证令牌或其他用户标识符
}

async function performGoogleScholarSearch(query: string, settings: any): Promise<any[]> {
  // 实现Google Scholar搜索逻辑
  // 这可能涉及使用第三方API或直接抓取Google Scholar页面
}

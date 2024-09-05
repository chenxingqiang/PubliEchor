// chrome-extension/manifest.js

import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'PubliEchor',
  version: '1.0.0',
  description: 'A Chrome extension for enhanced Google Scholar searches with author network visualization',
  permissions: ['storage', 'contextMenus', 'activeTab', 'https://scholar.google.com/*', 'identity', 'tabs'],
  host_permissions: [
    'https://scholar.google.com/*',
    'https://*.supabase.co/*', // 添加 Supabase 域名
  ],
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  action: {
    default_popup: 'src/popup/index.html',
    default_icon: {
      16: 'images/icon-16.png',
      32: 'images/icon-32.png',
      48: 'images/icon-48.png',
      128: 'images/icon-128.png',
    },
  },
  icons: {
    16: 'images/icon-16.png',
    32: 'images/icon-32.png',
    48: 'images/icon-48.png',
    128: 'images/icon-128.png',
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content/index.ts'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['images/*'],
      matches: ['<all_urls>'],
    },
  ],
  options_page: 'src/options/index.html', // 添加选项页面
  chrome_url_overrides: {
    newtab: 'src/author-network/index.html', // 添加作者网络页面作为新标签页
  },
});

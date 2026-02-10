import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.ykmon.top',
  integrations: [tailwind(), sitemap()],
  output: 'static',
  // 允许 URL 带或不带斜杠都可以访问
  trailingSlash: 'ignore',
  markdown: {
    shikiConfig: {
      // 使用 One Dark Pro 主题，与之前 Highlight.js 的 atom-one-dark 风格一致
      theme: 'one-dark-pro',
      // 自动换行，避免长代码行溢出
      wrap: true,
    },
  },
});

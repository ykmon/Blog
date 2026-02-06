import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.ykmon.top',
  integrations: [tailwind(), sitemap()],
  output: 'static',
  // 允许 URL 带或不带斜杠都可以访问
  trailingSlash: 'ignore',
});

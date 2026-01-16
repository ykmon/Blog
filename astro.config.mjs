import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  // 允许 URL 带或不带斜杠都可以访问
  trailingSlash: 'ignore',
});

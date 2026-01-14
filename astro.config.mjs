import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  // 保持与原有 URL 结构一致
  trailingSlash: 'always',
});

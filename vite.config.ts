import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative base so the build works unmodified from a GitHub Pages project
  // page (https://<user>.github.io/<repo>/) regardless of the repo name, and
  // from a custom domain or subpath too. Safe here because routing is
  // hash-based — the browser only ever requests index.html.
  base: './',
  plugins: [react()],
});

import { defineConfig } from 'vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

const defaultPort = 4100;
const parsedPort = Number(process.env['PORT'] ?? defaultPort);
const isValidPort = Number.isInteger(parsedPort) && parsedPort >= 1 && parsedPort <= 65535;

export default defineConfig({
  server: {
    port: isValidPort ? parsedPort : defaultPort,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    tsconfigPaths: true,
  },
  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      // Split each route into its own chunk so the app doesn't ship one
      // monolithic bundle (and Vite stops warning about chunk size).
      autoCodeSplitting: true,
    }),
    tailwindcss(),
    react(),
  ],
});

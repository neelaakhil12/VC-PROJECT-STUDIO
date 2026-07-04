import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Custom local dev API simulation plugin for serverless Node.js functions
const apiPlugin = () => ({
  name: 'api-plugin',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url === '/api/send-reset-email' && req.method === 'POST') {
        try {
          // Read request body stream
          let body = '';
          req.on('data', (chunk: any) => { body += chunk.toString(); });
          await new Promise((resolve) => req.on('end', resolve));
          
          const parsedBody = body ? JSON.parse(body) : {};
          req.body = parsedBody;

          // Mock Express response object
          const expressRes = {
            status(code: number) {
              res.statusCode = code;
              return this;
            },
            json(data: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return this;
            },
            setHeader(name: string, value: string) {
              res.setHeader(name, value);
              return this;
            },
            end() {
              res.end();
              return this;
            }
          };

          // Load serverless function file
          const apiPath = path.resolve(__dirname, 'api/send-reset-email.cjs');
          
          // Clear require cache for hot-reload support
          delete require.cache[require.resolve(apiPath)];
          const handler = require(apiPath);
          
          await handler(req, expressRes);
        } catch (error: any) {
          console.error('Dev Server API plugin error:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message || 'Internal server error' }));
        }
        return;
      }

      if (req.url === '/api/keep-alive' && req.method === 'GET') {
        try {
          const expressRes = {
            status(code: number) { res.statusCode = code; return this; },
            json(data: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return this;
            },
            setHeader(name: string, value: string) { res.setHeader(name, value); return this; },
            end() { res.end(); return this; }
          };
          const apiPath = path.resolve(__dirname, 'api/keep-alive.cjs');
          delete require.cache[require.resolve(apiPath)];
          const handler = require(apiPath);
          await handler(req, expressRes);
        } catch (error: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message || 'Internal server error' }));
        }
        return;
      }

      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      tailwindcss(),
      apiPlugin(),
    ],
  };
})

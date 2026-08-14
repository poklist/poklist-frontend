import { createMockServer } from './server';

const port = Number(process.env.MOCK_API_PORT ?? 4000);
createMockServer().listen(port, () => {
  console.log(`[mock-api] listening on http://localhost:${port}`);
});

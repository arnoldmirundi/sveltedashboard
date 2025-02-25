import fs from 'fs';
import path from 'path';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const reportsDir = path.resolve('static/reports');

  try {
    const files = fs.readdirSync(reportsDir)
      .filter(file => file.endsWith('.csv'))
      .map(file => ({ id: file.replace('.csv', ''), name: file })); 

    return new Response(JSON.stringify(files), { status: 200 });
  } catch (error) {
    console.error('Error reading reports:', error);
    return new Response(JSON.stringify({ error: 'Failed to load reports' }), { status: 500 });
  }
};

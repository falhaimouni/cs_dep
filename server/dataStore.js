import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(rootDir, 'src', 'data');

const cache = new Map();

export async function readJsonData(fileName) {
  if (!cache.has(fileName)) {
    const filePath = path.join(dataDir, fileName);
    const content = await readFile(filePath, 'utf8');
    cache.set(fileName, JSON.parse(content));
  }
  return cache.get(fileName);
}

export function clearDataCache() {
  cache.clear();
}

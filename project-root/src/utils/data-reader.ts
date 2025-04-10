import fs from 'fs';
import path from 'path';

export class JsonFileReader {
  readFile(filePath: string): any {
    try {
      const resolvedPath = path.resolve(filePath);
      const raw = fs.readFileSync(resolvedPath, 'utf-8');
      const data = JSON.parse(raw);
      return data;
    } catch (err) {
      throw err;
    }
  }
}

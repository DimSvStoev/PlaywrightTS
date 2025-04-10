import path from 'path';
import { JsonFileReader } from '../utils/data-reader';

export class BooksApi {
  private readonly fileReader = new JsonFileReader();
  private static readonly BOOKS_FILE = path.resolve(__dirname, '../test-data/books.json');

  loadBooks(): any[] {
    const books = this.fileReader.readFile(BooksApi.BOOKS_FILE);
    return books;
  }

  generateBookPayload(overrideData: any = {}): any {
    return {
      id: overrideData.id ?? Math.floor(Math.random() * 10),
      title: overrideData.title ?? 'Test Book',
      description: overrideData.description ?? 'Auto-generated book',
      pageCount: overrideData.pageCount ?? 100,
      excerpt: overrideData.excerpt ?? 'Excerpt...',
      publishDate: overrideData.publishDate ?? new Date().toISOString(),
    };
  }
}

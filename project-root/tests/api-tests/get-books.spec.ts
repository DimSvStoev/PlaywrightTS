import { test, expect } from '@playwright/test';
import { BaseApi } from '../../src/api/base-api';
import { BooksApi } from '../../src/api/books-api';
import { Endpoint, Method } from '../../src/constants/api-const';

const endpoint = Endpoint.BOOKS;

test.describe(`Endpoint /${endpoint}`, () => {

  // GET all books
  test.describe(`${Method.GET} all ${endpoint}`, () => {
    let api: BaseApi;
    let response;
    let raw: string;
    let data: any;

    test.beforeAll(async () => {

    
      api = new BaseApi();
    
      await api.initContext();

    
      const config = api.buildRequestConfiguration(Method.GET, endpoint);
      console.log('⚙️ Config:', config);
    
      response = await api.sendRequest(config);
      data = await response.json(); // 🔥 важно!
      console.log('⚙️ response:', response,data);
    });    

    test('has 200 response code', async () => {
      expect(response.status()).toBe(200);
    });

    test('has response data as a non-empty array', async () => {
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });
  });

  //GET book by ID
  test.describe(`${Method.GET} ${endpoint} by ID`, () => {
    let api: BaseApi;
    let repository: BooksApi;
    let response;
    let existingBook;

    test.beforeAll(async () => {
      api = new BaseApi();
      await api.initContext();

      repository = new BooksApi();
      const books = repository.loadBooks();
      expect(books.length).toBeGreaterThan(0);
      existingBook = books[0];

      const config = api.buildRequestConfiguration(Method.GET, endpoint, { id: existingBook.id });
      response = await api.sendRequest(config);
    });

    test('has 200 response code', async () => {
      expect(response.status()).toBe(200);
    });

    test('has all fields matching existing book', async () => {
      const data = await response.json();
      for (const key of Object.keys(existingBook)) {
        if (key === 'id' || key==='title') {; // После може да направя датата да се подава динамично в джейсъна
        expect(data[key]).toBe(existingBook[key]);
        }
        const actualKeys = Object.keys(data).sort();
        const expectedKeys = Object.keys(existingBook).sort();
      
        expect(actualKeys).toEqual(expectedKeys);
      }
    });
  });

  // GET book by non-existing ID
  test.describe(`${Method.GET} ${endpoint} by non-existing ID`, () => {
    let api: BaseApi;
    let response;

    test.beforeAll(async () => {
      api = new BaseApi();
      await api.initContext();

      const config = api.buildRequestConfiguration(Method.GET, endpoint, { id: -999 });
      response = await api.sendRequest(config);
    });

    test('has 404 response code', async () => {
      expect(response.status()).toBe(404);
    });
  });

  // POST create new book
  test.describe(`${Method.POST} ${endpoint}`, () => {
    let api: BaseApi;
    let repository: BooksApi;
    let response;
    let payload;
    let data;

    test.beforeAll(async () => {
      api = new BaseApi();
      await api.initContext();

      repository = new BooksApi();
      payload = repository.generateBookPayload();
      console.log('📦 Payload:\n', JSON.stringify(payload, null, 2));
      const config = api.buildRequestConfiguration(Method.POST, endpoint, { payload });
      response = await api.sendRequest(config);
      data = await response.json();
    });

    test('has 200 response code', async () => {
      expect(response.status()).toBe(200);
    });

    test('has response data with valid id', async () => {
      expect(data.id).toBeGreaterThan(0);
    });

    test('has response data matching payload', async () => {
      for (const key of Object.keys(payload)) {
        expect(data[key]).toBe(payload[key]);
      }
    });
  });

  // PUT update existing book
  test.describe(`${Method.PUT} ${endpoint} by ID`, () => {
    let api: BaseApi;
    let repository: BooksApi;
    let response;
    let updatedPayload;

    test.beforeAll(async () => {
      api = new BaseApi();
      await api.initContext();

      repository = new BooksApi();
      const existingBook = repository.loadBooks()[0];

      updatedPayload = repository.generateBookPayload({
        id: existingBook.id,
        title: 'Updated Title'
      });

      const config = api.buildRequestConfiguration(Method.PUT, endpoint, {
        id: existingBook.id,
        payload: updatedPayload
      });

      response = await api.sendRequest(config);
    });

    test('has 200 response code', async () => {
      expect(response.status()).toBe(200);
    });

    test('has updated title in response', async () => {
      const data = await response.json();
      expect(data.title).toBe(updatedPayload.title);
    });
  });

  // DELETE book by ID
  test.describe(`${Method.DELETE} ${endpoint} by ID`, () => {
    let api: BaseApi;
    let repository: BooksApi;
    let response;
    let createdBookId;

    test.beforeAll(async () => {
      api = new BaseApi();
      await api.initContext();

      repository = new BooksApi();
      const bookToDelete = repository.generateBookPayload();

      const postConfig = api.buildRequestConfiguration(Method.POST, endpoint, { payload: bookToDelete });
      const postResponse = await api.sendRequest(postConfig);
      const createdBook = await postResponse.json();
      createdBookId = createdBook.id;

      const deleteConfig = api.buildRequestConfiguration(Method.DELETE, endpoint, { id: createdBookId });
      response = await api.sendRequest(deleteConfig);
    });

    test('has 200 response code', async () => {
      expect(response.status()).toBe(200);
    });

    test('book is no longer retrievable', async () => {
      const getConfig = api.buildRequestConfiguration(Method.GET, endpoint, { id: createdBookId });
      const getResponse = await api.sendRequest(getConfig);
      expect(getResponse.status()).toBe(404);
    });
  });
});
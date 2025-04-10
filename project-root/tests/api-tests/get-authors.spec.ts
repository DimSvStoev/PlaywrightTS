import { test, expect, request, APIResponse } from '@playwright/test';

test.describe('GET request to authors',()=>{
let response: APIResponse;

test.beforeAll(async ({playwright}) => {
    const apiContext = await request.newContext();
    response = await apiContext.get('https://fakerestapi.azurewebsites.net/api/v1/Authors');
});

test('Should return status 200', async()=>{
    expect(response.status()).toBe(200);
})
test('should return a non-empty array', async () => {
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
});

test.describe('GET /authors/:id', () => {
  let response;
  const authorId = 1;
  const expectedAuthor = {
    id: 1,
    idBook: 1,
    firstName: 'First Name 1',
    lastName: 'Last Name 1'
  };

  test.beforeAll(async () => {
    const apiContext = await request.newContext();
    response = await apiContext.get(`https://fakerestapi.azurewebsites.net/api/v1/Authors/${authorId}`);
  });

  test('should return status 200', async () => {
    expect(response.status()).toBe(200);
  });

  test('should return the correct author', async () => {
    const data = await response.json();
    expect(data).toBeTruthy();
    for (const key in expectedAuthor) {
      expect(data[key]).toBe(expectedAuthor[key]);
    }
  });
});
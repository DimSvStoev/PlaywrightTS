import * as allure from 'allure-js-commons';
import { APIRequestContext, APIResponse, request } from '@playwright/test';
import { Method } from '../constants/api-const';
import { JsonFileReader } from '../utils/data-reader';
import path from 'path';
import { AppSettings, ApiService } from '../config/app-settings';

interface ConfigurationParameters {
  id?: number | string;
  headers?: Record<string, string>;
  payload?: any;
}

export interface RequestConfiguration {
  method: string;
  url: string;
  data?: any;
  headers?: Record<string, string>;
}

export class BaseApi {
  private static readonly SETTINGS_FILE = path.resolve(__dirname, '../../../appSettings.json');
  private readonly fileReader = new JsonFileReader();
  private readonly baseApiUrl: string;
  private context!: APIRequestContext;

  constructor() {
    const settings = this.fileReader.readFile(BaseApi.SETTINGS_FILE) as AppSettings;
    this.baseApiUrl = settings.baseUrls[ApiService.BaseApiUrl];
  }

  async initContext(): Promise<void> {
    this.context = await request.newContext();
  }

  buildRequestConfiguration(
    method: Method,
    endpoint: string,
    parameters: ConfigurationParameters = {}
  ): RequestConfiguration {
    
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = parameters.id ? `${cleanEndpoint}/${parameters.id}` : cleanEndpoint;

    return {
      method,
      url,
      data: parameters.payload,
      headers: parameters.headers ?? {
        'Content-Type': 'application/json; charset=utf-8'
      }
    };
  }

  async sendRequest(config: RequestConfiguration): Promise<APIResponse> {
    return await allure.step(`📤 Sending ${config.method} request to: ${config.url}`, async (step) => {
      if (!this.context) {
        throw new Error('❌ API context is not initialized. Call initContext() first.');
      }
  
      const fullUrl = `${this.baseApiUrl}/${config.url}`.replace(/([^:]\/)\/+/g, '$1');
      const headers = config.headers ?? { 'Content-Type': 'application/json' };
      const method = config.method.toUpperCase();
      const data = config.data;
  
      const options: any = {
        headers,
        ...(data && { data })
      };
  
      const methodFunction = (this.context as any)[method.toLowerCase()].bind(this.context);
  
      const response: APIResponse = await methodFunction(fullUrl, options);
      // с Fetch не работи, защото не поддържа json
      // const response = await this.context.fetch(fullUrl, {
      //   method: config.method,
      //   headers: config.headers,
      //   body: config.data ? JSON.stringify(config.data) : undefined
      // });


      const responseBody = await response.text();
  
      step.parameter('Response Status', response.status().toString());
      step.parameter('Response Data', responseBody);
  
      return response;
    });
  }
}

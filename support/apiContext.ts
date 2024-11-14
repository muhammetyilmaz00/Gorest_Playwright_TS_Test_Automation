import { APIRequestContext, request, APIResponse } from 'playwright';
import { configurations } from '../configurations';
import { variables } from './variables';

export interface RequestOptions {
  baseURL?: string;
  extraHTTPHeaders?: Record<string, string>;
}

export const URLS = {
  BASE_URL: 'https://gorest.co.in/public/v2/',
  USERS: 'users/'
};

interface Headers {
  "Content-Type": string;
  "Accept": string;
  [key: string]: string; // Allows for additional headers
}

const headers: Headers = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": `Bearer ${configurations.token}`
};

const unAuthorizedHeaders: Headers = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": "Bearer 123"
};

export let apiResponse: APIResponse;

export class APIContext {
  private apiRequestContext!: APIRequestContext;

  constructor(isAuthorized: boolean) {
    this.initRequestContext(isAuthorized);
  }

  private async initRequestContext(isAuthorized: boolean) {
    const options: RequestOptions = {
      baseURL: URLS.BASE_URL,
      extraHTTPHeaders: isAuthorized ? headers : unAuthorizedHeaders,
    };
    this.apiRequestContext = await request.newContext(options);
  }

  private async logRequest(method: string, endpoint: string, data?: any) {
    if (variables.logRequests) {
      console.log(`Request: ${method} ${endpoint}`, data ? `| data: ${JSON.stringify(data)}` : '');
    }
  }

  private async logResponse(apiResponse: APIResponse) {
    if (variables.logResponses) {
      const statusCode = apiResponse.status();
      const body = await apiResponse.text();
      console.log(`Response: statusCode = ${statusCode} | body = ${body}`);
    }
  }

  private async handleRequest(method: string, endpoint: string, data?: any) {
    await this.logRequest(method, endpoint, data);
    try {
      switch (method) {
        case 'GET':
          apiResponse = await this.apiRequestContext.get(endpoint);
          break;
        case 'POST':
          apiResponse = await this.apiRequestContext.post(endpoint, { data });
          break;
        case 'PUT':
          apiResponse = await this.apiRequestContext.put(endpoint, { data: data || '' });
          break;
        case 'PATCH':
          apiResponse = await this.apiRequestContext.patch(endpoint, { data: data || '' });
          break;
        case 'DELETE':
          apiResponse = await this.apiRequestContext.delete(endpoint);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
      await this.logResponse(apiResponse);
    } catch (error) {
      console.error(`Error during ${method} request to ${endpoint}:`, error);
    }
  }

  async get(endpoint: string) {
    await this.handleRequest('GET', endpoint);
  }

  async post(endpoint: string, data: Record<string, unknown>) {
    await this.handleRequest('POST', endpoint, data);
  }

  async put(endpoint: string, data?: Record<string, unknown>) {
    await this.handleRequest('PUT', endpoint, data);
  }

  async patch(endpoint: string, data?: Record<string, unknown>) {
    await this.handleRequest('PATCH', endpoint, data);
  }

  async delete(endpoint: string) {
    await this.handleRequest('DELETE', endpoint);
  }
}

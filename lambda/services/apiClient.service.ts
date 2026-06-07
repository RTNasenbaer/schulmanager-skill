/**
 * API Client Service
 * Kommuniziert mit dem Backend API Service
 */

import axios, { AxiosInstance } from 'axios';
import { getRuntimeConfig } from '../utils/runtimeConfig';

const runtimeConfig = getRuntimeConfig();

class ApiClient {
  private client: AxiosInstance;
  private maxRetries = 2;
  private retryDelay = 3000; // 3 seconds

  constructor() {
    this.client = axios.create({
      baseURL: runtimeConfig.backendApiUrl,
      timeout: 30000, // Increased for Render cold starts
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': runtimeConfig.apiKey,
      },
    });

    // Add response interceptor to detect HTML responses
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Check if we got HTML instead of JSON (Render sleep/redirect page)
        if (error.response?.data && typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
          console.warn('Backend returned HTML (likely sleeping on Render.com)');
          return Promise.reject(new Error('BACKEND_SLEEPING'));
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Retry logic for cold start scenarios
   */
  private async makeRequestWithRetry<T>(requestFn: () => Promise<T>, retryCount = 0): Promise<T> {
    try {
      return await requestFn();
    } catch (error: any) {
      const isLastRetry = retryCount >= this.maxRetries;
      const isRetryableError = error.message === 'BACKEND_SLEEPING' || 
                               error.code === 'ECONNABORTED' || 
                               error.code === 'ETIMEDOUT';

      if (isRetryableError && !isLastRetry) {
        console.log(`Retry ${retryCount + 1}/${this.maxRetries} after ${this.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.makeRequestWithRetry(requestFn, retryCount + 1);
      }

      throw error;
    }
  }

  /**
   * Stundenplan für heute abrufen
   */
  async getTodayTimetable(userId: string) {
    return this.makeRequestWithRetry(async () => {
      try {
        const response = await this.client.get('/timetable/today', this.buildUserHeaders(userId));
        return response.data.data;
      } catch (error) {
        console.error('API Error (getTodayTimetable):', error);
        throw error;
      }
    });
  }

  /**
   * Stundenplan für morgen abrufen
   */
  async getTomorrowTimetable(userId: string) {
    try {
      const response = await this.client.get('/timetable/tomorrow', this.buildUserHeaders(userId));
      return response.data.data;
    } catch (error) {
      console.error('API Error (getTomorrowTimetable):', error);
      throw error;
    }
  }

  /**
   * Vertretungen für heute abrufen
   */
  async getTodaySubstitutions(userId: string) {
    try {
      const response = await this.client.get('/substitutions/today', this.buildUserHeaders(userId));
      return response.data.data;
    } catch (error) {
      console.error('API Error (getTodaySubstitutions):', error);
      throw error;
    }
  }

  /**
   * Ausgefallene Stunden für heute abrufen
   */
  async getTodayCancelled(userId: string) {
    try {
      const response = await this.client.get('/cancelled/today', this.buildUserHeaders(userId));
      return response.data;
    } catch (error) {
      console.error('API Error (getTodayCancelled):', error);
      throw error;
    }
  }

  /**
   * Stundenplan für die Woche abrufen
   */
  async getWeekTimetable(userId: string) {
    try {
      const response = await this.client.get('/timetable/week', this.buildUserHeaders(userId));
      return response.data.data;
    } catch (error) {
      console.error('API Error (getWeekTimetable):', error);
      throw error;
    }
  }

  /**
   * Stundenplan für bestimmtes Datum abrufen
   */
  async getTimetableByDate(userId: string, date: string) {
    try {
      const response = await this.client.get(`/timetable/date/${date}`, this.buildUserHeaders(userId));
      return response.data.data;
    } catch (error) {
      console.error('API Error (getTimetableByDate):', error);
      throw error;
    }
  }

  /**
   * Vertretungen für morgen abrufen
   */
  async getTomorrowSubstitutions(userId: string) {
    try {
      const response = await this.client.get('/substitutions/tomorrow', this.buildUserHeaders(userId));
      return response.data.data;
    } catch (error) {
      console.error('API Error (getTomorrowSubstitutions):', error);
      throw error;
    }
  }

  /**
   * Vertretungen für bestimmtes Datum abrufen
   */
  async getSubstitutionsByDate(userId: string, date: string) {
    try {
      const response = await this.client.get(`/substitutions/date/${date}`, this.buildUserHeaders(userId));
      return response.data.data;
    } catch (error) {
      console.error('API Error (getSubstitutionsByDate):', error);
      throw error;
    }
  }

  /**
   * Ausgefallene Stunden für morgen abrufen
   */
  async getTomorrowCancelled(userId: string) {
    try {
      const response = await this.client.get('/cancelled/tomorrow', this.buildUserHeaders(userId));
      return response.data.data;
    } catch (error) {
      console.error('API Error (getTomorrowCancelled):', error);
      throw error;
    }
  }

  /**
   * Ausgefallene Stunden für die Woche abrufen
   */
  async getWeekCancelled(userId: string) {
    try {
      const response = await this.client.get('/cancelled/week', this.buildUserHeaders(userId));
      return response.data.data;
    } catch (error) {
      console.error('API Error (getWeekCancelled):', error);
      throw error;
    }
  }

  /**
   * Ausgefallene Stunden für bestimmtes Datum abrufen
   */
  async getCancelledByDate(userId: string, date: string) {
    try {
      const response = await this.client.get(`/cancelled/date/${date}`, this.buildUserHeaders(userId));
      return response.data.data;
    } catch (error) {
      console.error('API Error (getCancelledByDate):', error);
      throw error;
    }
  }

  private buildUserHeaders(userId: string) {
    return {
      headers: {
        'X-User-Id': userId,
      },
    };
  }
}

export const apiClient = new ApiClient();

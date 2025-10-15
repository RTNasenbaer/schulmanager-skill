/**
 * API Client Service
 * Kommuniziert mit dem Backend API Service
 */

import axios, { AxiosInstance } from 'axios';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000/api';
const API_KEY = process.env.API_KEY || '';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BACKEND_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
    });
  }

  /**
   * Stundenplan für heute abrufen
   */
  async getTodayTimetable(userId: string) {
    try {
      const response = await this.client.get('/timetable/today', {
        headers: { 'X-User-Id': userId },
      });
      return response.data.data;
    } catch (error) {
      console.error('API Error (getTodayTimetable):', error);
      throw error;
    }
  }

  /**
   * Stundenplan für morgen abrufen
   */
  async getTomorrowTimetable(userId: string) {
    try {
      const response = await this.client.get('/timetable/tomorrow', {
        headers: { 'X-User-Id': userId },
      });
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
      const response = await this.client.get('/substitutions/today', {
        headers: { 'X-User-Id': userId },
      });
      return response.data.data;
    } catch (error) {
      console.error('API Error (getTodaySubstitutions):', error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();

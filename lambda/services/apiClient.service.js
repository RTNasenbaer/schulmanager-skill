"use strict";
/**
 * API Client Service
 * Kommuniziert mit dem Backend API Service
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = void 0;
const axios_1 = __importDefault(require("axios"));
// Production backend configuration
const BACKEND_API_URL = 'https://schulmanager-backend-api.onrender.com/api';
const API_KEY = process.env.API_KEY || 'nVDlr2QzHS7qZN4sjo8mfBGpEXxvIyKP';
class ApiClient {
    client;
    constructor() {
        this.client = axios_1.default.create({
            baseURL: BACKEND_API_URL,
            timeout: 30000, // Increased for Render cold starts
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY,
            },
        });
    }
    /**
     * Stundenplan für heute abrufen
     */
    async getTodayTimetable(userId) {
        try {
            const response = await this.client.get('/timetable/today', {
                headers: { 'X-User-Id': userId },
            });
            return response.data.data;
        }
        catch (error) {
            console.error('API Error (getTodayTimetable):', error);
            throw error;
        }
    }
    /**
     * Stundenplan für morgen abrufen
     */
    async getTomorrowTimetable(userId) {
        try {
            const response = await this.client.get('/timetable/tomorrow', {
                headers: { 'X-User-Id': userId },
            });
            return response.data.data;
        }
        catch (error) {
            console.error('API Error (getTomorrowTimetable):', error);
            throw error;
        }
    }
    /**
     * Vertretungen für heute abrufen
     */
    async getTodaySubstitutions(userId) {
        try {
            const response = await this.client.get('/substitutions/today', {
                headers: { 'X-User-Id': userId },
            });
            return response.data.data;
        }
        catch (error) {
            console.error('API Error (getTodaySubstitutions):', error);
            throw error;
        }
    }
    /**
     * Ausgefallene Stunden für heute abrufen
     */
    async getTodayCancelled(userId) {
        try {
            const response = await this.client.get('/cancelled/today', {
                headers: { 'X-User-Id': userId },
            });
            return response.data;
        }
        catch (error) {
            console.error('API Error (getTodayCancelled):', error);
            throw error;
        }
    }
    /**
     * Stundenplan für die Woche abrufen
     */
    async getWeekTimetable(userId) {
        try {
            const response = await this.client.get('/timetable/week', {
                headers: { 'X-User-Id': userId },
            });
            return response.data.data;
        }
        catch (error) {
            console.error('API Error (getWeekTimetable):', error);
            throw error;
        }
    }
    /**
     * Stundenplan für bestimmtes Datum abrufen
     */
    async getTimetableByDate(userId, date) {
        try {
            const response = await this.client.get(`/timetable/date/${date}`, {
                headers: { 'X-User-Id': userId },
            });
            return response.data.data;
        }
        catch (error) {
            console.error('API Error (getTimetableByDate):', error);
            throw error;
        }
    }
    /**
     * Vertretungen für morgen abrufen
     */
    async getTomorrowSubstitutions(userId) {
        try {
            const response = await this.client.get('/substitutions/tomorrow', {
                headers: { 'X-User-Id': userId },
            });
            return response.data.data;
        }
        catch (error) {
            console.error('API Error (getTomorrowSubstitutions):', error);
            throw error;
        }
    }
    /**
     * Vertretungen für bestimmtes Datum abrufen
     */
    async getSubstitutionsByDate(userId, date) {
        try {
            const response = await this.client.get(`/substitutions/date/${date}`, {
                headers: { 'X-User-Id': userId },
            });
            return response.data.data;
        }
        catch (error) {
            console.error('API Error (getSubstitutionsByDate):', error);
            throw error;
        }
    }
    /**
     * Ausgefallene Stunden für morgen abrufen
     */
    async getTomorrowCancelled(userId) {
        try {
            const response = await this.client.get('/cancelled/tomorrow', {
                headers: { 'X-User-Id': userId },
            });
            return response.data.data;
        }
        catch (error) {
            console.error('API Error (getTomorrowCancelled):', error);
            throw error;
        }
    }
    /**
     * Ausgefallene Stunden für die Woche abrufen
     */
    async getWeekCancelled(userId) {
        try {
            const response = await this.client.get('/cancelled/week', {
                headers: { 'X-User-Id': userId },
            });
            return response.data.data;
        }
        catch (error) {
            console.error('API Error (getWeekCancelled):', error);
            throw error;
        }
    }
    /**
     * Ausgefallene Stunden für bestimmtes Datum abrufen
     */
    async getCancelledByDate(userId, date) {
        try {
            const response = await this.client.get(`/cancelled/date/${date}`, {
                headers: { 'X-User-Id': userId },
            });
            return response.data.data;
        }
        catch (error) {
            console.error('API Error (getCancelledByDate):', error);
            throw error;
        }
    }
}
exports.apiClient = new ApiClient();

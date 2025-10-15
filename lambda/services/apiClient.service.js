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
const API_KEY = process.env.API_KEY || 'dev-test-key-change-in-production';
class ApiClient {
    client;
    constructor() {
        this.client = axios_1.default.create({
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
}
exports.apiClient = new ApiClient();
//# sourceMappingURL=apiClient.service.js.map
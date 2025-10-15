/**
 * API Client Service
 * Kommuniziert mit dem Backend API Service
 */
declare class ApiClient {
    private client;
    constructor();
    /**
     * Stundenplan für heute abrufen
     */
    getTodayTimetable(userId: string): Promise<any>;
    /**
     * Stundenplan für morgen abrufen
     */
    getTomorrowTimetable(userId: string): Promise<any>;
    /**
     * Vertretungen für heute abrufen
     */
    getTodaySubstitutions(userId: string): Promise<any>;
}
export declare const apiClient: ApiClient;
export {};

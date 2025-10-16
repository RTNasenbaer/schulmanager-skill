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
    /**
     * Ausgefallene Stunden für heute abrufen
     */
    getTodayCancelled(userId: string): Promise<any>;
    /**
     * Stundenplan für die Woche abrufen
     */
    getWeekTimetable(userId: string): Promise<any>;
    /**
     * Stundenplan für bestimmtes Datum abrufen
     */
    getTimetableByDate(userId: string, date: string): Promise<any>;
    /**
     * Vertretungen für morgen abrufen
     */
    getTomorrowSubstitutions(userId: string): Promise<any>;
    /**
     * Vertretungen für bestimmtes Datum abrufen
     */
    getSubstitutionsByDate(userId: string, date: string): Promise<any>;
    /**
     * Ausgefallene Stunden für morgen abrufen
     */
    getTomorrowCancelled(userId: string): Promise<any>;
    /**
     * Ausgefallene Stunden für die Woche abrufen
     */
    getWeekCancelled(userId: string): Promise<any>;
    /**
     * Ausgefallene Stunden für bestimmtes Datum abrufen
     */
    getCancelledByDate(userId: string, date: string): Promise<any>;
}
export declare const apiClient: ApiClient;
export {};

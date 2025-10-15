/**
 * Time Helper Utilities
 * Hilfsfunktionen für Zeit-Operationen
 */
interface Lesson {
    subject: string;
    teacher: string;
    room: string;
    startTime: string;
    endTime: string;
    lessonNumber: number;
    date: string;
    isCancelled: boolean;
}
/**
 * Findet die nächste anstehende Stunde
 */
export declare function findNextLesson(lessons: Lesson[]): Lesson | null;
/**
 * Formatiert Zeit für Sprachausgabe
 */
export declare function formatTimeForSpeech(time: string): string;
/**
 * Prüft ob eine Zeit in der Vergangenheit liegt
 */
export declare function isTimePast(time: string): boolean;
export {};

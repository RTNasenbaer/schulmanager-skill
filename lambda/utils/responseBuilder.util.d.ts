/**
 * Response Builder Utilities
 * Formatiert Daten für Alexa Sprachausgabe
 */
interface Lesson {
    subject: string;
    teacher: string;
    room: string;
    startTime: string;
    lessonNumber: number;
    isCancelled: boolean;
}
interface Substitution {
    lessonNumber: number;
    originalSubject: string;
    originalTeacher?: string;
    substituteTeacher?: string;
    isCancelled: boolean;
    note?: string;
}
/**
 * Formatiert Lessons für Sprachausgabe
 */
export declare function formatLessonsForSpeech(lessons: Lesson[], day?: string): string;
/**
 * Formatiert Substitutions für Sprachausgabe
 */
export declare function formatSubstitutionsForSpeech(substitutions: Substitution[]): string;
export {};

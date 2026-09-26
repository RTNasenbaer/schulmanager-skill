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
  isSubstitution?: boolean;
}

/**
 * Findet die nächste anstehende Stunde
 */
export function findNextLesson(lessons: Lesson[]): Lesson | null {
  if (!lessons || lessons.length === 0) {
    return null;
  }

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  // Filtere abgesagte Stunden aus
  const activeLessons = lessons.filter(l => !l.isCancelled);

  // Finde erste Stunde die noch nicht begonnen hat
  const upcomingLessons = activeLessons.filter(l => l.startTime > currentTime);

  if (upcomingLessons.length === 0) {
    return null;
  }

  // Sortiere nach Startzeit und nimm die erste
  upcomingLessons.sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  return upcomingLessons[0];
}

/**
 * Formatiert Zeit für Sprachausgabe
 */
export function formatTimeForSpeech(time: string): string {
  const [hours, minutes] = time.split(':');
  
  if (minutes === '00') {
    return `${parseInt(hours)} Uhr`;
  }
  
  return `${parseInt(hours)} Uhr ${parseInt(minutes)}`;
}

/**
 * Prüft ob eine Zeit in der Vergangenheit liegt
 */
export function isTimePast(time: string): boolean {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  return time < currentTime;
}

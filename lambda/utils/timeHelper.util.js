"use strict";
/**
 * Time Helper Utilities
 * Hilfsfunktionen für Zeit-Operationen
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNextLesson = findNextLesson;
exports.formatTimeForSpeech = formatTimeForSpeech;
exports.isTimePast = isTimePast;
/**
 * Findet die nächste anstehende Stunde
 */
function findNextLesson(lessons) {
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
function formatTimeForSpeech(time) {
    const [hours, minutes] = time.split(':');
    if (minutes === '00') {
        return `${parseInt(hours)} Uhr`;
    }
    return `${parseInt(hours)} Uhr ${parseInt(minutes)}`;
}
/**
 * Prüft ob eine Zeit in der Vergangenheit liegt
 */
function isTimePast(time) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return time < currentTime;
}
//# sourceMappingURL=timeHelper.util.js.map
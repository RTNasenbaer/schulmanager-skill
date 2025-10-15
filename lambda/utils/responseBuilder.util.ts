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
export function formatLessonsForSpeech(lessons: Lesson[], day: string = 'heute'): string {
  if (!lessons || lessons.length === 0) {
    return `Für ${day} sind keine Stunden eingetragen.`;
  }

  const activeLessons = lessons.filter(l => !l.isCancelled);
  
  if (activeLessons.length === 0) {
    return `Alle Stunden fallen ${day} aus.`;
  }

  let speech = `Du hast ${day} ${activeLessons.length} ${activeLessons.length === 1 ? 'Stunde' : 'Stunden'}. `;

  activeLessons.forEach((lesson, index) => {
    if (index > 0) {
      speech += ', ';
    }
    if (index === activeLessons.length - 1 && activeLessons.length > 1) {
      speech += 'und ';
    }

    speech += `um ${lesson.startTime} Uhr ${lesson.subject} bei ${lesson.teacher}`;
    
    if (lesson.room && lesson.room !== 'N/A') {
      speech += ` in Raum ${lesson.room}`;
    }
  });

  return speech + '.';
}

/**
 * Formatiert Substitutions für Sprachausgabe
 */
export function formatSubstitutionsForSpeech(substitutions: Substitution[]): string {
  if (!substitutions || substitutions.length === 0) {
    return 'Es gibt keine Vertretungen oder Ausfälle.';
  }

  const cancellations = substitutions.filter(s => s.isCancelled);
  const changes = substitutions.filter(s => !s.isCancelled);

  let speech = '';

  if (cancellations.length > 0) {
    if (cancellations.length === 1) {
      speech += `${cancellations[0].originalSubject} in der ${cancellations[0].lessonNumber}. Stunde fällt aus. `;
    } else {
      speech += `${cancellations.length} Stunden fallen aus: `;
      cancellations.forEach((sub, index) => {
        if (index > 0) speech += ', ';
        if (index === cancellations.length - 1 && cancellations.length > 1) speech += 'und ';
        speech += `${sub.originalSubject} in der ${sub.lessonNumber}. Stunde`;
      });
      speech += '. ';
    }
  }

  if (changes.length > 0) {
    if (changes.length === 1) {
      const sub = changes[0];
      speech += `${sub.originalSubject} in der ${sub.lessonNumber}. Stunde wird`;
      if (sub.substituteTeacher) {
        speech += ` von ${sub.substituteTeacher}`;
      }
      speech += ' vertreten.';
    } else {
      speech += `Es gibt ${changes.length} Vertretungen.`;
    }
  }

  return speech;
}

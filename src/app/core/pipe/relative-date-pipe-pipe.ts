import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeDatePipe',
  standalone: true,
})
export class RelativeDatePipe implements PipeTransform {
  private parseCustomDate(dateString: string): Date | null {
    if (!dateString) return null;

    try {
      const [datePart, timePart] = dateString.trim().split(' ');
      if (!datePart || !timePart) return null;

      // Support "-" ou "/"
      const [day, month, year] = datePart.split(/[-/]/).map(Number);
      const [hours = 0, minutes = 0, seconds = 0] = timePart
        .split(':')
        .map(Number);

      const parsedDate = new Date(
        year,
        month - 1,
        day,
        hours,
        minutes,
        seconds
      );

      if (isNaN(parsedDate.getTime())) {
        console.warn('⚠️ Date invalide:', dateString);
        return null;
      }

      return parsedDate;
    } catch (error) {
      console.error('❌ Erreur parsing date:', error, 'valeur=', dateString);
      return null;
    }
  }

  transform(value: unknown): string {
    if (!value) return '';

    const date = this.parseCustomDate(value as string);
    if (!date) return String(value);

    // Format : "14 septembre 2025 16:18:31"
    return (
      date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }) +
      ' ' +
      date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
  }
}

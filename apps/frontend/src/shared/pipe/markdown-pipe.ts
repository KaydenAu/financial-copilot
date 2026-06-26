import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Pipe({
  name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string | undefined | null): SafeHtml {
    if (!value) return '';
    
    // Compiles the raw markdown string into standard HTML string structures
    const rawHtml = marked.parse(value, { async: false }) as string;
    
    // Safe-marks the string to bypass Angular's strict script sanitization engine
    return this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  }
}

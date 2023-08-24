import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'linkify'
})
export class LinkifyPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string): SafeHtml {
    const regex = /(?:http:\/\/|https:\/\/)\S+/g;
    const newValue = value.replace(regex, (match) => {
      if (match.startsWith('data:image')) {
        return `<img src="${match}" alt="Image" />`;
      } else {
        return `<a href="${match}" target="_blank">${match}</a>`;
      }
    });

    return this.sanitizer.bypassSecurityTrustHtml(newValue);
  }
}
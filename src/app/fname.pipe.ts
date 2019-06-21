import { Pipe, PipeTransform } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms/src/directives';

@Pipe({
  name: 'fname'
})
export class FnamePipe implements PipeTransform {

  transform(path: string, showExtension: boolean = true): string {

    let separate = path.split(/\/|\\/g);
    let filename = separate[separate.length - 1].split(/(\.)/g)[0];

    try {
      return showExtension ? separate[separate.length - 1] : filename;
    } catch {
      return path;
    }
  }

}

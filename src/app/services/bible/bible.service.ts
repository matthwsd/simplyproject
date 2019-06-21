import { Injectable } from '@angular/core';
import { BibleJson, IBible } from './bibleJSON';
@Injectable({
  providedIn: 'root'
})
export class BibleService {

  constructor(
    private bibleJson: BibleJson
  ) { }

  getVersions(): Array<string> {
    return this.bibleJson.getBibles();
  }

  getScripture(version: 'aa' | 'acf' | 'nvi'): IBible[] {
    return this.bibleJson.getScripture(version);
  }
}


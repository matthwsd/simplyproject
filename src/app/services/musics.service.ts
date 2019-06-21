import { Injectable } from '@angular/core';
import { IMusic } from '../interfaces/music';
import { Subject, Observable, of } from 'rxjs';

import { map, tap, debounceTime, distinctUntilChanged, switchMap, subscribeOn, debounce } from 'rxjs/operators';


import { MusicJSONService } from '../services/musicJSON.service';
import { TreeNode } from '@angular/router/src/utils/tree';

@Injectable({
  providedIn: 'root'
})
export class MusicsService {
  /**
   * Subscribe to this to get all musics available
   */
  public musics: Subject<String> = new Subject<String>();

  constructor(private musicJSON: MusicJSONService) {

  }

  public get(): Array<IMusic> {
    return this.musicJSON
      .get()
      .sort((a, b) => {
        if (a.Title > b.Title)
          return 1;
        if (a.Title < b.Title)
          return -1;
        return 0;
      });
  }

  /**
   * Push a new music to Music's JSON
   */
  public put(toSave: IMusic, callback?): Boolean {
    return this.musicJSON.save(toSave, callback);
  }

  /**
 * Delete a new music to Music's JSON
 */
  public delete(toDelete: IMusic, callback?): Boolean {
    return this.musicJSON.delete(toDelete, callback);
  }


}

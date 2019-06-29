import { Injectable } from '@angular/core';
import { IMusic } from '../../interfaces/music';
import { JsonFile } from '../json-file';
import { ApplicationRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicJSONService extends JsonFile {

  private MUSICSPATH = `${MusicJSONService.DATA}/musics.json`;

  constructor(private appref: ApplicationRef) {
    super();
    this.exist(this.MUSICSPATH, true);
  }

  // Get an Array with Music's JSON content, or null if doesn't have any content.
  get(): Array<IMusic> {
    return super.get<Array<IMusic>>(this.MUSICSPATH);
  }

  // Push a new Music to Music's Json
  public save(toSave: IMusic, callback?): boolean {

    let musics = this.get();
    musics.push(toSave);

    this.writeFile(this.MUSICSPATH, musics, () => {
      return false;
    })
    return true;
  }

  // Update a Music to Music's Json
  public update(toUpdate: IMusic, error?, success?): boolean {

    let musics = this.get();
    var indexToUpdate = null;
    musics.forEach((_m, index) => {
      if (_m.Id == toUpdate.Id) {
        indexToUpdate = index;
        return;
      }
    })

    musics[indexToUpdate] = toUpdate;

    this.writeFile(this.MUSICSPATH, musics, error, success);
    this.appref.tick();
    return true;
  }

  // Delete a Music to Music's Json
  public delete(toDelete: IMusic, callback?): boolean {
    try {
      let musics = this.get();
      musics = musics.filter((_) => {
        return _.Id != toDelete.Id;
      })
      let isSaved = true;

      this.writeFile(this.MUSICSPATH, musics, (err) => {
        if (err)
          isSaved = false;
      })

      if (isSaved) {
        callback;
      }

      return isSaved;
    } catch {
      return false;
    }
  }

}

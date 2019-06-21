import { Injectable, ApplicationRef } from '@angular/core';
import * as Mousetrap from 'mousetrap';

import { ProjectorService } from './projector.service';
import { FileService } from './file-lst.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { MusicCreateComponent } from '../components/musics/musics-create/musics.component';
import { MusicsSelectComponent } from '../components//musics/musics-select/musics-select.component';
import { SettingsProjectionComponent } from '../components/settings/settings-projection/settings-projection.component';

import { remote } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class Shortcuts {

  constructor(
    private fileService: FileService,
    private projectorService: ProjectorService,
    private modal: NgbModal,
    private appref: ApplicationRef
  ) { }

  private fileShortcuts() {
    Mousetrap.bind('mod+f mod+o', () => {
      this.fileService.openDialog();
    })
  }

  private musicShortcuts() {
    Mousetrap.bind('mod+m mod+n', () => {
      this.modal
        .open(MusicCreateComponent, { size: 'lg', centered: true })
      this.appref.tick();
    })

    Mousetrap.bind('mod+m mod+s', () => {
      this.modal
        .open(MusicsSelectComponent, { size: 'lg', centered: true })
      this.appref.tick();
    })
  }

  private settingsShortcuts() {
    Mousetrap.bind('mod+s mod+p', () => {
      this.modal
        .open(SettingsProjectionComponent, { size: 'lg', centered: true })
      this.appref.tick();
    })
  }

  private projectionShortcuts() {
    Mousetrap.bind('mod+p mod+b', () => {
      this.projectorService.setBlackScreen();
    })

    Mousetrap.bind('mod+p mod+c', () => {
      this.projectorService.clearText();
    })

    Mousetrap.bind('mod+p mod+g', () => {
      this.projectorService.setBackgroundBlack();
    })
  }

  private secret() {
    Mousetrap.bind('?', () => {
      alert("A ajuda ainda está sendo construída. =)")
    })

    Mousetrap.bind('d e v o p e n c o n s o l e', () => {
      remote.getCurrentWindow().webContents.toggleDevTools();
    })
  }

  public load() {
    this.fileShortcuts();
    this.musicShortcuts();
    this.settingsShortcuts();
    this.projectionShortcuts();
    this.secret();
    console.log("Shortcuts foram criados.")
  }
}

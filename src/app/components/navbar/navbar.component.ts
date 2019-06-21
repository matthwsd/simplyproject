import { Component, OnInit, } from '@angular/core';
import { remote, } from 'electron';

import { NgModel } from '@angular/forms'
import { NgbModal, } from '@ng-bootstrap/ng-bootstrap'

import { MusicCreateComponent } from '../musics/musics-create/musics.component';
import { MusicsSelectComponent } from '../musics/musics-select/musics-select.component';
import { SettingsProjectionComponent } from '../settings/settings-projection/settings-projection.component';
import { BibleComponent } from '../bible/bible.component';

import { FileService } from '../../services/files/file-lst.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private filesService: FileService,
    private modalService: NgbModal,

  ) { }

  showDialog() {
    this.filesService.openDialog();
  }

  showMusicDialog() {
    this.modalService
      .open(MusicsSelectComponent, { size: 'lg', centered: true })
  }

  showCreateMusicDialog() {
    this.modalService
      .open(MusicCreateComponent, { size: 'lg', centered: true })
  }

  showProjectionSettings() {
    this.modalService
      .open(SettingsProjectionComponent, { size: 'lg', centered: true })
  }

  showBibleDialog() {
    this.modalService
      .open(BibleComponent, { size: 'lg', centered: true })
  }


  close() {
    remote.getCurrentWindow().close();
  }

  minimize() {
    remote.getCurrentWindow().minimize();
  }

  maximize() {
    remote.getCurrentWindow().maximize();
  }

  ngOnInit() {

  }


}

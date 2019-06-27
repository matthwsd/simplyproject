import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NgModel } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

import { IMusic } from '../../../interfaces/music';
import { MusicsService } from '../../../services/music/musics.service';

import { ToastrService } from '../../../toastr/toastr.service';


@Component({
  selector: 'app-createmusic',
  templateUrl: './create-music.component.html',
  styleUrls: ['./create-music.component.sass']
})
export class MusicCreateComponent implements OnInit {
  title: string = "";
  artist: string = "";
  lyric: string = "";


  // Save a New Music
  async save() {
    if (this.title && this.artist && this.lyric) {

      let i = new Date().getMilliseconds();
      let m: IMusic = {
        Id: btoa(this.artist + this.title + i),
        Artist: this.artist,
        Lyric: this.lyric,
        Title: this.title
      };

      if (this.musicsService.put(m)) {
        this.toastr.toastr(`A música ${this.title} foi salva com sucesso.`,{ Type: 'Success', Duration: 3500});
        this.title = "";
        this.artist = "";
        this.lyric = "";
      } else {
        this.toastr.toastr(`Aconteceu um erro, tente novamente.`,{ Type: 'Error', Duration: 3500});
      }
    }

  }

  // Set the lyrics as uppercase
  toUpper() {
    this.lyric = this.lyric.toUpperCase();
  }

  close() {
    this.activeModal.dismiss('Cross click')
  }

  constructor(
    private activeModal: NgbActiveModal,
    private musicsService: MusicsService,
    private toastr: ToastrService,
    private vcr: ViewContainerRef
  ) {
    toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.title = "";
    this.artist = "";
    this.lyric = "";
  }

}

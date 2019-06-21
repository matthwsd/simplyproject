import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { MusicsService } from '../../../services/musics.service';
import { PresentationService } from '../../../services/presentation.service';

import { IPresentation } from '../../../interfaces/presentation';
import { IMusic } from '../../../interfaces/music';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from '../../../toastr/toastr.service';


@Component({
  selector: 'app-musics-select',
  templateUrl: './musics-select.component.html',
  styleUrls: ['./musics-select.component.sass']
})
export class MusicsSelectComponent implements OnInit {
  musicSelected: IMusic = null;
  musics: Array<IMusic>;
  searchTerm: string = "";
  private allMusics: Array<IMusic>;

  addToPresentation() {
    this.presentationService.presentation.next([new IPresentation(this.musicSelected)]);
    this.toastr.toastr(`A música ${this.musicSelected.Title} foi adicionado à apresentação`, { Type: 'Success', Duration: 2000 })
  }

  selectMusic(m: IMusic) {
    this.musicSelected = m;
  }

  searchMusic(term: string) {
    if (term.trim()) {
      term = term.toUpperCase();
      this.musics = this.allMusics
        .filter((_m) => {
          if (_m.Artist.toUpperCase().includes(term) || _m.Lyric.toUpperCase().includes(term) || _m.Title.toUpperCase().includes(term))
            return _m;
        })
        .sort((a, b) => {
          if (a.Title > b.Title)
            return 1;
          if (a.Title < b.Title)
            return -1;
          return 0;
        });
    } else {
      this.musics = this.allMusics;
    }
  }

  deleteMusic() {
    this.toastr.toastr(`Deseja realmente apagar a música?`, {
      Type: 'Question',
      Duration: 3500,
      ShowAction: true,
      ActionMessage: "Sim, apagar.",
      DoSomething: () => {
        this.musicsService.delete(this.musicSelected);
        this.allMusics = this.allMusics.filter(_m => {
          if (_m.Id != this.musicSelected.Id)
            return _m;
        });
        this.musics = this.allMusics;
        this.musicSelected = null;
      }
    })

  }

  close() {
    this.activeModal.dismiss()
  }

  constructor(
    private presentationService: PresentationService,
    private musicsService: MusicsService,
    private activeModal: NgbActiveModal,
    private vcr: ViewContainerRef,
    private toastr: ToastrService
  ) {
    toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.musics = this.musicsService.get();
    this.allMusics = this.musicsService.get();

  }


}

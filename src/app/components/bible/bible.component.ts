import { Component, OnInit, OnDestroy, ApplicationRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { BibleService } from '../../services/bible/bible.service';
import { IBible, IBibleFetched } from '../../interfaces/bible';
import * as Mousetrap from 'mousetrap';

import { PreviewService } from '../../services/preview/preview.service';
import { ProjectorService } from '../../services/projector/projector.service';
import { IPresentation } from '../../interfaces/presentation';
import { PresentationService } from '../../services/presentation/presentation.service';

@Component({
  selector: 'app-bible',
  templateUrl: './bible.component.html',
  styleUrls: ['./bible.component.scss']
})
export class BibleComponent implements OnInit, OnDestroy {

  close() {
    this.activeModal.dismiss('Cross click')
  }

  versions: Array<string>;
  results: Array<IBibleResult> = new Array();

  selectedVersion: 'aa' | 'acf' | 'nvi';

  showSearch = false;

  livro: string = "";
  referencia: string = "";
  search: string = "";
  resultSelected: number = null;
  private bookSearched: string = null;
  private refSearched: string = null;
  private goingLive = false;
  private selectedScripture: IBible[];

  selectVersion(version: 'aa' | 'acf' | 'nvi') {
    this.selectedVersion = version;
    this.search = "";
    this.showSearch = true;
    this.results = new Array();
    this.selectedScripture = this.bibleService.getScripture(this.selectedVersion);
    this.resultSelected = null;
    this.goingLive = null;
  }

  bibleSearch(search: string) {
    const { result, refSearched, bookSearched } = this.bibleService.bibleSearch(this.selectedScripture, search);
    this.results = result;
    this.bookSearched = bookSearched;
    this.refSearched = refSearched;
    console.log(result, refSearched, bookSearched);
    this.resultSelected = null;
    this.goingLive = null;
  }

  selectVerse(index: number) {
    this.resultSelected = index;
    if (this.goingLive)
      this.changeLive();
  }

  private scrollResults() {
    document.querySelector(".results .item.selected").scrollIntoView(false);
  }

  live() {
    if (this.resultSelected == null)
      this.resultSelected = 0;
    this.changeLive();
    this.goingLive = true;
  }

  offLive() {
    this.goingLive = false;
    this.projector.clearText();
    this.preview.clearText();
  }

  addTo() {
    var toAdd = new IBibleFetched();
    toAdd.text = "";
    toAdd.ref = this.refSearched;
    toAdd.book = this.results[0].book;
    this.results.forEach((verse) => {
      toAdd.text += `${verse.ref.match(/[0-9]{1,}/g)[1]} ${verse.text}##`
    })

    var presentation = new IPresentation().getPresentationFromIBible(toAdd);
    this.presentation.presentation.next([presentation]);

  }

  private changeLive() {
    if (this.results.length > 0) {
      if (this.resultSelected >= 0) {
        var verso = this.results[this.resultSelected];
        this.projector.setText(verso.text, `${verso.book} ${verso.ref}`);
        this.preview.setText(verso.text, `${verso.book} ${verso.ref}`);
      }
    } else {
      this.projector.clearText();
      this.preview.clearText();
    }
  }

  constructor(
    private activeModal: NgbActiveModal,
    private bibleService: BibleService,
    private appref: ApplicationRef,
    private projector: ProjectorService,
    private preview: PreviewService,
    private presentation: PresentationService
  ) { }

  ngOnInit() {
    this.versions = this.bibleService.getVersions();

    Mousetrap.bind('down', () => {
      if (this.resultSelected >= 0)
        this.resultSelected++;
      else
        this.resultSelected = 0;
      this.appref.tick();
      this.scrollResults();
      if (this.goingLive)
        this.changeLive();

    })

    Mousetrap.bind('up', () => {
      if (this.resultSelected >= 0)
        if (this.resultSelected > 0)
          this.resultSelected--;
        else
          this.resultSelected = this.results.length - 1;
      else
        this.resultSelected = 0;
      this.appref.tick();
      this.scrollResults();
      if (this.goingLive)
        this.changeLive();

    })

  }

  ngOnDestroy() {
    Mousetrap.unbind('down');
    this.preview.clearText();
    this.projector.clearText();
  }
}

interface IBibleResult {
  book: string;
  ref: string;
  text: string;
}
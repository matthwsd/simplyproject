import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { BibleService } from '../../services/bible/bible.service';
import { IBible } from '../../interfaces/bible';

@Component({
  selector: 'app-bible',
  templateUrl: './bible.component.html',
  styleUrls: ['./bible.component.scss']
})
export class BibleComponent implements OnInit {

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

  private selectedScripture: IBible[];

  selectVersion(version: 'aa' | 'acf' | 'nvi') {
    this.selectedVersion = version;
    this.search = "";
    this.showSearch = true;
    this.results = new Array();
    this.selectedScripture = this.bibleService.getScripture(this.selectedVersion);
  }

  bibleSearch(search: string) {
    this.results = this.bibleService.bibleSearch(this.selectedScripture, search);
  }


  constructor(
    private activeModal: NgbActiveModal,
    private bibleService: BibleService
  ) { }

  ngOnInit() {
    this.versions = this.bibleService.getVersions();
  }

}

interface IBibleResult {
  book: string;
  ref: string;
  text: string;
}
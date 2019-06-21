import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { BibleService } from '../../services/bible/bible.service';

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
  selectedVersion: 'aa' | 'acf' | 'nvi';

  showSearch = false;

  livro: string = "";
  referencia: string = "";
  search: string = "";

  selectVersion(version: 'aa' | 'acf' | 'nvi') {
    this.selectedVersion = version;
    this.search = "";
    this.showSearch = true;
    console.log(this.bibleService.getScripture(this.selectedVersion).find((b) => { return b.$.n == "João" }).c[2].v[15]._);
  }

  bibleSearch(search: string) {
    // RegEx para achar o Livro (([0-9]\s[a-zA-Z]{1,})|([0-9][a-zA-Z]{1,}))|([a-zA-Z]){1,}
    // RegEx para achar o capítulo, versiculos e etc
    // ([0-9]{1,}\:[0-9]{1,}\-[0-9]{1,}\,[0-9\-\,]{1,})|([0-9]{1,}\:[0-9]{1,}\-[0-9]{1,})|([0-9]{1,}\:[0-9]{1,}) 
    let matchLivro = search.match(/(([0-9]\s[a-zA-Z]{1,})|([0-9][a-zA-Z]{1,}))|([a-zA-Z]){1,}/g);
    let matchReferencia = search.match(/([0-9]{1,}\:[0-9]{1,}\-[0-9]{1,}\,[0-9\-\,]{1,})|([0-9]{1,}\:[0-9]{1,}\-[0-9]{1,})|([0-9]{1,}\:[0-9]{1,})/g)
    this.livro = matchLivro ? matchLivro[0] : "";
    this.referencia = matchReferencia ? matchReferencia[0] : "";
  }

  constructor(
    private activeModal: NgbActiveModal,
    private bibleService: BibleService
  ) { }

  ngOnInit() {
    this.versions = this.bibleService.getVersions();
  }

}

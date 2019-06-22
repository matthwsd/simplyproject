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
    this.results = new Array();
    let matchLivro = search.match(/(([0-9]\s[a-zA-Z]{1,})|([0-9][a-zA-Z]{1,}))|([a-zA-Z]){1,}/g);
    let matchReferencia = search.match(/([0-9]{1,}\:[0-9]{1,}\-[0-9]{1,}\,[0-9\-\,]{1,})|([0-9]{1,}\:[0-9\,]{1,}[0-9]{1,}\-[0-9\-\,]{1,})|([0-9]{1,}\:[0-9]{1,}\-[0-9]{1,})|[0-9\:]{1,}[0-9\,]{1,}|([0-9]{1,}\:[0-9]{1,})|[0-9]{1,}/g)
    this.livro = matchLivro ? matchLivro[0] : "";
    this.referencia = matchReferencia ? matchReferencia[0] : "";
    if (this.livro && this.referencia) {
      this.fetchResult(this.livro, this.referencia);
    }
  }

  private fetchResult(book: string, ref: string) {
    let capitulo = ref.match(/[0-9\-\,]{1,}|[0-9\-]{1,}|[0-9]{1,}/g)[0];
    let versiculos = ref.match(/[0-9\-\,]{1,}|[0-9\-]{1,}|[0-9]{1,}/g)[1];
    var livroR = this.selectedScripture.find((b) => { return this.accentFold(b.$.n.toLowerCase()) == this.accentFold(book) });
    var capR = livroR.c[parseInt(capitulo) - 1];

    if (versiculos.indexOf("-") != -1 || versiculos.indexOf(",") != -1) {
      let sep = versiculos.match(/[0-9\-]{1,}|[0-9]{1,}/g)
      sep.forEach((_) => {

        // Se tiver "-" será considerado um range de versículos
        if (_.indexOf("-") >= 0) {
          let range = _.match(/[0-9]{1,}/g);

          let min = range[0];
          let max = range[1];

          if (min > max) {
            max = range[0]
            min = range[1]
          }

          for (var i = parseInt(min) - 1; i <= parseInt(max) - 1; i++) {
            let refR = capR.v[i];
            this.results.push({
              text: refR._,
              ref: `${capR.$.n}:${refR.$.n}`,
              book: livroR.$.n
            })
          }

        } else {
          let refR = capR.v[parseInt(_) - 1];
          this.results.push({
            text: refR._,
            ref: `${capR.$.n}:${refR.$.n}`,
            book: livroR.$.n
          })
        }

      })

    } else {
      let refR = capR.v[parseInt(versiculos) - 1];
      this.results.push({
        text: refR._,
        ref: `${capR.$.n}:${refR.$.n}`,
        book: livroR.$.n
      })
    }

  }

  private accentFold(inStr) {
    return inStr.replace(
      /([àáâãäå])|([ç])|([èéêë])|([ìíîï])|([ñ])|([òóôõöø])|([ß])|([ùúûü])|([ÿ])|([æ])/g,
      function (str, a, c, e, i, n, o, s, u, y, ae) {
        if (a) return 'a';
        if (c) return 'c';
        if (e) return 'e';
        if (i) return 'i';
        if (n) return 'n';
        if (o) return 'o';
        if (s) return 's';
        if (u) return 'u';
        if (y) return 'y';
        if (ae) return 'ae';
      }
    );
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
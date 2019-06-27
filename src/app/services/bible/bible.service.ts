import { Injectable } from '@angular/core';
import { BibleJson } from './bibleJSON';
import { IBible, IBibleFetched } from '../../interfaces/bible';
import { NgbButtonLabel } from '@ng-bootstrap/ng-bootstrap/buttons/label';

@Injectable({
  providedIn: 'root'
})
export class BibleService {

  constructor(
    private bibleJson: BibleJson
  ) { }

  getVersions(): Array<string> {
    return this.bibleJson.getBibles();
  }

  getScripture(version: 'aa' | 'acf' | 'nvi'): IBible[] {
    return this.bibleJson.getScripture(version);
  }

  bibleSearch(scripture: IBible[], search: string): BibleSearchResult {
    let matchLivro = search.match(/(([0-9]\s[a-zA-Z]{1,})|([0-9][a-zA-Z]{1,}))|([a-zA-Z]){1,}/g);
    let matchReferencia = search.replace(/(([0-9]\s[a-zA-Z]{1,})|([0-9][a-zA-Z]{1,}))|([a-zA-Z]){1,}/g, "").match(/([0-9]{1,}\:[0-9]{1,}\-[0-9]{1,}\,[0-9\-\,]{1,})|([0-9]{1,}\:[0-9\,]{1,}[0-9]{1,}\-[0-9\-\,]{1,})|([0-9]{1,}\:[0-9]{1,}\-[0-9]{1,})|[0-9\:]{1,}[0-9\,]{1,}|([0-9]{1,}\:[0-9]{1,})|[0-9]{1,}/g)
    var book = matchLivro ? matchLivro[0] : "";
    var ref = matchReferencia ? matchReferencia[0] : "";
    if (book && ref) {
      return { result: this.fetchResult(scripture, book, ref), refSearched: ref, bookSearched: book };
    } else {
      return { result: null, refSearched: null, bookSearched: null };
    }
  }

  private fetchResult(scripture: IBible[], book: string, ref: string): IBibleFetched[] {
    var results: Array<IBibleFetched> = new Array();
    let capitulo = ref.match(/[0-9\-\,]{1,}|[0-9\-]{1,}|[0-9]{1,}/g)[0];
    let versiculos = ref.match(/[0-9\-\,]{1,}|[0-9\-]{1,}|[0-9]{1,}/g)[1];
    var livroR = scripture.find((b) => { return this.accentFold(b.$.n.toLowerCase()) == this.accentFold(book) });
    var capR = livroR.c[parseInt(capitulo) - 1];

    if (versiculos && (versiculos.indexOf("-") != -1 || versiculos.indexOf(",") != -1)) {
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
            results.push({
              text: refR._,
              ref: `${capR.$.n}:${refR.$.n}`,
              book: livroR.$.n
            })
          }

        } else {
          let refR = capR.v[parseInt(_) - 1];
          results.push({
            text: refR._,
            ref: `${capR.$.n}:${refR.$.n}`,
            book: livroR.$.n
          })
        }

      })

    } else if (versiculos) {
      let refR = capR.v[parseInt(versiculos) - 1];
      results.push({
        text: refR._,
        ref: `${capR.$.n}:${refR.$.n}`,
        book: livroR.$.n
      })
    } else {
      capR.v.forEach((_v) => {
        results.push({
          text: _v._,
          ref: `${capR.$.n}:${_v.$.n}`,
          book: livroR.$.n
        })
      })
    }

    return results;

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
}

interface BibleSearchResult {
  result: IBibleFetched[];
  bookSearched: string;
  refSearched: string;
}





import { IMusic } from './music';
import { IBibleFetched } from './bible';

export class IPresentation {
  public Type: 'MUSIC' | 'BIBLE';
  public Title: string;
  public Detail: string;
  public Slides: Array<String>;

  private getSlidesFromIMusic(m: IMusic): Array<String> {
    let r = new Array<String>();

    r.push("");

    m.Lyric.split(/(\s){2,}/g).forEach((part) => {
      if (part.length > 1) {
        r.push(part);
      }
    })

    return r;
  }

  private getSlidesFromIBibleFetched(b: IBibleFetched): Array<String> {
    let r = new Array<String>();

    r.push("");

    b.text.split(/\#{2}/g).forEach((part) => {
      if (part.length > 1) {
        r.push(part);
      }
    })

    return r;
  }

  constructor() {

  }

  public getPresentationFromIMusic(m: IMusic) {
    this.Title = m.Title;
    this.Detail = `${m.Artist}`
    this.Type = 'MUSIC';
    this.Slides = this.getSlidesFromIMusic(m);
    return this;
  }

  public getPresentationFromIBible(b: IBibleFetched) {
    this.Title = `${b.book} ${b.ref}`;
    this.Type = 'BIBLE';
    this.Slides = this.getSlidesFromIBibleFetched(b);
    this.Detail = `${b.book} ${b.ref}`;
    return this;
  }

}


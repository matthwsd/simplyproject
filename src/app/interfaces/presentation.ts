
import { IMusic } from './music';

export class IPresentation {
  public Type: string;
  public Title: string;
  public Detail: string;
  public Slides: Array<String>;

  private getSlides(m: IMusic): Array<String> {
    let r = new Array<String>();

    r.push("");

    m.Lyric.split(/(\s){2,}/g).forEach((part) => {
      if (part.length > 1) {
        r.push(part);
      }
    })

    return r;
  }

  constructor(m: IMusic) {
    this.Title = m.Title;
    this.Detail = `${m.Artist}`
    this.Type = "MUSIC";
    this.Slides = this.getSlides(m);
  }


}


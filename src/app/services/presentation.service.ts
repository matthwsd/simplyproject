import { Injectable } from '@angular/core';
import { IPresentation } from '../interfaces/presentation';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { PromiseState } from 'q';

@Injectable({
  providedIn: 'root'
})
export class PresentationService {
  private presentations: IPresentation[] = [];
  presentation: Subject<IPresentation[]> = new Subject<IPresentation[]>();
  constructor() { }

  public addOnce(p: IPresentation[]): Observable<IPresentation[]> {
    this.presentations.push(p[0]);
    return of(this.presentations);
  }

  public get(): Observable<IPresentation[]> {
    return this.presentation.pipe(
      switchMap((p: IPresentation[]) => this.addOnce(p))
    );
  }

  public clear() {
    this.presentations = [];
    return this.presentation.pipe(
      switchMap((p: IPresentation[]) => this.addOnce(p))
    );
  }

  public remove(index: number) {
    this.presentations.splice(index, 1);
    this.presentation.pipe();
  }

}

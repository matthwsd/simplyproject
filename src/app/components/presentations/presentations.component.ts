import { Component, OnInit, ApplicationRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { IPresentation } from '../../interfaces/presentation';
import { PresentationService } from '../../services/presentation.service';

import { ISlide } from '../../interfaces/slide';

@Component({
  selector: 'app-presentations',
  templateUrl: './presentations.component.html',
  styleUrls: ['./presentations.component.sass']
})
export class PresentationsComponent implements OnInit {


  showContextPresentationMenu: boolean = false;
  showingContextPresentationMenuFor: number;

  presentations: Observable<IPresentation[]>;
  presentationSelected: IPresentation = null;
  currentIndexSlide: number = null;
  isSelected: boolean = false;

  @Output("onSlideChange") onSlideChange: EventEmitter<ISlide> = new EventEmitter();

  top: number = 0;
  left: number = 0;

  contextPresentation(i: number, e: any, isSelected: boolean) {
    this.showContextPresentationMenu = true;
    this.top = e.clientY + 4;
    this.left = e.clientX + 4;
    this.showingContextPresentationMenuFor = i;
    this.isSelected = isSelected;
    this.zone.tick();

  }

  selectPresentation(p: IPresentation) {
    this.presentationSelected = p;
    this.currentIndexSlide = null;
    this.onSlideChange.emit({
      text: "",
      detail: ""
    })
  }

  removeAllPresentations() {
    this.presentations = this.presentationService.clear();
    this.presentationSelected = null;
  }

  removePresentation() {
    if (this.isSelected)
      this.presentationSelected = null;
    this.presentationService.remove(this.showingContextPresentationMenuFor);
  }

  changeSlide(i: number) {
    this.currentIndexSlide = i;
    this.onSlideChange.emit({
      text: this.presentationSelected.Slides[i],
      detail: this.presentationSelected.Detail
    })
  }

  constructor(
    private zone: ApplicationRef,
    private presentationService: PresentationService
  ) { }

  ngOnInit() {
    this.presentations = this.presentationService.get();

    window
      .addEventListener("click", () => {
        this.showContextPresentationMenu = false;
      })
  }

}


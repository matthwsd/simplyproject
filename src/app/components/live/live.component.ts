import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {
  @Output("onBlackScreen") onBlackScreen: EventEmitter<null> = new EventEmitter();
  @Output("onClearScreen") onClearScreen: EventEmitter<null> = new EventEmitter();
  @Output("onLogoScreen") onLogoScreen: EventEmitter<null> = new EventEmitter();
  @Output("onBackSelectScreen") onBackSelectScreen: EventEmitter<null> = new EventEmitter();
  @Output("onRemoveBackground") onRemoveBackground: EventEmitter<null> = new EventEmitter();

  constructor() { }

  blackScreen() {
    this.onBlackScreen.emit();
  }

  clearScreen() {
    this.onClearScreen.emit();
  }

  logoScreen() {
    this.onLogoScreen.emit();
  }

  backSelectScreen() {
    this.onBackSelectScreen.emit();
  }


  removeBackground() {
    this.onRemoveBackground.emit();
  }


  ngOnInit() {
  }

}

import { Component, OnInit, Input, AfterContentInit, ComponentRef, Output, EventEmitter, ViewContainerRef, ViewChild, ɵConsole } from '@angular/core';

@Component({
  selector: 'app-toastr',
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss']
})
export class ToastrComponent implements OnInit, AfterContentInit {

  @ViewChild("me") me: any;
  /**
   * Type of Toast
   */
  @Input('type') type: 'Success' | 'Error' | 'Question' | 'Info';

  /**
   * Show action. 
   */
  @Input('showAction') showAction: boolean = false;

  /**
   * Message that will be displayed
   */
  @Input('message') message: string;

  /**
  * Action Message, if action will be show
  */
  @Input('actionMessage') actionMessage: string;

  /**
   * A function to be called when action is clicked
   */
  @Input('doSomething') doSomething;

  /**
   * Dismiss toastr after action is clicked
   */
  @Input('dismissAfterDoSomething') dismissAfterDoSomething: boolean = true;

  @Input('self') self: ViewContainerRef;


  constructor(
  ) { }

  /**
   * Call the doSomething function when Action is clicked
   */
  do() {
    if (this.doSomething) {
      this.doSomething()
      this.self.clear();
    }
  }

  ngOnInit() {
    this.me.nativeElement.style.opacity = 1;
  }

  ngAfterContentInit() {
  }



}

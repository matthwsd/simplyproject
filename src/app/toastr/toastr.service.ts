import { Injectable, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

import { ToastrComponent } from './toastr.component';
@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  private rootViewContainer: ViewContainerRef;

  constructor(
    private factoryResolver: ComponentFactoryResolver
  ) {
  }

  public setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }

  public toastr(message: string, option?: ToastrOptions) {

    const factory = this.factoryResolver
      .resolveComponentFactory(ToastrComponent);

    const component = factory
      .create(this.rootViewContainer.parentInjector)

    component.instance.message = message;

    if (option.Type)
      component.instance.type = option.Type;

    if (option.ShowAction)
      component.instance.showAction = true;

    if (option.ActionMessage)
      component.instance.actionMessage = option.ActionMessage;

    if (option.DoSomething)
      component.instance.doSomething = option.DoSomething;

    component.instance.self = this.rootViewContainer;

    this.rootViewContainer.insert(component.hostView)

    setTimeout(() => {
      this.rootViewContainer.clear();
    }, option ? option.Duration ? option.Duration : 5000 : 5000);
  }

}

interface ToastrOptions {
  /**
   * Type of Toast
   */
  Type?: 'Success' | 'Error' | 'Question' | 'Info';
  /**
   * Duration of toast
   */
  Duration?: number;
  /**
   * Show toast's action
   * @default false
   */
  ShowAction?: boolean;
  /**
   * Action's message to display
   */
  ActionMessage?: string;
  /**
   * A callback function when Action is Clicked
   */
  DoSomething?: any;
}

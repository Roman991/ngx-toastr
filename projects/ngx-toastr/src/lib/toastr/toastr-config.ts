import { InjectionToken, signal } from '@angular/core';

import { ComponentType } from '../portal/portal';
import { ToastRef } from './toast-ref';

export type ProgressAnimationType = 'increasing' | 'decreasing';
export type DisableTimoutType = boolean | 'timeOut' | 'extendedTimeOut';

/**
 * Configuration for an individual toast.
 */
export interface IndividualConfig<ConfigPayload = unknown> {
  /**
   * disable both timeOut and extendedTimeOut
   * default: false
   */
  disableTimeOut: DisableTimoutType;
  /**
   * toast time to live in milliseconds
   * default: 5000
   */
  timeOut: number;
  /**
   * toast show close button
   * default: false
   */
  closeButton: boolean;
  /**
   * time to close after a user hovers over toast
   * default: 1000
   */
  extendedTimeOut: number;
  /**
   * show toast progress bar
   * default: false
   */
  progressBar: boolean;

  /**
   * changes toast progress bar animation
   * default: decreasing
   */
  progressAnimation: ProgressAnimationType;

  /**
   * render html in toast message (possibly unsafe)
   * default: false
   */
  enableHtml: boolean;
  /**
   * css class on toast component
   * default: ngx-toastr
   */
  toastClass: string;
  /**
   * css class on toast container
   * default: toast-top-right
   */
  positionClass: string;
  /**
   * css class on toast title
   * default: toast-title
   */
  titleClass: string;
  /**
   * css class on toast message
   * default: toast-message
   */
  messageClass: string;
  /**
   * animation easing on toast
   * default: ease-in
   */
  easing: string;
  /**
   * animation ease time on toast
   * default: 300
   */
  easeTime: string | number;
  /**
   * clicking on toast dismisses it
   * default: true
   */
  tapToDismiss: boolean;
  /**
   * enable enter/leave animations on the toast
   * default: true
   */
  animation: boolean;
  /**
   * Angular toast component to be shown
   * default: Toast
   */
  toastComponent?: ComponentType<unknown>;
  /**
   * New toast placement
   * default: true
   */
  newestOnTop: boolean;

  /**
   * Payload to pass to the toast component
   */
  payload?: ConfigPayload;
}

export interface ToastrIconClasses {
  error: string;
  info: string;
  success: string;
  warning: string;
  [key: string]: string;
}

/**
 * Global Toast configuration
 * Includes all IndividualConfig
 */
export interface GlobalConfig<C = unknown> extends IndividualConfig<C> {
  /**
   * max toasts opened. Toasts will be queued
   * Zero is unlimited
   * default: 0
   */
  maxOpened: number;
  /**
   * dismiss current toast when max is reached
   * default: false
   */
  autoDismiss: boolean;
  iconClasses: Partial<ToastrIconClasses>;
  /**
   * block duplicate messages
   * default: false
   */
  preventDuplicates: boolean;
  /**
   * display the number of duplicate messages
   * default: false
   */
  countDuplicates: boolean;
  /**
   * Reset toast timeout when there's a duplicate (preventDuplicates needs to be set to true)
   * default: false
   */
  resetTimeoutOnDuplicate: boolean;
  /**
   * consider the title of a toast when checking if duplicate
   * default: false
   */
  includeTitleDuplicates: boolean;
}

/**
 * Everything a toast needs to launch
 */
export class ToastPackage<ConfigPayload = unknown> {
  /** Counter incremented on every tap. */
  private _tapped = signal(0);
  /** Counter incremented on every action. */
  private _action = signal(0);
  /** Latest action payload triggered from a custom toast. */
  private _actionPayload = signal<ConfigPayload | undefined>(undefined);

  /** Incremented on click. */
  readonly tapped = this._tapped.asReadonly();
  /** Incremented on each action; observe to react to a custom toast action. */
  readonly action = this._action.asReadonly();
  /** Latest action payload; available for use in custom toast. */
  readonly actionPayload = this._actionPayload.asReadonly();

  constructor(
    public toastId: number,
    public config: IndividualConfig<ConfigPayload>,
    public message: string | null | undefined,
    public title: string | undefined,
    public toastType: string,
    public toastRef: ToastRef<unknown>,
  ) {}

  /** Fired on click */
  triggerTap(): void {
    this._tapped.update(count => count + 1);
  }

  /** available for use in custom toast */
  triggerAction(payload?: ConfigPayload): void {
    this._actionPayload.set(payload);
    this._action.update(count => count + 1);
  }
}

export const DefaultNoComponentGlobalConfig: GlobalConfig = {
  maxOpened: 0,
  autoDismiss: false,
  newestOnTop: true,
  preventDuplicates: false,
  countDuplicates: false,
  resetTimeoutOnDuplicate: false,
  includeTitleDuplicates: false,

  iconClasses: {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning',
  },

  // Individual
  closeButton: false,
  disableTimeOut: false,
  timeOut: 5000,
  extendedTimeOut: 1000,
  enableHtml: false,
  progressBar: false,
  toastClass: 'ngx-toastr',
  positionClass: 'toast-top-right',
  titleClass: 'toast-title',
  messageClass: 'toast-message',
  easing: 'ease-in',
  easeTime: 300,
  tapToDismiss: true,
  animation: true,
  progressAnimation: 'decreasing',
};

export interface ToastToken {
  default: GlobalConfig;
  config: Partial<GlobalConfig>;
}

export const TOAST_CONFIG = new InjectionToken<ToastToken>('ToastConfig');

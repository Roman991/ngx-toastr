import { DOCUMENT } from '@angular/common';
import { inject, Injectable, OnDestroy } from '@angular/core';

import { TOAST_CONFIG } from '../toastr/toastr-config';

/** Container inside which all toasts will render. */
@Injectable({ providedIn: 'root' })
export class OverlayContainer implements OnDestroy {
  protected _document = inject(DOCUMENT);
  protected _containerElement!: HTMLElement;

  private _toastConfig = inject(TOAST_CONFIG, { optional: true });

  /**
   * Whether toasts should be promoted to the browser top layer via the Popover
   * API so they render above native popover-layer dialogs/overlays.
   */
  private get _useTopLayer(): boolean {
    return this._toastConfig?.config.useTopLayer ?? this._toastConfig?.default.useTopLayer ?? true;
  }

  ngOnDestroy() {
    if (this._containerElement && this._containerElement.parentNode) {
      this._containerElement.parentNode.removeChild(this._containerElement);
    }
  }

  /**
   * This method returns the overlay container element. It will lazily
   * create the element the first time  it is called to facilitate using
   * the container in non-browser environments.
   * @returns the container element
   */
  getContainerElement(): HTMLElement {
    if (!this._containerElement) {
      this._createContainer();
    }
    return this._containerElement;
  }

  /**
   * Re-promote the container to the top of the browser top layer. The top layer
   * stacks by promotion order (last shown wins), so re-showing the popover when a
   * new toast arrives keeps toasts above dialogs/overlays opened after the
   * container was first shown. No-op when the top layer isn't in use.
   */
  raiseToTop(): void {
    const el = this._containerElement;
    if (!el || !this._useTopLayer || !this._supportsPopover(el)) {
      return;
    }
    try {
      if (el.matches(':popover-open')) {
        el.hidePopover();
      }
      el.showPopover();
    } catch {
      // Ignore: promotion is best-effort; toasts still render at body level.
    }
  }

  /**
   * Create the overlay container element, which is simply a div
   * with the 'overlay-container' class on the document body
   * and 'aria-live="polite"'. When top-layer rendering is enabled and the
   * Popover API is available, the container is promoted to the browser top layer.
   */
  protected _createContainer(): void {
    const container = this._document.createElement('div');
    container.classList.add('overlay-container');
    container.setAttribute('aria-live', 'polite');

    const useTopLayer = this._useTopLayer && this._supportsPopover(container);
    if (useTopLayer) {
      container.setAttribute('popover', 'manual');
    }

    this._document.body.appendChild(container);
    this._containerElement = container;

    if (useTopLayer) {
      try {
        container.showPopover();
      } catch {
        // Ignore: promotion is best-effort; toasts still render at body level.
      }
    }
  }

  /** Whether the Popover API is supported for the given element (false in SSR). */
  private _supportsPopover(el: HTMLElement): boolean {
    return typeof el.showPopover === 'function';
  }
}

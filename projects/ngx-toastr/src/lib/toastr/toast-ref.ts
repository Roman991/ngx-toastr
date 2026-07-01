import { signal } from '@angular/core';
import { OverlayRef } from '../overlay/overlay-ref';

/**
 * Reference to a toast opened via the Toastr service.
 */
export class ToastRef<T> {
  /** The instance of component opened into the toast. */
  componentInstance!: T;

  /** Signal notifying that the toast has finished closing. */
  private _closed = signal(false);
  /** Signal notifying that the toast has been activated. */
  private _activated = signal(false);
  /** Counter incremented every time the toast should close before the timeout. */
  private _manualClose = signal(0);
  /** Counter incremented every time the toast should reset its timeouts. */
  private _resetTimeout = signal(0);
  /** Number of duplicates of this toast. */
  private _duplicatesCount = signal(0);

  /** Notified when the toast has finished closing. */
  readonly closed = this._closed.asReadonly();
  /** Notified when the toast has started opening. */
  readonly activated = this._activated.asReadonly();
  /** Incremented when the toast should close before the timeout. */
  readonly manualClose = this._manualClose.asReadonly();
  /** Incremented when the toast should reset its timeouts. */
  readonly resetTimeout = this._resetTimeout.asReadonly();
  /** Count of duplicate toasts. */
  readonly duplicatesCount = this._duplicatesCount.asReadonly();

  constructor(private _overlayRef: OverlayRef) {}

  /** Request the toast to close before the timeout. */
  triggerManualClose() {
    this._manualClose.update(count => count + 1);
  }

  /**
   * Close the toast.
   */
  close(): void {
    this._overlayRef.detach();
    this._closed.set(true);
    this._activated.set(true);
    this._manualClose.update(count => count + 1);
  }

  isInactive() {
    return this._activated();
  }

  activate() {
    this._activated.set(true);
  }

  /** Reset the toast timeouts and count duplicates. */
  onDuplicate(resetTimeout: boolean, countDuplicate: boolean) {
    if (resetTimeout) {
      this._resetTimeout.update(count => count + 1);
    }
    if (countDuplicate) {
      this._duplicatesCount.update(count => count + 1);
    }
  }
}

import { Component } from '@angular/core';
import { Toast } from 'ngx-toastr';

@Component({
  selector: '[bootstrap-toast-component]',
  template: `
    <div class="demo-toast" role="alert" [style.display]="state() === 'inactive' ? 'none' : ''">
      <div class="demo-toast__header">
        <strong class="demo-toast__title">{{ title() || 'default header' }}</strong>

        @if (options().closeButton) {
          <button
            type="button"
            class="demo-toast__close"
            aria-label="Close"
            (click)="remove()"
          ></button>
        }
      </div>

      <div class="demo-toast__body">
        <div role="alert" [attr.aria-label]="message()">
          {{ message() || 'default message' }}
        </div>

        <div class="demo-toast__actions">
          <button type="button" class="demo-toast__button" (click)="handleClick($event)">
            {{ undoString }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class BootstrapToast extends Toast {
  // used for demo purposes
  undoString = 'undo';

  // Demo click handler
  handleClick(event: Event) {
    event.stopPropagation();
    this.undoString = 'undid';
    this.toastPackage.triggerAction();
    return false;
  }
}

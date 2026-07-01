import { Component } from '@angular/core';

import { Toast } from 'ngx-toastr';

@Component({
  selector: '[pink-toast-component]',
  template: `
    @let _options = options();

    <div class="pink-row" [style.display]="state() === 'inactive' ? 'none' : ''">
      <div class="pink-body">
        @if (title()) {
          <div [class]="_options.titleClass" [attr.aria-label]="title()">
            {{ title() }}
          </div>
        }
        @if (message() && _options.enableHtml) {
          <div role="alert" [class]="_options.messageClass" [innerHTML]="message()"></div>
        }
        @if (message() && !_options.enableHtml) {
          <div role="alert" [class]="_options.messageClass" [attr.aria-label]="message()">
            {{ message() }}
          </div>
        }
      </div>
      <div class="pink-actions">
        @if (!_options.closeButton) {
          <button class="pink-button" (click)="action($event)">
            {{ undoString }}
          </button>
        } @else {
          <button (click)="remove()" class="pink-button">close</button>
        }
      </div>
    </div>

    @if (_options.progressBar) {
      <div>
        <div class="toast-progress" [style.width]="width() + '%'"></div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        background-color: #ff69b4;
        position: relative;
        overflow: hidden;
        margin: 0 0 6px;
        padding: 10px 10px 10px 10px;
        width: 300px;
        border-radius: 3px 3px 3px 3px;
        color: #ffffff;
        pointer-events: all;
        cursor: pointer;

        &.animate-pink-in {
          animation: pink-in 400ms ease-out;
        }

        &.animate-pink-out {
          animation: pink-out 400ms ease-out;
        }
      }

      .pink-row {
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }

      .pink-body {
        flex: 1 1 auto;
        min-width: 0;
      }

      .pink-actions {
        flex: 0 0 auto;
        text-align: right;
      }

      .pink-button {
        display: inline-block;
        padding: 5px 10px;
        font: inherit;
        font-size: 13px;
        line-height: 1.2;
        color: #ffffff;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.75);
        border-radius: 6px;
        cursor: pointer;
        backface-visibility: hidden;
        transform: translateZ(0);
      }

      .pink-button:hover {
        background: rgba(255, 255, 255, 0.14);
      }

      @keyframes pink-out {
        from {
          opacity: 1;
        }
        to {
          transform: translate3d(100%, 0, 0) skewX(30deg);
          opacity: 0;
        }
      }

      @keyframes pink-in {
        from {
          opacity: 0;
          transform: translate3d(100%, 0, 0) skewX(-30deg);
        }
        25% {
          transform: skewX(20deg);
          opacity: 1;
        }
        50% {
          transform: skewX(-5deg);
          opacity: 1;
        }
        to {
          transform: none;
          opacity: 1;
        }
      }
    `,
  ],
  host: {
    'animate.enter': 'animate-pink-in',
    'animate.leave': 'animate-pink-out',
  },
})
export class PinkToast extends Toast {
  // used for demo purposes
  undoString = 'undo';

  action(event: Event) {
    event.stopPropagation();
    this.undoString = 'undid';
    this.toastPackage.triggerAction();
    return false;
  }
}

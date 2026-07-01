import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  linkedSignal,
  signal,
  type OnDestroy,
} from '@angular/core';
import { ToastPackage, type IndividualConfig } from './toastr-config';
import { ToastrService } from './toastr.service';

@Component({
  selector: '[toast-component]',
  template: ` @let _options = options();

    @if (_options.closeButton) {
      <button (click)="remove()" type="button" class="toast-close-button" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    }

    @if (title()) {
      <div [class]="_options.titleClass" [attr.aria-label]="title()">
        {{ title() }}

        @if (duplicatesCount()) {
          <ng-container>[{{ duplicatesCount() + 1 }}]</ng-container>
        }
      </div>
    }

    @if (message()) {
      @if (_options.enableHtml) {
        <div role="alert" [class]="_options.messageClass" [innerHTML]="message()"></div>
      } @else {
        <div role="alert" [class]="_options.messageClass" [attr.aria-label]="message()">
          {{ message() }}
        </div>
      }
    }

    @if (_options.progressBar) {
      <div>
        <div class="toast-progress" [style.width]="width() + '%'"></div>
      </div>
    }`,
  styles: [
    `
      :host.toast-in {
        animation: toast-animation var(--animation-duration) var(--animation-easing);
      }

      :host.toast-out {
        animation: toast-animation var(--animation-duration) var(--animation-easing) reverse
          forwards;
      }

      @keyframes toast-animation {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'toastClasses()',
    '[style.display]': 'displayStyle()',
    '[style.--animation-easing]': 'params.easing',
    '[style.--animation-duration]': 'params.easeTime + "ms"',
    '[animate.enter]': 'enterAnimation()',
    '(mouseenter)': 'stickAround()',
    '(mouseleave)': 'delayedHideToast()',
    '(click)': 'tapToast()',
  },
})
export class Toast<ConfigPayload = unknown> implements OnDestroy {
  public toastPackage = inject(ToastPackage);
  protected toastrService = inject(ToastrService);
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly params = { easeTime: this.toastPackage.config.easeTime, easing: 'ease-in' };

  /** number of duplicates of this toast */
  readonly duplicatesCount = this.toastPackage.toastRef.duplicatesCount;
  protected hideTime!: number;

  /** width of progress bar */
  readonly width = signal(-1);
  readonly state = signal<'inactive' | 'active' | 'removed'>('inactive');
  /** hides component when waiting to be displayed */
  readonly displayStyle = computed(() => (this.state() === 'inactive' ? 'none' : undefined));
  readonly message = computed(() => this.toastPackage.message);
  readonly title = computed(() => this.toastPackage.title);
  readonly options = linkedSignal<IndividualConfig<ConfigPayload>>(() => this.toastPackage.config);
  readonly originalTimeout = computed(() => this.toastPackage.config.timeOut);
  readonly toastClasses = computed(
    () => `${this.toastPackage.toastType} ${this.toastPackage.config.toastClass}`,
  );
  /** enter animation class, disabled when animation is off */
  readonly enterAnimation = computed(() => (this.options().animation ? 'toast-in' : undefined));

  protected timeout: number | undefined;
  protected intervalId: number | undefined;

  constructor() {
    const toastRef = this.toastPackage.toastRef;

    effect(() => {
      if (toastRef.activated()) {
        this.activateToast();
      }
    });
    effect(() => {
      if (toastRef.manualClose() > 0) {
        this.remove();
      }
    });
    effect(() => {
      if (toastRef.resetTimeout() > 0) {
        this.resetTimeout();
      }
    });
  }

  public ngOnDestroy(): void {
    clearInterval(this.intervalId);
    clearTimeout(this.timeout);
  }

  /**
   * activates toast and sets timeout
   */
  activateToast() {
    const options = this.options();
    this.state.set('active');

    if (
      !(options.disableTimeOut === true || options.disableTimeOut === 'timeOut') &&
      options.timeOut
    ) {
      this.timeout = window.setTimeout(() => this.remove(), options.timeOut);
      this.hideTime = new Date().getTime() + options.timeOut;
      if (options.progressBar) {
        this.intervalId = window.setInterval(() => this.updateProgress(), 10);
      }
    }
  }

  /**
   * updates progress bar width
   */
  updateProgress() {
    const options = this.options();

    if (this.width() === 0 || this.width() === 100 || !options.timeOut) {
      return;
    }
    const now = new Date().getTime();
    const remaining = this.hideTime - now;
    this.width.set((remaining / options.timeOut) * 100);
    if (options.progressAnimation === 'increasing') {
      this.width.update(width => 100 - width);
    }
    if (this.width() <= 0) {
      this.width.set(0);
    }
    if (this.width() >= 100) {
      this.width.set(100);
    }
  }

  resetTimeout() {
    const options = this.options();
    clearTimeout(this.timeout);
    clearInterval(this.intervalId);
    this.state.set('active');

    this.options.update(options => ({ ...options, timeOut: this.originalTimeout() }));
    this.timeout = window.setTimeout(() => this.remove(), this.originalTimeout());
    this.hideTime = new Date().getTime() + (this.originalTimeout() || 0);
    this.width.set(-1);
    if (options.progressBar) this.intervalId = window.setInterval(() => this.updateProgress(), 10);
  }

  /**
   * tells toastrService to remove this toast after the leave animation (when enabled)
   */
  remove() {
    if (this.state() === 'removed') return;

    clearTimeout(this.timeout);
    this.state.set('removed');

    if (this.options().animation) {
      this.elementRef.nativeElement.classList.add('toast-out');
      this.timeout = window.setTimeout(
        () => this.toastrService.remove(this.toastPackage.toastId),
        +this.params.easeTime,
      );
      return;
    }

    this.timeout = window.setTimeout(() => this.toastrService.remove(this.toastPackage.toastId));
  }

  tapToast() {
    if (this.state() === 'removed') return;

    this.toastPackage.triggerTap();
    if (this.options().tapToDismiss) {
      this.remove();
    }
  }

  stickAround() {
    if (this.state() === 'removed') return;

    if (this.options().disableTimeOut !== 'extendedTimeOut') {
      clearTimeout(this.timeout);
      this.options.update(options => ({ ...options, timeOut: 0 }));
      this.hideTime = 0;

      // disable progressBar
      clearInterval(this.intervalId);
      this.width.set(0);
    }
  }

  delayedHideToast() {
    const options = this.options();
    if (
      options.disableTimeOut === true ||
      options.disableTimeOut === 'extendedTimeOut' ||
      options.extendedTimeOut === 0 ||
      this.state() === 'removed'
    ) {
      return;
    }
    const extendedTimeOut = options.extendedTimeOut;
    this.timeout = window.setTimeout(() => this.remove(), extendedTimeOut);
    this.options.update(options => ({ ...options, timeOut: extendedTimeOut }));
    this.hideTime = new Date().getTime() + (extendedTimeOut || 0);
    this.width.set(-1);
    if (options.progressBar) {
      this.intervalId = window.setInterval(() => this.updateProgress(), 10);
    }
  }
}

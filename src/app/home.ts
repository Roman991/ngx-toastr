import { Component, VERSION, inject, viewChildren } from '@angular/core';
import { GlobalConfig, ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { ToastManagerService } from './toast-manager.service';

const types = ['success', 'error', 'info', 'warning'];

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  template: `
    <section class="home-shell">
      <div class="home-frame">
        <article class="home-card">
          <div class="home-grid">
            <section class="home-column home-column--primary">
              <div class="home-field">
                <label class="home-label" for="toastTitle">
                  <strong>Title</strong>
                </label>
                <input
                  [(ngModel)]="title"
                  type="text"
                  class="home-input"
                  name="toastTitle"
                  id="toastTitle"
                  placeholder="Toast title"
                />
              </div>

              <div class="home-field">
                <label class="home-label" for="toastMessage">
                  <strong>Message</strong>
                </label>
                <textarea
                  [(ngModel)]="message"
                  rows="3"
                  class="home-input home-input--textarea"
                  name="toastMessage"
                  id="toastMessage"
                  placeholder="Toast message"
                ></textarea>
              </div>

              <div class="home-field">
                <div class="home-check-row">
                  <input
                    class="home-check-input"
                    type="checkbox"
                    [(ngModel)]="options.enableHtml"
                    id="enableHtml"
                  />
                  <label class="home-check-label" for="enableHtml">Enable HTML (message)</label>
                </div>
                <div class="home-check-row">
                  <input
                    class="home-check-input"
                    type="checkbox"
                    [(ngModel)]="options.tapToDismiss"
                    id="tapToDismiss"
                  />
                  <label class="home-check-label" for="tapToDismiss">Tap to dismiss</label>
                </div>
                <div class="home-check-row">
                  <input
                    class="home-check-input"
                    type="checkbox"
                    [(ngModel)]="options.closeButton"
                    id="closeButton"
                  />
                  <label class="home-check-label" for="closeButton">Close button</label>
                </div>
                <div class="home-check-row">
                  <input
                    class="home-check-input"
                    type="checkbox"
                    [(ngModel)]="options.preventDuplicates"
                    id="preventDuplicates"
                  />
                  <label class="home-check-label" for="preventDuplicates">Prevent duplicates</label>
                </div>
                <div class="home-check-row home-check-row--nested">
                  <input
                    class="home-check-input"
                    type="checkbox"
                    [(ngModel)]="options.countDuplicates"
                    id="countDuplicates"
                    [disabled]="!options.preventDuplicates"
                  />
                  <label class="home-check-label" for="countDuplicates">Count duplicates</label>
                </div>
                <div class="home-check-row home-check-row--nested">
                  <input
                    class="home-check-input"
                    type="checkbox"
                    [(ngModel)]="options.resetTimeoutOnDuplicate"
                    id="resetTimeoutOnDuplicate"
                    [disabled]="!options.preventDuplicates"
                  />
                  <label class="home-check-label" for="resetTimeoutOnDuplicate">
                    Reset timeout on duplicate
                  </label>
                </div>
                <div class="home-check-row home-check-row--nested">
                  <input
                    class="home-check-input"
                    type="checkbox"
                    [(ngModel)]="options.includeTitleDuplicates"
                    id="includeTitleDuplicate"
                    [disabled]="!options.preventDuplicates"
                  />
                  <label class="home-check-label" for="includeTitleDuplicate">
                    Include title in duplicate checks
                  </label>
                </div>
                <div class="home-check-row">
                  <input
                    class="home-check-input"
                    type="checkbox"
                    [(ngModel)]="options.newestOnTop"
                    id="newestOnTop"
                  />
                  <label class="home-check-label" for="newestOnTop">New toasts on top</label>
                </div>
                <div class="home-check-row">
                  <input
                    class="home-check-input"
                    type="checkbox"
                    [(ngModel)]="options.progressBar"
                    id="progressBar"
                  />
                  <label class="home-check-label" for="progressBar">Progress bar</label>
                </div>
              </div>

              <fieldset class="home-field">
                <legend class="home-legend">
                  <strong>Progress Bar Animation</strong>
                </legend>
                <div class="home-check-row">
                  <input
                    class="home-check-input"
                    type="radio"
                    name="progressAnimationRadio"
                    [(ngModel)]="options.progressAnimation"
                    value="decreasing"
                    [disabled]="!options.progressBar"
                    id="progressBarDecreasing"
                  />
                  <label class="home-check-label" for="progressBarDecreasing">Decreasing</label>
                </div>
                <div class="home-check-row">
                  <input
                    class="home-check-input"
                    type="radio"
                    name="progressAnimationRadio"
                    [(ngModel)]="options.progressAnimation"
                    value="increasing"
                    [disabled]="!options.progressBar"
                    id="progressBarIncreasing"
                  />
                  <label class="home-check-label" for="progressBarIncreasing">Increasing</label>
                </div>
              </fieldset>
            </section>

            <section class="home-column home-column--settings">
              <div class="home-field">
                <label class="home-label" for="toastTimeout">
                  <strong>Timeout</strong>
                </label>
                <input
                  type="text"
                  [(ngModel)]="options.timeOut"
                  (ngModelChange)="fixNumber('timeOut')"
                  [disabled]="
                    options.disableTimeOut === true || options.disableTimeOut === 'timeOut'
                  "
                  class="home-input"
                  id="toastTimeout"
                  aria-describedby="toastTimeoutHelp"
                />
                <small id="toastTimeoutHelp" class="home-hint">0 never expires</small>
              </div>

              <div class="home-field">
                <label class="home-label" for="toastExtendedTimeout">
                  <strong>Extended Timeout</strong>
                </label>
                <input
                  type="text"
                  [(ngModel)]="options.extendedTimeOut"
                  (ngModelChange)="fixNumber('extendedTimeOut')"
                  [disabled]="
                    options.disableTimeOut === true || options.disableTimeOut === 'extendedTimeOut'
                  "
                  class="home-input"
                  id="toastExtendedTimeout"
                />
                <small id="toastExtendedTimeoutHelp" class="home-hint">0 never expires</small>

                <fieldset class="home-subfield">
                  <legend class="home-legend">
                    <strong>Disable Timeouts</strong>
                  </legend>
                  <div class="home-check-row">
                    <input
                      type="radio"
                      class="home-check-input"
                      [(ngModel)]="options.disableTimeOut"
                      [value]="true"
                      id="disableTimeOut1"
                    />
                    <label for="disableTimeOut1" class="home-check-label">
                      <code>disableTimeOut = true</code>
                    </label>
                  </div>
                  <div class="home-check-row">
                    <input
                      type="radio"
                      class="home-check-input"
                      [(ngModel)]="options.disableTimeOut"
                      [value]="false"
                      id="disableTimeOut2"
                    />
                    <label for="disableTimeOut2" class="home-check-label">
                      <code>disableTimeOut = false</code>
                    </label>
                  </div>
                  <div class="home-check-row">
                    <input
                      type="radio"
                      class="home-check-input"
                      [(ngModel)]="options.disableTimeOut"
                      value="timeOut"
                      id="disableTimeOut3"
                    />
                    <label for="disableTimeOut3" class="home-check-label"
                      ><code>timeOut</code> only</label
                    >
                  </div>
                  <div class="home-check-row">
                    <input
                      type="radio"
                      class="home-check-input"
                      [(ngModel)]="options.disableTimeOut"
                      value="extendedTimeOut"
                      id="disableTimeOut4"
                    />
                    <label for="disableTimeOut4" class="home-check-label">
                      <code>extendedTimeOut</code> only
                    </label>
                  </div>
                </fieldset>
              </div>

              <div class="home-field">
                <label class="home-label" for="maxNumberToasts">
                  <strong>Maximum Toasts</strong>
                </label>
                <input
                  [(ngModel)]="toastr.toastrConfig.maxOpened"
                  (ngModelChange)="fixNumber('maxOpened')"
                  type="text"
                  class="home-input"
                  id="maxNumberToasts"
                  aria-describedby="maxNumberToastsHelp"
                />
                <small id="maxNumberToastsHelp" class="home-hint">0 is no limit</small>
                <div class="home-check-row home-check-row--compact">
                  <input
                    type="checkbox"
                    class="home-check-input"
                    [(ngModel)]="toastr.toastrConfig.autoDismiss"
                    id="autoDismiss"
                  />
                  <label for="autoDismiss" class="home-check-label">Auto dismiss on max</label>
                </div>
              </div>

              <div class="home-field home-field--compact">
                <label class="home-label" for="toastEaseTime">
                  <strong>Ease Time</strong>
                </label>
                <input
                  type="text"
                  [(ngModel)]="toastr.toastrConfig.easeTime"
                  (ngModelChange)="fixNumber('easeTime')"
                  class="home-input"
                  id="toastEaseTime"
                />
              </div>
            </section>

            <section class="home-column home-column--sidebar">
              <div class="home-side-grid">
                <fieldset class="home-field">
                  <legend class="home-legend">
                    <strong>Toast Type</strong>
                  </legend>
                  <div class="home-check-row">
                    <input
                      class="home-check-input"
                      type="radio"
                      name="typeRadios"
                      [(ngModel)]="type"
                      value="success"
                      id="typesuccess"
                    />
                    <label class="home-check-label" for="typesuccess">Success</label>
                  </div>
                  <div class="home-check-row">
                    <input
                      class="home-check-input"
                      type="radio"
                      name="typeRadios"
                      [(ngModel)]="type"
                      value="info"
                      id="typeinfo"
                    />
                    <label class="home-check-label" for="typeinfo">Info</label>
                  </div>
                  <div class="home-check-row">
                    <input
                      class="home-check-input"
                      type="radio"
                      name="typeRadios"
                      [(ngModel)]="type"
                      value="warning"
                      id="typewarning"
                    />
                    <label class="home-check-label" for="typewarning">Warning</label>
                  </div>
                  <div class="home-check-row">
                    <input
                      class="home-check-input"
                      type="radio"
                      name="typeRadios"
                      [(ngModel)]="type"
                      value="error"
                      id="typeerror"
                    />
                    <label class="home-check-label" for="typeerror">Error</label>
                  </div>
                </fieldset>

                <div class="home-side-stack">
                  <fieldset class="home-field">
                    <legend class="home-legend">
                      <strong>Toast Position</strong>
                    </legend>
                    <div class="home-check-row">
                      <input
                        class="home-check-input"
                        type="radio"
                        name="positionRadio"
                        [(ngModel)]="options.positionClass"
                        [disabled]="inline"
                        value="toast-top-right"
                        id="toast-top-right"
                      />
                      <label for="toast-top-right" class="home-check-label">Top Right</label>
                    </div>
                    <div class="home-check-row">
                      <input
                        class="home-check-input"
                        type="radio"
                        name="positionRadio"
                        [(ngModel)]="options.positionClass"
                        [disabled]="inline"
                        value="toast-bottom-right"
                        id="toast-bottom-right"
                      />
                      <label for="toast-bottom-right" class="home-check-label">Bottom Right</label>
                    </div>
                    <div class="home-check-row">
                      <input
                        class="home-check-input"
                        type="radio"
                        name="positionRadio"
                        [(ngModel)]="options.positionClass"
                        [disabled]="inline"
                        value="toast-bottom-left"
                        id="toast-bottom-left"
                      />
                      <label for="toast-bottom-left" class="home-check-label">Bottom Left</label>
                    </div>
                    <div class="home-check-row">
                      <input
                        class="home-check-input"
                        type="radio"
                        name="positionRadio"
                        [(ngModel)]="options.positionClass"
                        [disabled]="inline"
                        value="toast-top-left"
                        id="toast-top-left"
                      />
                      <label for="toast-top-left" class="home-check-label">Top Left</label>
                    </div>
                    <div class="home-check-row">
                      <input
                        class="home-check-input"
                        type="radio"
                        name="positionRadio"
                        [(ngModel)]="options.positionClass"
                        [disabled]="inline"
                        value="toast-top-full-width"
                        id="top-full-width"
                      />
                      <label for="top-full-width" class="home-check-label">Top Full Width</label>
                    </div>
                    <div class="home-check-row">
                      <input
                        class="home-check-input"
                        type="radio"
                        name="positionRadio"
                        [(ngModel)]="options.positionClass"
                        [disabled]="inline"
                        value="toast-bottom-full-width"
                        id="bottom-full-width"
                      />
                      <label for="bottom-full-width" class="home-check-label"
                        >Bottom Full Width</label
                      >
                    </div>
                    <div class="home-check-row">
                      <input
                        class="home-check-input"
                        type="radio"
                        name="positionRadio"
                        [(ngModel)]="options.positionClass"
                        [disabled]="inline"
                        value="toast-top-center"
                        id="toast-top-center"
                      />
                      <label for="toast-top-center" class="home-check-label">Top Center</label>
                    </div>
                    <div class="home-check-row">
                      <input
                        class="home-check-input"
                        type="radio"
                        name="positionRadio"
                        [(ngModel)]="options.positionClass"
                        [disabled]="inline"
                        value="toast-bottom-center"
                        id="toast-bottom-center"
                      />
                      <label for="toast-bottom-center" class="home-check-label"
                        >Bottom Center</label
                      >
                    </div>
                  </fieldset>

                  <div class="home-field home-field--compact">
                    <div class="home-check-row">
                      <input
                        class="home-check-input"
                        type="checkbox"
                        (ngModelChange)="setInlineClass($event)"
                        [(ngModel)]="inline"
                        id="inline"
                      />
                      <label for="inline" class="home-check-label">Inline Position</label>
                    </div>
                    <div class="home-check-row">
                      <input
                        class="home-check-input"
                        type="radio"
                        name="inlinePositionRadio"
                        (ngModelChange)="setInlinePosition($event)"
                        [(ngModel)]="inlinePositionIndex"
                        [disabled]="!inline"
                        [value]="0"
                        id="inline-a"
                      />
                      <label for="inline-a" class="home-check-label">A</label>
                    </div>
                    <div class="home-check-row">
                      <input
                        class="home-check-input"
                        type="radio"
                        name="inlinePositionRadio"
                        (ngModelChange)="setInlinePosition($event)"
                        [(ngModel)]="inlinePositionIndex"
                        [disabled]="!inline"
                        [value]="1"
                        id="inline-b"
                      />
                      <label for="inline-b" class="home-check-label">B</label>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section class="home-inline-grid">
              <div class="home-inline-slot">
                <label class="home-label" for="inline-a-anchor">
                  <strong>Inline A</strong>
                </label>
                <span id="inline-a-anchor" toastContainer></span>
              </div>
              <div class="home-inline-slot">
                <label class="home-label" for="inline-b-anchor">
                  <strong>Inline B</strong>
                </label>
                <span id="inline-b-anchor" toastContainer></span>
              </div>
            </section>
          </div>

          <hr />

          <section class="home-actions">
            <p class="home-section-note">
              <small>Toast Controls:</small>
            </p>
            <div class="home-button-row home-button-row--primary">
              <button
                (click)="toastManager.openToastAnimation(options, type, { message, title })"
                type="button"
                class="home-button home-button--primary"
              >
                Open Toast
              </button>

              <button
                (click)="toastManager.clearLastToast()"
                type="button"
                class="home-button home-button--outline"
              >
                Clear Last Toast
              </button>

              <button
                (click)="toastManager.clearToasts()"
                type="button"
                class="home-button home-button--outline"
              >
                Clear All Toasts
              </button>
            </div>
          </section>

          <section class="home-actions home-actions--examples">
            <p class="home-section-note">
              <small>Example Custom Toasts:</small>
            </p>
            <div class="home-button-row">
              <button
                (click)="toastManager.openToastNoAnimation(options, type, { message, title })"
                type="button"
                class="home-button home-button--small home-button--light"
              >
                No Animations
              </button>
              <button
                (click)="toastManager.openBootstrapToast(options, { message, title })"
                type="button"
                class="home-button home-button--small home-button--light"
              >
                Bootstrap 5's Toast
              </button>
              <button
                (click)="toastManager.openPinkToast(options, { message, title })"
                type="button"
                class="home-button home-button--small home-button--pink"
              >
                Pink
              </button>
              <button
                (click)="toastManager.openNotyf(options, { message, title })"
                type="button"
                class="home-button home-button--small home-button--dark"
              >
                Notyf
              </button>
            </div>
          </section>
        </article>
      </div>
    </section>
  `,
})
export class HomeComponent {
  protected toastr = inject(ToastrService);
  protected toastManager = inject(ToastManagerService);

  options: GlobalConfig;
  title = '';
  message = '';
  type = types[0];
  version = VERSION;
  enableBootstrap = false;
  inline = false;
  inlinePositionIndex = 0;
  inlineContainers = viewChildren(ToastContainerDirective);

  constructor() {
    this.options = this.toastr.toastrConfig;
  }

  fixNumber<K extends keyof GlobalConfig>(field: K): void {
    this.options[field] = Number(this.options[field]) as never;
  }

  setInlineClass(enableInline: boolean) {
    if (enableInline) {
      this.toastr.overlayContainer = this.inlineContainers()[this.inlinePositionIndex];
      this.options.positionClass = 'inline';
    } else {
      this.toastr.overlayContainer = undefined;
      this.options.positionClass = 'toast-top-right';
    }
  }

  setInlinePosition(index: number) {
    this.toastr.overlayContainer = this.inlineContainers()[index];
  }
}

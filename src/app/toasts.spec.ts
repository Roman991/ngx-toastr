import { Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Toast, ActiveToast, ToastrService, provideToastr } from 'ngx-toastr';
import { NotyfToast } from './notyf-toast';
import { PinkToast } from './pink-toast';
import type { BootstrapToast } from './bootstrap-toast';
import { ToastManagerService } from './toast-manager.service';

/**
 * Resolves once the given signal satisfies the predicate. Flushes Angular's
 * change detection / effects on each poll so dynamically created toasts advance.
 */
function awaitSignal<T>(sig: Signal<T>, predicate: (value: T) => boolean): Promise<void> {
  return new Promise(resolve => {
    const check = () => {
      TestBed.tick();
      if (predicate(sig())) {
        resolve();
        return;
      }
      setTimeout(check, 5);
    };
    setTimeout(check, 5);
  });
}

const whenShown = (toast: ActiveToast<unknown>) => awaitSignal(toast.onShown, shown => shown);
const whenHidden = (toast: ActiveToast<unknown>) => awaitSignal(toast.onHidden, hidden => hidden);

describe('Toasts', () => {
  let toastManager!: ToastManagerService;
  let toastrService!: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideToastr({
          timeOut: 800,
          progressBar: true,
          enableHtml: true,
        }),
        ToastManagerService,
        ToastrService,
      ],
    });

    toastManager = TestBed.inject(ToastManagerService);
    toastrService = TestBed.inject(ToastrService);
  });

  it('should trigger onShown', async () => {
    const opened = toastManager.openToastAnimation() as ActiveToast<Toast>;

    expect(opened).toBeDefined();
    await whenShown(opened);
  });

  it('should trigger onHidden', async () => {
    const opened = toastManager.openToastAnimation() as ActiveToast<Toast>;

    expect(opened.portal).toBeDefined();
    await whenHidden(opened);
  });

  it('should trigger onTap', async () => {
    const opened = toastManager.openToastAnimation() as ActiveToast<Toast>;

    expect(opened.portal).toBeDefined();
    const tapped = awaitSignal(opened.onTap, count => count > 0);
    opened.portal.instance.tapToast();
    await tapped;
  });

  it('should extend life on mouseover and exit', () => {
    const opened = toastManager.openToastAnimation() as ActiveToast<Toast>;

    opened.portal.instance.stickAround();
    opened.portal.instance.delayedHideToast();
    expect(opened.portal.instance.options().timeOut).toBe(1000);
  });

  it('should keep on mouse exit with extended timeout 0', () => {
    toastrService.toastrConfig.extendedTimeOut = 0;
    const opened = toastManager.openToastAnimation() as ActiveToast<Toast>;

    opened.portal.instance.stickAround();
    opened.portal.instance.delayedHideToast();
    expect(opened.portal.instance.options().timeOut).toBe(0);
  });

  it('should trigger onShown for openPinkToast', async () => {
    const opened = toastManager.openPinkToast() as ActiveToast<PinkToast>;

    expect(opened.portal).toBeDefined();
    await whenShown(opened);
  });

  it('should trigger onAction for openPinkToast', async () => {
    const opened = toastManager.openPinkToast() as ActiveToast<PinkToast>;

    expect(opened.portal).toBeDefined();
    const actioned = awaitSignal(opened.onAction, count => count > 0);
    opened.portal.instance.action(new Event('click'));
    await actioned;
  });

  it('should trigger onHidden for openPinkToast', async () => {
    const opened = toastManager.openPinkToast() as ActiveToast<PinkToast>;

    expect(opened.portal).toBeDefined();
    await whenHidden(opened);
  });

  it('should trigger onShown for openNotyf', async () => {
    const opened = toastManager.openNotyf() as ActiveToast<NotyfToast>;

    expect(opened.portal).toBeDefined();
    await whenShown(opened);
  });

  it('should trigger onHidden for openNotyf', async () => {
    const opened = toastManager.openNotyf() as ActiveToast<NotyfToast>;

    expect(opened.portal).toBeDefined();
    await whenHidden(opened);
  });

  it('should have defined componentInstance', () => {
    const opened = toastManager.openToastAnimation() as ActiveToast<Toast>;
    expect(opened.toastRef.componentInstance).toBeDefined();
  });

  it('should have defined componentInstance BootstrapToast', () => {
    const opened = toastManager.openBootstrapToast() as ActiveToast<BootstrapToast>;
    expect(opened.toastRef.componentInstance).toBeDefined();
  });

  it('should have defined componentInstance ToastNoAnim', () => {
    const opened = toastManager.openToastNoAnimation() as ActiveToast<Toast>;
    expect(opened.toastRef.componentInstance).toBeDefined();
  });

  it('should close all toasts', () => {
    vi.useFakeTimers();

    toastManager.openToastNoAnimation();
    toastManager.openToastNoAnimation();
    toastManager.openToastNoAnimation();

    expect(toastrService.currentlyActive).toBe(3);

    toastManager.clearToasts();
    TestBed.tick();
    vi.advanceTimersByTime(1);
    expect(toastrService.currentlyActive).toBe(0);

    vi.useRealTimers();
  });

  it('Should close last toast', async () => {
    toastManager.openToastNoAnimation();
    const lastToast = toastManager.openToastNoAnimation();
    expect(toastrService.currentlyActive).toBe(2);

    const hidden = whenHidden(lastToast!);
    toastManager.clearLastToast();
    await hidden;
  });
});

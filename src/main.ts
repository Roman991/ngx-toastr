import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideToastr } from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideToastr(),
  ],
}).catch(err => console.error(err));

import { Component } from '@angular/core';
import { FooterComponent } from './footer';
import { HeaderComponent } from './header';
import { HomeComponent } from './home';

@Component({
  selector: 'app-root',
  imports: [FooterComponent, HeaderComponent, HomeComponent],
  template: `
    <app-header></app-header>
    <app-home></app-home>
    <app-footer></app-footer>
  `,
})
export class AppComponent {}

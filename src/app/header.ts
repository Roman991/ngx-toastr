import { Component } from '@angular/core';
import { GhButtonModule } from '@ctrl/ngx-github-buttons';

@Component({
  selector: 'app-header',
  template: `
    <header class="site-header">
      <h1>Angular Toastr</h1>
      <p class="site-header__tagline">Easy Toasts for Angular</p>
      <gh-button user="scttcper" repo="ngx-toastr" [count]="true"></gh-button>
    </header>
  `,
  imports: [GhButtonModule],
})
export class HeaderComponent {}

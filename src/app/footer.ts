import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="site-footer">
      Angular {{ version }}
      <br />
      <a href="https://github.com/scttcper/ngx-toastr/blob/master/LICENSE">MIT license</a>
      -
      <a href="https://github.com/scttcper/ngx-toastr">Source</a>
    </footer>
  `,
  styles: [
    `
      .site-footer {
        margin: 48px 0 24px;
        line-height: 2;
        text-align: center;
        font-size: 11px;
        font-family: var(--font-mono);
        color: #999;
      }
    `,
  ],
})
export class FooterComponent {
  version = VERSION.full;
}

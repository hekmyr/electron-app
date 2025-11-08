import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <h1 class="font-bold text-xl">Welcome to {{ title() }}!</h1>

    <p>{{ content() }}</p>

    <router-outlet />
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('Logix');

  protected readonly content = signal(
    (() => {
      const v = window.electron.version;
      return `This app is using Chrome (v${v.chrome}), Node.js (v${v.node}), and Electron (v${v.electron})`;
    })()
  );
}
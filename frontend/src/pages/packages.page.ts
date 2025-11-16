import { Component } from "@angular/core";
import { ShellComponent } from "@libs/app/shell.component";
import { BreadcrumbItem } from "@libs/app/header.component";

@Component({
  selector: 'app-packages',
  imports: [ShellComponent],
  template: `
    <app-shell [breadcrumbs]="_breadcrumbs">
      <h1>Packages</h1>
      <p>{{ content }}</p>
    </app-shell>
  `
})
export class PackagesPage {
  protected readonly _breadcrumbs: BreadcrumbItem[] = [
    { label: "Packages", url: "/packages" }
  ];

  protected readonly content = (() => {
    if (!window.electron) return 'Electron service not found';
    const v = window.electron.version;
    return `This app is using Chrome (v${v.chrome}), Node.js (v${v.node}), and Electron (v${v.electron})`;
  })()
}

import { Component } from "@angular/core";
import { ShellComponent } from "@libs/app/shell.component";
import { BreadcrumbItem } from "@libs/app/header.component";

@Component({
  selector: 'app-dashboard',
  imports: [ShellComponent],
  template: `
    <app-shell [breadcrumbs]="_breadcrumbs">
      <h1>Dashboard</h1>
      <p>{{ content }}</p>
    </app-shell>
  `
})
export class DashboardPage {
  protected readonly _breadcrumbs: BreadcrumbItem[] = [
    { label: "Dashboard", url: "/" }
  ];

  protected readonly content = (() => {
    if (!window.electron) return 'Electron service not found';
    const v = window.electron.version;
    return `This app is using Chrome (v${v.chrome}), Node.js (v${v.node}), and Electron (v${v.electron})`;
  })()
}

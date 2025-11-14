import { Component } from "@angular/core";
import { ShellComponent } from "@libs/app/shell.component";
import { BreadcrumbItem } from "@libs/app/header.component";

@Component({
  selector: 'app-customers',
  imports: [ShellComponent],
  template: `
    <app-shell [breadcrumbs]="breadcrumbs">
      <h1>Customers</h1>
      <p>{{ content }}</p>
    </app-shell>
  `
})
export class CustomersPage {
  protected readonly breadcrumbs: BreadcrumbItem[] = [
    { label: "Customers", url: "/customers" }
  ];

  protected readonly content = (() => {
    if (!window.electron) return 'Electron service not found';
    const v = window.electron.version;
    return `This app is using Chrome (v${v.chrome}), Node.js (v${v.node}), and Electron (v${v.electron})`;
  })()
}

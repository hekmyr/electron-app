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

  protected readonly content = "Dashboard content";
}

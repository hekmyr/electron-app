import { Component, input } from "@angular/core";
import { HeaderComponent, BreadcrumbItem } from "@libs/app/header.component";

@Component({
  selector: 'app-shell',
  imports: [HeaderComponent],
  template: `
    <div class="p-2">
      <app-header [value]="breadcrumbs()" />
      <ng-content />
    </div>
  `
})
export class ShellComponent {
  public readonly breadcrumbs = input.required<BreadcrumbItem[]>();
}

import { Component, input } from "@angular/core";
import { BreadcrumbItem, HeaderComponent, QuickAction } from "@libs/app/header.component";

@Component({
  selector: 'app-shell',
  imports: [HeaderComponent],
  template: `
    <div class="py-2 w-full">
      <app-header
        [value]="breadcrumbs()"
        [actions]="actions()"
      />
      <ng-content />
    </div>
  `
})
export class ShellComponent {
  public readonly breadcrumbs = input.required<BreadcrumbItem[]>();
  public readonly actions = input<QuickAction[]>([]);
}

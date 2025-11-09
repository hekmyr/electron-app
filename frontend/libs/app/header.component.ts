import { Component, input } from "@angular/core";
import { HlmBreadCrumbImports } from "@spartan-ng/helm/breadcrumb";

@Component({
  selector: 'app-header',
  imports: [HlmBreadCrumbImports],
  template: `
    <nav hlmBreadcrumb>
      <ol hlmBreadcrumbList>
        @let breadcrumbs = value();
        @for (item of breadcrumbs; let idx = $index; track idx) {
          <li hlmBreadcrumbItem>
            <a hlmBreadcrumbLink link="{{ item.url }}">{{ item.label }}</a>
          </li>
          @if (idx < breadcrumbs.length - 1) {
            <li hlmBreadcrumbSeparator> </li>
          }
        }
      </ol>
    </nav>
  `
})
export class HeaderComponent {
  public readonly value = input.required<BreadcrumbItem[]>();
}

export interface BreadcrumbItem {
  label: string,
  url: string
}

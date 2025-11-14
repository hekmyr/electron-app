import { Component, input } from "@angular/core";
import { HlmBreadCrumbImports } from "@spartan-ng/helm/breadcrumb";
import { HlmSidebarTrigger } from "@spartan-ng/helm/sidebar";

@Component({
  selector: 'app-header',
  imports: [HlmBreadCrumbImports, HlmSidebarTrigger],
  template: `
    <header>
      <div class="flex items-center gap-2">
        <button
          hlmSidebarTrigger
        ></button>
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
      </div>
    </header>
  `
})
export class HeaderComponent {
  public readonly value = input.required<BreadcrumbItem[]>();
}

export interface BreadcrumbItem {
  label: string,
  url: string
}

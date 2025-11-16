import { Icon } from "@/shared/types/icon";
import { Component, input } from "@angular/core";
import { NgIcon } from '@ng-icons/core';
import { HlmBreadCrumbImports } from "@spartan-ng/helm/breadcrumb";
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSidebarTrigger } from "@spartan-ng/helm/sidebar";

@Component({
  selector: 'app-header',
  imports: [HlmBreadCrumbImports, HlmSidebarTrigger, NgIcon, HlmButtonImports, HlmIconImports],
  template: `
    <header>
      <div class="flex justify-between">
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
        <div class="flex items-center gap-2">
          @let actions = actionsSignal();
          @for (a of actions; track a) {
            <button
              hlmBtn
              variant="ghost"
              (click)="a.onClick()"
              size="icon"
            >
              <ng-icon hlm size="sm" [name]="a.icon.name" />
            </button>
          }
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  public readonly value = input.required<BreadcrumbItem[]>();
  public readonly actionsSignal = input<QuickAction[]>([], { alias: 'actions' });
}

export interface BreadcrumbItem {
  label: string,
  url: string
}

export interface QuickAction {
  icon: Icon;
  onClick: () => void;
}

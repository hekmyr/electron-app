import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { HlmSidebarImports } from "@spartan-ng/helm/sidebar";

@Component({
  selector: 'app-sidebar',
  imports: [HlmSidebarImports, RouterLink],
  template: `
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarHeader>{{ title() }}</div>
        <div hlmSidebarContent>
          @let groups = value();
          @for (group of groups; track group.label ?? $index) {
            <div hlmSidebarGroup>
              @if (group.label) {
                <div hlmSidebarGroupLabel>{{ group.label }}</div>
              }
              <div hlmSidebarGroupContent>
                <ul hlmSidebarMenu>
                  @for (item of group.items; track item.url) {
                    <li hlmSidebarMenuItem>
                      <a hlmSidebarMenuButton [routerLink]="item.url">{{ item.label }}</a>
                    </li>
                  }
                </ul>
              </div>
            </div>
          }
        </div>
        <div hlmSidebarFooter></div>
      </hlm-sidebar>
      <ng-content />
    </div>
  `
})
export class SidebarComponent {
  public readonly title = input.required<string>();
  public readonly value = input.required<SidebarGroup[]>();
}

interface SidebarItem {
  label: string;
  url: string;
}

export interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}

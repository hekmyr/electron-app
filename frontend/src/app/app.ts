import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { SidebarComponent, SidebarGroup } from '@libs/app/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HlmBreadCrumbImports,
    HlmSidebarImports,
    SidebarComponent
  ],
  template: `
    <app-sidebar
      [title]="title"
      [value]="sidebar"
    >
      <router-outlet />
    </app-sidebar>
  `,
})
export class App {
  protected readonly title = 'Logix';

  protected readonly sidebar: SidebarGroup[] = [
    {
      items: [{ label: 'Dashboard', url: '/' }]
    },
    {
      label: 'Manage',
      items: [
        { label: 'Customers', url: '/customers' },
        { label: 'Packages', url: '/packages' }
      ]
    }
  ];
}

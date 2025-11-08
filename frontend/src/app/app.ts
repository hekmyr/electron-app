import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HlmBreadCrumbImports, HlmSidebarImports],
  template: `
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarHeader>{{ title() }}</div>
        <div hlmSidebarContent>
          <div hlmSidebarGroup>
            <div hlmSidebarGroupLabel>Group 1</div>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton>Item 1.1</a>
                </li>
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton>Item 1.2</a>
                </li>
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton>Item 1.3</a>
                </li>
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton>Item 1.4</a>
                </li>
              </ul>
            </div>
          </div>
            <div hlmSidebarGroup>
            <div hlmSidebarGroupLabel>Group 2</div>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton>Item 2.1</a>
                </li>
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton>Item 2.2</a>
                </li>
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton>Item 2.3</a>
                </li>
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton>Item 2.4</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div hlmSidebarFooter></div>
      </hlm-sidebar>
      <div>
        <nav hlmBreadcrumb>
          <ol hlmBreadcrumbList>
            <li hlmBreadcrumbItem>
              <a hlmBreadcrumbLink link="/">Home</a>
            </li>
            <li hlmBreadcrumbSeparator></li>
            <li hlmBreadcrumbItem>
              <hlm-breadcrumb-ellipsis />
            </li>
            <li hlmBreadcrumbSeparator></li>
            <li hlmBreadcrumbItem>
              <a hlmBreadcrumbLink link="/components">Components</a>
            </li>
            <li hlmBreadcrumbSeparator></li>
            <li hlmBreadcrumbItem>
              <span hlmBreadcrumbPage>Breadcrumb</span>
            </li>
          </ol>
        </nav>
        <p>{{ content() }}</p>
      </div>
    </div>

    <router-outlet />
  `,
})
export class App {
  protected readonly title = signal('Logix');

  protected readonly content = signal(
    (() => {
      const v = window.electron.version;
      return `This app is using Chrome (v${v.chrome}), Node.js (v${v.node}), and Electron (v${v.electron})`;
    })()
  );
}

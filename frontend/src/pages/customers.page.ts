import { Component } from "@angular/core";
import { BreadcrumbItem, IconValue, QuickAction } from "@libs/app/header.component";
import { ShellComponent } from "@libs/app/shell.component";
import { provideIcons } from "@ng-icons/core";
import { lucidePlus } from "@ng-icons/lucide";

const actions: QuickAction[] = [
  {
    icon: { name: 'lucide-plus', value: lucidePlus, key: 'lucidePlus' },
    onClick: () => { }
  }
];

@Component({
  selector: 'app-customers',
  imports: [ShellComponent],
  template: `
    <app-shell
      [breadcrumbs]="breadcrumbs"
      [actions]="actions"
    >
      <h1>Customers</h1>
      <p>{{ content }}</p>
    </app-shell>
  `,
  providers: [
    provideIcons({ ...provideActionIcons(actions) })
  ]
})
export class CustomersPage {
  protected readonly breadcrumbs: BreadcrumbItem[] = [
    { label: "Customers", url: "/customers" }
  ];
  protected readonly actions = actions;

  protected readonly content = (() => {
    if (!window.electron) return 'Electron service not found';
    const v = window.electron.version;
    return `This app is using Chrome (v${v.chrome}), Node.js (v${v.node}), and Electron (v${v.electron})`;
  })()
}

export function provideActionIcons(actions: QuickAction[]) {
  let icons: Record<string, IconValue> = {};
  for (const a of actions) {
    icons[a.icon.key] = a.icon.value;
  }
  return icons;
}

import { DataService, DataServiceImpl } from "@/shared/services/data";
import { Component, inject } from "@angular/core";
import { BreadcrumbItem, IconValue, QuickAction } from "@libs/app/header.component";
import { ShellComponent } from "@libs/app/shell.component";
import { TableComponent } from '@libs/app/table.component';
import { provideIcons } from "@ng-icons/core";
import { lucidePlus } from "@ng-icons/lucide";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";

const actions: QuickAction[] = [
  {
    icon: { name: 'lucide-plus', value: lucidePlus, key: 'lucidePlus' },
    onClick: () => { }
  }
];

@Component({
  selector: 'app-customers',
  imports: [
    ShellComponent,
    TableComponent
  ],
  template: `
    <app-shell
      [breadcrumbs]="_breadcrumbs"
      [actions]="actions"
    >
      <app-table [data]="_customers" [columns]="_columns" />
    </app-shell>
  `,
  providers: [
    provideIcons({ ...provideActionIcons(actions) })
  ]
})
export class CustomersPage {
  private readonly _dataService: DataService;

  protected readonly _breadcrumbs: BreadcrumbItem[] = [
    { label: "Customers", url: "/customers" }
  ];
  protected readonly actions = actions;

  protected readonly _customers: CustomerDTO[] = [];
  protected readonly _columns = [
    {
      accessorKey: 'id',
       id: 'id',
        header: 'ID',
        enableSorting: false,
        cell: (info: { getValue<T>(): () => T }) => `${info.getValue<string>()}`,
    },
    {
      accessorKey: 'email',
      id: 'email',
      header: 'Email',
      enableSorting: false,
      cell: (info: { getValue<T>(): () => T }) => `${info.getValue<string>()}`,
    },
    {
      accessorKey: 'firstName',
      id: 'firstName',
      header: 'First Name',
      enableSorting: false,
      cell: (info: { getValue<T>(): () => T }) => `${info.getValue<string>()}`,
    },
    {
      accessorKey: 'lastName',
      id: 'lastName',
      header: 'Last Name',
      enableSorting: false,
      cell: (info: { getValue<T>(): () => T }) => `${info.getValue<string>()}`,
    },
    {
      accessorKey: 'birthdate',
      id: 'birthdate',
      header: 'Age',
      enableSorting: false,
      cell: (info: { getValue<T>(): () => T }) => `${info.getValue<Date>()}`,
    },
    {
      accessorKey: 'createdAt',
      id: 'createdAt',
      header: 'Created',
      enableSorting: false,
      cell: (info: { getValue<T>(): () => T }) => `${info.getValue<Date>()}`,
    },
  ];

  constructor() {
    this._dataService = inject(DataServiceImpl);
    this._customers = this._dataService.customers.findCustomers(40);
  }
}

export function provideActionIcons(actions: QuickAction[]) {
  let icons: Record<string, IconValue> = {};
  for (const a of actions) {
    icons[a.icon.key] = a.icon.value;
  }
  return icons;
}

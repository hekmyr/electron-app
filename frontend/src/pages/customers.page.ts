import { DataService, DataServiceImpl } from "@/shared/services/data";
import { IconValue } from "@/shared/types/icon";
import { Component, inject } from "@angular/core";
import { Action } from "@libs/customer/customer-actions.component";
import { BreadcrumbItem, QuickAction } from "@libs/app/header.component";
import { ShellComponent } from "@libs/app/shell.component";
import { CustomerTableComponent } from '@libs/customer/customer-table.component';
import { CustomerFormComponent } from "@libs/customer/customer-form.component";
import { provideIcons } from "@ng-icons/core";
import { lucidePenLine, lucidePlus } from "@ng-icons/lucide";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";
import type { CellContext } from "@tanstack/angular-table";

const quickActions: QuickAction[] = [
  {
    icon: { name: 'lucide-plus', value: lucidePlus, key: 'lucidePlus' },
    onClick: () => { }
  }
];

const rowActions: Action<CustomerDTO>[] = [
  { 
    label: 'Edit',
    icon: { name: 'lucide-pen-line', value: lucidePenLine, key: 'lucidePenLine' },
    execute: () => { },
    dialog: {
      title: 'Edit customer',
      description: 'Update the customer informations and save your changes.',
      component: CustomerFormComponent,
      inputs: (customer) => ({ customer }),
    },
  },
  // {
  //   label: 'Delete',
  //   icon: { name: 'lucide-trash-2', value: lucideTrash2, key: 'lucideTrash2' },
  //   onClick: () => { }
  // }
];

@Component({
  selector: 'app-customers',
  imports: [
    ShellComponent,
    CustomerTableComponent
  ],
  template: `
    <app-shell
      [breadcrumbs]="_breadcrumbs"
      [actions]="_quickActions"
    >
      <app-table
        [data]="_customers"
        [columns]="_columns"
        [actions]="_rowActions"
      />
    </app-shell>
  `,
  providers: [
    provideIcons({
      ...provideActionIcons(quickActions),
      ...provideActionIcons(rowActions)
    })
  ]
})
export class CustomersPage {
  private readonly _dataService: DataService;

  protected readonly _quickActions = quickActions;
  protected readonly _rowActions = rowActions;

  private static readonly _columnMeta: ColumnMeta = { kind: 'rowActions' };

  protected readonly _breadcrumbs: BreadcrumbItem[] = [
    { label: "Customers", url: "/customers" }
  ];

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
    {
      id: 'rowActions',
      enableHiding: false,
      meta: CustomersPage._columnMeta,
      cell: ({ row }: CellContext<CustomerDTO, unknown>) => row.original,
    },
  ];

  constructor() {
    this._dataService = inject(DataServiceImpl);
    this._customers = this._dataService.customers.findCustomers(40);
  }
}

export function provideActionIcons(actions: { icon: { key: string; value: IconValue } }[]) {
  let icons: Record<string, IconValue> = {};
  for (const a of actions) {
    icons[a.icon.key] = a.icon.value;
  }
  return icons;
}

interface ColumnMeta {
  kind?: 'rowActions';
}

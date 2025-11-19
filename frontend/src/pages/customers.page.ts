import { DataService, DataServiceImpl } from "@/shared/services/data";
import { IconValue } from "@/shared/types/icon";
import { Component, inject, signal } from "@angular/core";
import { CustomerAction } from "@libs/customer/customer-actions.component";
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
        [data]="_customers()"
        [columns]="_columns"
        [actions]="_rowActions"
      />
    </app-shell>
  `,
  providers: [
    provideIcons({
      lucidePenLine,
      lucidePlus
    })
  ]
})
export class CustomersPage {
  private readonly _dataService: DataService;
  private readonly _customersMap: Map<string, CustomerDTO>;

  protected readonly _quickActions = quickActions;
  protected readonly _rowActions: CustomerAction[];

  private static readonly _columnMeta: ColumnMeta = { kind: 'rowActions' };

  protected readonly _breadcrumbs: BreadcrumbItem[] = [
    { label: "Customers", url: "/customers" }
  ];

  protected readonly _customers = signal<CustomerDTO[]>([]);
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
    this._customersMap = this._dataService.customers.findCustomers(40);
    this._customers.set(Array.from(this._customersMap.values()));

    this._rowActions = [
      {
        label: 'Edit',
        icon: { name: 'lucide-pen-line', value: lucidePenLine, key: 'lucidePenLine' },
        dialog: {
          title: 'Edit customer',
          description: 'Update the customer informations and save your changes.',
          inputs: (customer: CustomerDTO) => ({
            customer,
            save: (result: { id: string; customer: CustomerDTO }) => this.updateCustomer(result)
          }),
        },
      },
    ];
  }

  private updateCustomer(result: { id: string; customer: CustomerDTO }) {
    this._customersMap.set(result.id, result.customer);
    this._customers.set(Array.from(this._customersMap.values()));

    this._dataService
      .customers
      .updateCustomer(result.id, result.customer);
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

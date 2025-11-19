import { DataService, DataServiceImpl } from "@/shared/services/data";
import { IconValue } from "@/shared/types/icon";
import { Component, inject, signal } from "@angular/core";
import { BreadcrumbItem, QuickAction } from "@libs/app/header.component";
import { ShellComponent } from "@libs/app/shell.component";
import { CustomerAction } from "@libs/customer/customer-actions.component";
import { CustomerTableComponent } from '@libs/customer/customer-table.component';
import { provideIcons } from "@ng-icons/core";
import { lucidePenLine, lucidePlus, lucideTrash2 } from "@ng-icons/lucide";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";
import type { CellContext } from "@tanstack/angular-table";

import { HlmAlertDialogImports } from "@libs/ui/alert-dialog/src";
import { BrnAlertDialogImports } from "@spartan-ng/brain/alert-dialog";
import { HlmButton } from "@libs/ui/button/src";
import { CustomerFormComponent } from "@libs/customer/customer-form.component";

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

    CustomerTableComponent,
    HlmAlertDialogImports,
    BrnAlertDialogImports,
    HlmButton,
    CustomerFormComponent
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

      <hlm-alert-dialog>
        <button
          id="add-customer-trigger"
          class="hidden"
          brnAlertDialogTrigger
        ></button>
        <hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
          <hlm-alert-dialog-header>
            <h2 hlmAlertDialogTitle>Add customer</h2>
            <p hlmAlertDialogDescription>
              Create a new customer.
            </p>
          </hlm-alert-dialog-header>

          <customer-form
            #formComponent
            (save)="handleCreate($event, ctx)"
          />

          <hlm-alert-dialog-footer>
            <button
              hlmAlertDialogCancel
              variant="ghost"
              (click)="ctx.close()"
            >
              Cancel
            </button>
            <button
              hlmBtn
              variant="default"
              (click)="formComponent.submit()"
            >
              Create customer
            </button>
          </hlm-alert-dialog-footer>
        </hlm-alert-dialog-content>
      </hlm-alert-dialog>
    </app-shell>
  `,
  providers: [
    provideIcons({
      lucidePenLine,
      lucidePlus,
      lucideTrash2
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
    this._quickActions[0].onClick = () => document.getElementById('add-customer-trigger')?.click();

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
      {
        label: 'Delete',
        icon: { name: 'lucide-trash-2', value: lucideTrash2, key: 'lucideTrash2' },
        dialog: {
          title: 'Delete customer',
          description: 'This action cannot be undone.',
          confirmLabel: 'Delete',
          inputs: (customer) => ({
            customer,
            confirm: (result: { id: string }) => this.deleteCustomer(result.id)
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

  private deleteCustomer(id: string) {
    this._customersMap.delete(id);
    this._customers.set(Array.from(this._customersMap.values()));

    this._dataService
      .customers
      .deleteCustomer(id);
  }

  protected handleCreate(event: { id: string; customer: CustomerDTO }, ctx: { close: () => void }) {
    this._customersMap.set(event.id, event.customer);
    this._customers.set(Array.from(this._customersMap.values()));

    this._dataService.customers.createCustomer(event.customer);
    ctx.close();
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

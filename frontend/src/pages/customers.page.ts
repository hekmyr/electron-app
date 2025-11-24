import { ContextService } from "@/shared/services/context";
import { DataService, DataServiceImpl } from "@/shared/services/data";
import { AgePipe } from "@/shared/pipes/age.pipe";
import { DateFormatPipe } from "@/shared/pipes/date-format.pipe";
import { Component, ElementRef, inject, OnInit, signal, viewChild } from "@angular/core";
import { BreadcrumbItem, QuickAction } from "@libs/app/header.component";
import { ResourceAction, ResourceTableComponent } from "@libs/app/resource-table/src";
import { ShellComponent } from "@libs/app/shell.component";
import { CustomerAddDialogComponent } from "@libs/customer/customer-add-dialog.component";
import { CustomerDeleteConfirmComponent } from "@libs/customer/customer-delete-confirm.component";
import { CustomerFormComponent } from "@libs/customer/customer-form.component";
import { CustomerManageAddressesComponent } from "@libs/customer/customer-manage-addresses.component";
import { HlmAlertDialogImports } from "@libs/ui/alert-dialog/src";
import { HlmButton } from "@libs/ui/button/src";
import { provideIcons } from "@ng-icons/core";
import { lucideHouse, lucidePenLine, lucidePlus, lucideTrash2 } from "@ng-icons/lucide";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";
import { BrnAlertDialogImports } from "@spartan-ng/brain/alert-dialog";
import type { ColumnDef } from "@tanstack/angular-table";

@Component({
  selector: 'app-customers',
  imports: [
    ShellComponent,
    ResourceTableComponent,
    CustomerAddDialogComponent,
    CustomerFormComponent,
    CustomerDeleteConfirmComponent,
    CustomerManageAddressesComponent,
    HlmAlertDialogImports,
    BrnAlertDialogImports,
    HlmButton,
    AgePipe,
    DateFormatPipe
  ],
  template: `
    <app-shell
      [breadcrumbs]="_breadcrumbs"
      [actions]="_quickActions"
    >
      <resource-table
        [data]="_customers()"
        [columns]="_columns"
        [actions]="_rowActions"
      />
      <customer-add-dialog
        #addDialogRef
        (save)="handleCreate($event)"
      />

      @let selectedCustomer = _selectedCustomerSignal();

      @if(selectedCustomer) {
        <customer-manage-addresses
          #manageAddressesRef
          [customer]="selectedCustomer"
        />
      }

      <!-- Edit Dialog -->
      <hlm-alert-dialog>
        <button #editTriggerRef class="hidden" brnAlertDialogTrigger></button>
        <hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
          <hlm-alert-dialog-header>
            <h2 hlmAlertDialogTitle>Edit customer</h2>
          </hlm-alert-dialog-header>
          <customer-form
            #editForm
            [customer]="selectedCustomer"
            (save)="handleEditSave($event, ctx)"
          />
          <hlm-alert-dialog-footer>
            <button hlmAlertDialogCancel variant="ghost" (click)="ctx.close()">Cancel</button>
            <button hlmBtn variant="default" (click)="editForm.submit()">Save changes</button>
          </hlm-alert-dialog-footer>
        </hlm-alert-dialog-content>
      </hlm-alert-dialog>

      <!-- Delete Dialog -->
      <hlm-alert-dialog>
        <button #deleteTriggerRef class="hidden" brnAlertDialogTrigger></button>
        <hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
          <hlm-alert-dialog-header>
            <h2 hlmAlertDialogTitle>Delete customer</h2>
            <p hlmAlertDialogDescription>This action cannot be undone.</p>
          </hlm-alert-dialog-header>
          @if (selectedCustomer) {
            <customer-delete-confirm
              #deleteConfirm
              [customer]="selectedCustomer!"
              (confirm)="handleDeleteConfirm($event, ctx)"
            />
            <hlm-alert-dialog-footer>
              <button hlmAlertDialogCancel variant="ghost" (click)="ctx.close()">Cancel</button>
              <button hlmBtn variant="destructive" (click)="deleteConfirm.submit()">Delete</button>
            </hlm-alert-dialog-footer>
          }
        </hlm-alert-dialog-content>
      </hlm-alert-dialog>
    </app-shell>
  `,
  providers: [
    // Provide icons for row actions and header actions
    provideIcons({
      lucidePenLine,
      lucidePlus,
      lucideTrash2,
      lucideHouse
    })
  ]
})
export class CustomersPage implements OnInit {
  private _contextService = inject(ContextService);
  private _dataService: DataService = new DataServiceImpl(this._contextService.electronService);
  private _customersMap: Map<string, CustomerDTO> = new Map();

  protected readonly _addDialogRefSignal = viewChild.required<CustomerAddDialogComponent>('addDialogRef');
  protected readonly _editTriggerRefSignal = viewChild.required<ElementRef<HTMLButtonElement>>('editTriggerRef');
  protected readonly _deleteTriggerRef = viewChild.required<ElementRef<HTMLButtonElement>>('deleteTriggerRef');
  protected readonly _manageAddressesRef = viewChild<CustomerManageAddressesComponent>('manageAddressesRef');

  protected readonly _selectedCustomerSignal = signal<CustomerDTO | undefined>(undefined);

  protected readonly _quickActions: QuickAction[] = [
    {
      icon: { name: 'lucide-plus', value: lucidePlus, key: 'lucidePlus' },
      onClick: () => {
        const addDialogRef = this._addDialogRefSignal();
        addDialogRef.open();
      }
    }
  ];

  protected readonly _rowActions: ResourceAction<CustomerDTO>[] = [
    {
      label: 'Edit',
      icon: 'lucidePenLine',
      onClick: (customer) => this.openEdit(customer)
    },
    {
      label: 'Manage addresses',
      icon: 'lucideHouse',
      onClick: (customer) => this.openManageAddresses(customer)
    },
    {
      label: 'Delete',
      icon: 'lucideTrash2',
      variant: 'destructive',
      onClick: (customer) => this.openDelete(customer)
    }
  ];

  protected readonly _breadcrumbs: BreadcrumbItem[] = [
    { label: "Customers", url: "/customers" }
  ];

  protected readonly _customers = signal<CustomerDTO[]>([]);
  protected readonly _columns: ColumnDef<CustomerDTO>[] = [
    {
      accessorKey: 'id',
      id: 'id',
      header: 'ID',
      enableSorting: false,
      cell: (info) => `${info.getValue()}`,
    },
    {
      accessorKey: 'email',
      id: 'email',
      header: 'Email',
      enableSorting: false,
      cell: (info) => `${info.getValue()}`,
    },
    {
      accessorKey: 'firstName',
      id: 'firstName',
      header: 'First Name',
      enableSorting: false,
      cell: (info) => `${info.getValue()}`,
    },
    {
      accessorKey: 'lastName',
      id: 'lastName',
      header: 'Last Name',
      enableSorting: false,
      cell: (info) => `${info.getValue()}`,
    },
    {
      accessorKey: 'birthdate',
      id: 'birthdate',
      header: 'Age',
      enableSorting: false,
      cell: (info) => {
        const agePipe = new AgePipe();
        return agePipe.transform(info.getValue() as Date);
      },
    },
    {
      accessorKey: 'createdAt',
      id: 'createdAt',
      header: 'Created',
      enableSorting: false,
      cell: (info) => {
        const datePipe = new DateFormatPipe();
        return datePipe.transform(info.getValue() as Date);
      },
    },
    {
      id: 'actions',
      header: '',
      meta: { kind: 'rowActions' }
    }
  ];

  public async ngOnInit() {
    this._customersMap = await this._dataService.customers.findCustomers(40);
    this._customers.set(Array.from(this._customersMap.values()));

  }

  protected handleCreate(event: { id: string; customer: CustomerDTO }) {
    this._customersMap.set(event.id, event.customer);
    this._customers.set(Array.from(this._customersMap.values()));

    this._dataService.customers.createCustomer(event.customer);
  }

  protected openManageAddresses(customer: CustomerDTO) {
    this._selectedCustomerSignal.set(customer);
    setTimeout(() => {
      const ref = this._manageAddressesRef();
      ref?.open();
    });
  }

  protected openEdit(customer: CustomerDTO) {
    this._selectedCustomerSignal.set(customer);
    const editTriggerRef = this._editTriggerRefSignal();
    editTriggerRef.nativeElement.click();
  }

  protected handleEditSave(event: { id: string; customer: CustomerDTO }, ctx: { close: () => void }) {
    this.updateCustomer(event);
    ctx.close();
  }

  protected openDelete(customer: CustomerDTO) {
    this._selectedCustomerSignal.set(customer);
    const deleteTriggerRef = this._deleteTriggerRef();
    deleteTriggerRef.nativeElement.click();
  }

  protected handleDeleteConfirm(event: { id: string }, ctx: { close: () => void }) {
    this.deleteCustomer(event.id);
    ctx.close();
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
}

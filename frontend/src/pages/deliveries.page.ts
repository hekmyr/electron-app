import { ContextService } from "@/shared/services/context";
import { DataServiceImpl } from "@/shared/services/data";
import { DateFormatPipe } from "@/shared/pipes/date-format.pipe";
import { Component, ElementRef, inject, OnInit, signal, viewChild } from "@angular/core";
import { DatePipe } from '@angular/common';
import { BreadcrumbItem, QuickAction } from "@libs/app/header.component";
import { ResourceAction, ResourceTableComponent } from "@libs/app/resource-table/src";
import { ShellComponent } from "@libs/app/shell.component";
import { DeliveryAddDialogComponent } from "@libs/delivery/delivery-add-dialog.component";
import { DeliveryDeleteConfirmComponent } from "@libs/delivery/delivery-delete-confirm.component";
import { DeliveryFormComponent } from "@libs/delivery/delivery-form.component";
import { HlmAlertDialogImports } from "@libs/ui/alert-dialog/src";
import { HlmButton } from "@libs/ui/button/src";
import { provideIcons } from "@ng-icons/core";
import { lucidePenLine, lucidePlus, lucideTrash2 } from "@ng-icons/lucide";
import { DeliveryDTO } from "@shared/dto/delivery-dto.interface";
import { BrnAlertDialogImports } from "@spartan-ng/brain/alert-dialog";
import { ColumnDef } from "@tanstack/angular-table";

@Component({
  selector: 'app-deliveries',
  imports: [
    ShellComponent,
    ResourceTableComponent,
    DeliveryAddDialogComponent,
    DeliveryFormComponent,
    DeliveryDeleteConfirmComponent,
    HlmAlertDialogImports,
    BrnAlertDialogImports,
    HlmButton,
    DateFormatPipe
  ],
  providers: [
    provideIcons({
      lucidePenLine,
      lucidePlus,
      lucideTrash2
    })
  ],
  template: `
    <app-shell
      [breadcrumbs]="_breadcrumbs"
      [actions]="_quickActions"
    >
      <resource-table
        [data]="_deliveries()"
        [columns]="_columns"
        [actions]="_rowActions"
      />

      <delivery-add-dialog
        #addDialogRef
        (save)="handleCreate($event)"
      />

      @let selectedDelivery = _selectedDeliverySignal();
      <!-- Edit Dialog -->
      <hlm-alert-dialog>
        <button #editTriggerRef class="hidden" brnAlertDialogTrigger></button>
        <hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
          <hlm-alert-dialog-header>
            <h2 hlmAlertDialogTitle>Edit delivery</h2>
          </hlm-alert-dialog-header>
          <delivery-form
            #editForm
            [delivery]="selectedDelivery"
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
            <h2 hlmAlertDialogTitle>Delete delivery</h2>
            <p hlmAlertDialogDescription>This action cannot be undone.</p>
          </hlm-alert-dialog-header>
          @if (selectedDelivery) {
            <delivery-delete-confirm
              #deleteConfirm
              [delivery]="selectedDelivery!"
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
  `
})
export class DeliveriesPage implements OnInit {

  private _contextService = inject(ContextService);
  private readonly _dataService = new DataServiceImpl(this._contextService.electronService);

  private _deliveriesMap: Map<string, DeliveryDTO> = new Map();
  protected readonly _deliveries = signal<DeliveryDTO[]>([]);

  protected readonly _addDialogRefSignal = viewChild.required<DeliveryAddDialogComponent>('addDialogRef');
  protected readonly _editTriggerRefSignal = viewChild.required<ElementRef<HTMLButtonElement>>('editTriggerRef');
  protected readonly _deleteTriggerRef = viewChild.required<ElementRef<HTMLButtonElement>>('deleteTriggerRef');

  protected readonly _selectedDeliverySignal = signal<DeliveryDTO | undefined>(undefined);

  protected readonly _breadcrumbs: BreadcrumbItem[] = [
    { label: "Deliveries", url: "/deliveries" }
  ];

  protected readonly _quickActions: QuickAction[] = [
    {
      icon: { name: 'lucide-plus', value: lucidePlus, key: 'lucidePlus' },
      onClick: () => {
        const addDialogRef = this._addDialogRefSignal();
        addDialogRef.open();
      }
    }
  ];

  protected readonly _columns: ColumnDef<DeliveryDTO>[] = [
    {
      id: 'id',
      accessorKey: 'id',
      header: 'ID',
      enableSorting: false,
      cell: (info) => `${info.getValue()}`,
    },
    {
      accessorKey: 'customerId',
      id: 'customerId',
      header: 'Customer ID',
      enableSorting: false,
      cell: (info) => `${info.getValue()}`,
    },
    {
      accessorKey: 'scheduledAt',
      id: 'scheduledAt',
      header: 'Scheduled At',
      enableSorting: false,
      cell: (info) => new DatePipe('en-US').transform(info.getValue() as Date | string, 'short'),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: info => info.getValue()
    },
    {
      id: 'addressId',
      accessorKey: 'addressId',
      header: 'Address ID',
      cell: info => info.getValue()
    },
    {
      id: 'instructions',
      accessorKey: 'instructions',
      header: 'Instructions',
      cell: info => info.getValue()
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: info => {
        const datePipe = new DateFormatPipe();
        return datePipe.transform(info.getValue() as Date);
      }
    },
    {
      id: 'actions',
      header: '',
      meta: { kind: 'rowActions' }
    }
  ];

  protected readonly _rowActions: ResourceAction<DeliveryDTO>[] = [
    {
      label: 'Edit',
      icon: 'lucidePenLine',
      onClick: (delivery) => this.openEdit(delivery)
    },
    {
      label: 'Delete',
      icon: 'lucideTrash2',
      variant: 'destructive',
      onClick: (delivery) => this.openDelete(delivery)
    }
  ];


  public async ngOnInit() {
    this._deliveriesMap = await this._dataService.deliveries.findDeliveries(50);
    this._deliveries.set(Array.from(this._deliveriesMap.values()));
  }

  protected handleCreate(event: { id: string; delivery: DeliveryDTO }) {
    this._deliveriesMap.set(event.id, event.delivery);
    this._deliveries.set(Array.from(this._deliveriesMap.values()));

    this._dataService.deliveries.createDelivery(event.delivery);
  }

  protected openEdit(delivery: DeliveryDTO) {
    this._selectedDeliverySignal.set(delivery);
    const editTriggerRef = this._editTriggerRefSignal();
    editTriggerRef.nativeElement.click();
  }

  protected handleEditSave(event: { id: string; delivery: DeliveryDTO }, ctx: { close: () => void }) {
    this.updateDelivery(event);
    ctx.close();
  }

  protected openDelete(delivery: DeliveryDTO) {
    this._selectedDeliverySignal.set(delivery);
    const deleteTriggerRef = this._deleteTriggerRef();
    deleteTriggerRef.nativeElement.click();
  }

  protected handleDeleteConfirm(event: { id: string }, ctx: { close: () => void }) {
    this.deleteDelivery(event.id);
    ctx.close();
  }

  private updateDelivery(result: { id: string; delivery: DeliveryDTO }) {
    this._deliveriesMap.set(result.id, result.delivery);
    this._deliveries.set(Array.from(this._deliveriesMap.values()));

    this._dataService
      .deliveries
      .updateDelivery(result.id, result.delivery);
  }

  private deleteDelivery(id: string) {
    this._deliveriesMap.delete(id);
    this._deliveries.set(Array.from(this._deliveriesMap.values()));

    this._dataService
      .deliveries
      .deleteDelivery(id);
  }
}

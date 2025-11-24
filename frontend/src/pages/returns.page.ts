import { ContextService } from "@/shared/services/context";
import { DataServiceImpl } from "@/shared/services/data";
import { DateFormatPipe } from "@/shared/pipes/date-format.pipe";
import { Component, ElementRef, inject, OnInit, signal, viewChild } from "@angular/core";
import { BreadcrumbItem, QuickAction } from "@libs/app/header.component";
import { ResourceAction, ResourceTableComponent } from "@libs/app/resource-table/src";
import { ShellComponent } from "@libs/app/shell.component";
import { ReturnAddDialogComponent } from "@libs/return/return-add-dialog.component";
import { ReturnDeleteConfirmComponent } from "@libs/return/return-delete-confirm.component";
import { ReturnFormComponent } from "@libs/return/return-form.component";
import { HlmAlertDialogImports } from "@libs/ui/alert-dialog/src";
import { HlmButton } from "@libs/ui/button/src";
import { provideIcons } from "@ng-icons/core";
import { lucidePenLine, lucidePlus, lucideTrash2 } from "@ng-icons/lucide";
import { ReturnDTO } from "@shared/dto/return-dto.interface";
import { BrnAlertDialogImports } from "@spartan-ng/brain/alert-dialog";
import { ColumnDef } from "@tanstack/angular-table";

@Component({
    selector: 'app-returns',
    imports: [
        ShellComponent,
        ResourceTableComponent,
        ReturnAddDialogComponent,
        ReturnFormComponent,
        ReturnDeleteConfirmComponent,
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
        [data]="_returns()"
        [columns]="_columns"
        [actions]="_rowActions"
      />

      <return-add-dialog
        #addDialogRef
        (save)="handleCreate($event)"
      />

      @let selectedReturn = _selectedReturnSignal();
      <!-- Edit Dialog -->
      <hlm-alert-dialog>
        <button #editTriggerRef class="hidden" brnAlertDialogTrigger></button>
        <hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
          <hlm-alert-dialog-header>
            <h2 hlmAlertDialogTitle>Edit return</h2>
          </hlm-alert-dialog-header>
          <return-form
            #editForm
            [return]="selectedReturn"
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
            <h2 hlmAlertDialogTitle>Delete return</h2>
            <p hlmAlertDialogDescription>This action cannot be undone.</p>
          </hlm-alert-dialog-header>
          @if (selectedReturn) {
            <return-delete-confirm
              #deleteConfirm
              [return]="selectedReturn!"
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
export class ReturnsPage implements OnInit {

    private _contextService = inject(ContextService);
    private readonly _dataService = new DataServiceImpl(this._contextService.electronService);

    private _returnsMap: Map<string, ReturnDTO> = new Map();
    protected readonly _returns = signal<ReturnDTO[]>([]);

    protected readonly _addDialogRefSignal = viewChild.required<ReturnAddDialogComponent>('addDialogRef');
    protected readonly _editTriggerRefSignal = viewChild.required<ElementRef<HTMLButtonElement>>('editTriggerRef');
    protected readonly _deleteTriggerRef = viewChild.required<ElementRef<HTMLButtonElement>>('deleteTriggerRef');

    protected readonly _selectedReturnSignal = signal<ReturnDTO | undefined>(undefined);

    protected readonly _breadcrumbs: BreadcrumbItem[] = [
        { label: "Returns", url: "/returns" }
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

    protected readonly _columns: ColumnDef<ReturnDTO>[] = [
        {
            id: 'id',
            accessorKey: 'id',
            header: 'ID',
            cell: info => info.getValue()
        },
        {
            id: 'packageId',
            accessorKey: 'packageId',
            header: 'Package ID',
            cell: info => info.getValue()
        },
        {
            id: 'status',
            accessorKey: 'status',
            header: 'Status',
            cell: info => info.getValue()
        },
        {
            id: 'reason',
            accessorKey: 'reason',
            header: 'Reason',
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

    protected readonly _rowActions: ResourceAction<ReturnDTO>[] = [
        {
            label: 'Edit',
            icon: 'lucidePenLine',
            onClick: (returnData) => this.openEdit(returnData)
        },
        {
            label: 'Delete',
            icon: 'lucideTrash2',
            variant: 'destructive',
            onClick: (returnData) => this.openDelete(returnData)
        }
    ];


    public async ngOnInit() {
        this._returnsMap = await this._dataService.returns.findReturns(50);
        this._returns.set(Array.from(this._returnsMap.values()));
    }

    protected handleCreate(event: { id: string; return: ReturnDTO }) {
        this._returnsMap.set(event.id, event.return);
        this._returns.set(Array.from(this._returnsMap.values()));

        this._dataService.returns.createReturn(event.return);
    }

    protected openEdit(returnData: ReturnDTO) {
        this._selectedReturnSignal.set(returnData);
        const editTriggerRef = this._editTriggerRefSignal();
        editTriggerRef.nativeElement.click();
    }

    protected handleEditSave(event: { id: string; return: ReturnDTO }, ctx: { close: () => void }) {
        this.updateReturn(event);
        ctx.close();
    }

    protected openDelete(returnData: ReturnDTO) {
        this._selectedReturnSignal.set(returnData);
        const deleteTriggerRef = this._deleteTriggerRef();
        deleteTriggerRef.nativeElement.click();
    }

    protected handleDeleteConfirm(event: { id: string }, ctx: { close: () => void }) {
        this.deleteReturn(event.id);
        ctx.close();
    }

    private updateReturn(result: { id: string; return: ReturnDTO }) {
        this._returnsMap.set(result.id, result.return);
        this._returns.set(Array.from(this._returnsMap.values()));

        this._dataService
            .returns
            .updateReturn(result.id, result.return);
    }

    private deleteReturn(id: string) {
        this._returnsMap.delete(id);
        this._returns.set(Array.from(this._returnsMap.values()));

        this._dataService
            .returns
            .deleteReturn(id);
    }
}

import { ContextService } from "@/shared/services/context";
import { DataServiceImpl } from "@/shared/services/data";
import { Component, ElementRef, inject, OnInit, signal, viewChild } from "@angular/core";
import { BreadcrumbItem, QuickAction } from "@libs/app/header.component";
import { ResourceAction, ResourceTableComponent } from "@libs/app/resource-table/src";
import { ShellComponent } from "@libs/app/shell.component";
import { PackageAddDialogComponent } from "@libs/package/package-add-dialog.component";
import { PackageDeleteConfirmComponent } from "@libs/package/package-delete-confirm.component";
import { PackageFormComponent } from "@libs/package/package-form.component";
import { HlmAlertDialogImports } from "@libs/ui/alert-dialog/src";
import { HlmButton } from "@libs/ui/button/src";
import { provideIcons } from "@ng-icons/core";
import { lucidePenLine, lucidePlus, lucideTrash2 } from "@ng-icons/lucide";
import { PackageDTO } from "@shared/dto/package-dto.interface";
import { BrnAlertDialogImports } from "@spartan-ng/brain/alert-dialog";
import { ColumnDef } from "@tanstack/angular-table";

@Component({
  selector: 'app-packages',
  imports: [
    ShellComponent,
    ResourceTableComponent,
    PackageAddDialogComponent,
    PackageFormComponent,
    PackageDeleteConfirmComponent,
    HlmAlertDialogImports,
    BrnAlertDialogImports,
    HlmButton
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
        [data]="_packages()"
        [columns]="_columns"
        [actions]="_rowActions"
      />

      <package-add-dialog
        #addDialogRef
        (save)="handleCreate($event)"
      />

      @let selectedPackage = _selectedPackageSignal();
      <!-- Edit Dialog -->
      <hlm-alert-dialog>
        <button #editTriggerRef class="hidden" brnAlertDialogTrigger></button>
        <hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
          <hlm-alert-dialog-header>
            <h2 hlmAlertDialogTitle>Edit package</h2>
          </hlm-alert-dialog-header>
          <package-form
            #editForm
            [package]="selectedPackage"
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
            <h2 hlmAlertDialogTitle>Delete package</h2>
            <p hlmAlertDialogDescription>This action cannot be undone.</p>
          </hlm-alert-dialog-header>
          @if (selectedPackage) {
            <package-delete-confirm
              #deleteConfirm
              [package]="selectedPackage!"
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
export class PackagesPage implements OnInit {

  private _contextService = inject(ContextService);
  private readonly _dataService = new DataServiceImpl(this._contextService.electronService);

  private _packagesMap: Map<string, PackageDTO> = new Map();
  protected readonly _packages = signal<PackageDTO[]>([]);

  protected readonly _addDialogRefSignal = viewChild.required<PackageAddDialogComponent>('addDialogRef');
  protected readonly _editTriggerRefSignal = viewChild.required<ElementRef<HTMLButtonElement>>('editTriggerRef');
  protected readonly _deleteTriggerRef = viewChild.required<ElementRef<HTMLButtonElement>>('deleteTriggerRef');

  protected readonly _selectedPackageSignal = signal<PackageDTO | undefined>(undefined);

  protected readonly _breadcrumbs: BreadcrumbItem[] = [
    { label: "Packages", url: "/packages" }
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

  protected readonly _columns: ColumnDef<PackageDTO>[] = [
    {
      id: 'id',
      accessorKey: 'id',
      header: 'ID',
      cell: info => info.getValue()
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      cell: info => info.getValue()
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: info => info.getValue()
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: 'Description',
      cell: info => info.getValue()
    },
    {
      id: 'receivedAt',
      accessorKey: 'receivedAt',
      header: 'Received At',
      cell: info => info.getValue()
    },
    {
      id: 'actions',
      header: '',
      meta: { kind: 'rowActions' }
    }
  ];

  protected readonly _rowActions: ResourceAction<PackageDTO>[] = [
    {
      label: 'Edit',
      icon: 'lucidePenLine',
      onClick: (pkg) => this.openEdit(pkg)
    },
    {
      label: 'Delete',
      icon: 'lucideTrash2',
      variant: 'destructive',
      onClick: (pkg) => this.openDelete(pkg)
    }
  ];


  public async ngOnInit() {
    this._packagesMap = await this. _dataService.packages.findPackages(50);
    this._packages.set(Array.from(this._packagesMap.values()));
  }

  protected handleCreate(event: { id: string; package: PackageDTO }) {
    this._packagesMap.set(event.id, event.package);
    this._packages.set(Array.from(this._packagesMap.values()));

    this._dataService.packages.createPackage(event.package);
  }

  protected openEdit(pkg: PackageDTO) {
    this._selectedPackageSignal.set(pkg);
    const editTriggerRef = this._editTriggerRefSignal();
    editTriggerRef.nativeElement.click();
  }

  protected handleEditSave(event: { id: string; package: PackageDTO }, ctx: { close: () => void }) {
    this.updatePackage(event);
    ctx.close();
  }

  protected openDelete(pkg: PackageDTO) {
    this._selectedPackageSignal.set(pkg);
    const deleteTriggerRef = this._deleteTriggerRef();
    deleteTriggerRef.nativeElement.click();
  }

  protected handleDeleteConfirm(event: { id: string }, ctx: { close: () => void }) {
    this.deletePackage(event.id);
    ctx.close();
  }

  private updatePackage(result: { id: string; package: PackageDTO }) {
    this._packagesMap.set(result.id, result.package);
    this._packages.set(Array.from(this._packagesMap.values()));

    this._dataService
      .packages
      .updatePackage(result.id, result.package);
  }

  private deletePackage(id: string) {
    this._packagesMap.delete(id);
    this._packages.set(Array.from(this._packagesMap.values()));

    this._dataService
      .packages
      .deletePackage(id);
  }
}

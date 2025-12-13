import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerComboboxComponent } from '@libs/customer';
import { HlmButtonImports } from '@libs/ui/button/src';
import { HlmCommandImports } from '@libs/ui/command/src';
import { HlmIconImports } from '@libs/ui/icon/src';
import { HlmInput } from '@libs/ui/input/src';
import { HlmPopoverImports } from '@libs/ui/popover/src';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronsUpDown, lucideSearch } from '@ng-icons/lucide';
import { CustomerDTO } from '@shared/dto/customer-dto.interface';
import { PackageDTO, PackageStatus, isPackageStatus, packageStatus } from '@shared/dto/package-dto.interface';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';

@Component({
  selector: 'package-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HlmInput,
    BrnCommandImports,
    HlmCommandImports,
    NgIcon,
    HlmIconImports,
    HlmButtonImports,
    BrnPopoverImports,
    HlmPopoverImports,
    CustomerComboboxComponent
  ],
  providers: [provideIcons({ lucideChevronsUpDown, lucideSearch, lucideCheck })],
  template: `
    <form
      class="grid gap-4"
      [formGroup]="form"
    >
      <h3 class="text-lg font-medium">Package Details</h3>
      <div class="grid gap-4">
        <label class="grid gap-2 text-sm">
          <span>Name</span>
          <input hlmInput type="text" formControlName="name" />
        </label>

        <label class="grid gap-2 text-sm">
          <span>Description</span>
          <input hlmInput type="text" formControlName="description" />
        </label>

        <label class="grid gap-2 text-sm">
          <span>Customer</span>
          <customer-combobox [customers]="customers()" (selectedCustomer)="selectCustomer($event)"/>
        </label>

        <label class="grid gap-2 text-sm">
          <span>Status</span>
          @let statusComboboxState = _statusComboboxStateSignal();
          @let selectedStatus = _selectedStatusSignal();
          <brn-popover [state]="statusComboboxState" (stateChanged)="_statusComboboxStateSignal.set($event)" sideOffset="5">
            <button
              type="button"
              class="w-full justify-between font-normal"
              variant="outline"
              brnPopoverTrigger
              (click)="_statusComboboxStateSignal.set('open')"
              hlmBtn
            >
              {{ selectedStatus ? _getStatusLabel(selectedStatus) : 'Select status...' }}
              <ng-icon hlm size="sm" name="lucideChevronsUpDown" class="opacity-50" />
            </button>
            <hlm-command *brnPopoverContent="let ctx" hlmPopoverContent class="w-[200px] p-0">
              <hlm-command-search>
                <ng-icon hlm name="lucideSearch" />
                <input placeholder="Search status..." hlm-command-search-input />
              </hlm-command-search>
              <div *brnCommandEmpty hlmCommandEmpty>No statuses found.</div>
              <hlm-command-list>
                <hlm-command-group>
                  @for (status of _packageStatus; track status) {
                    <button
                      type="button" hlm-command-item
                      class="font-normal"
                      [value]="status"
                      (selected)="selectStatus(status)"
                    >
                      <span>{{ _getStatusLabel(status) }}</span>
                      <ng-icon
                        hlm
                        class="ml-auto"
                        [class.opacity-0]="selectedStatus !== status"
                        name="lucideCheck"
                        hlmCommandIcon
                      />
                    </button>
                  }
                </hlm-command-group>
              </hlm-command-list>
            </hlm-command>
          </brn-popover>
        </label>
      </div>
    </form>
  `,
})
export class PackageFormComponent implements OnInit {
  public readonly packageSignal = input<PackageDTO>(undefined, { alias: 'package' });
  public readonly customers = input<CustomerDTO[]>([]);
  public readonly save = output<{ id: string; package: PackageDTO }>();

  private readonly _formBuilder = inject(NonNullableFormBuilder);

  protected readonly form = this._formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]],
    customerId: ['', [Validators.required]],
    status: ['received', [Validators.required]],
  });

  protected readonly _packageStatus = packageStatus;

  protected readonly _statusComboboxStateSignal = signal<'closed' | 'open'>('closed');
  protected readonly _selectedStatusSignal = signal<PackageStatus | undefined>(undefined);

  private readonly _statusMap: Record<PackageStatus, string> = {
    'received': 'Received',
    'out_for_delivery': 'Out for delivery',
    'delivered': 'Delivered',
  };
  protected _getStatusLabel(status: PackageStatus | undefined) {
    if (!status) return '';
    return this._statusMap[status] || status;
  }

  public selectStatus(status: PackageStatus) {
    this._selectedStatusSignal.set(status);
    this._statusComboboxStateSignal.set('closed');
    this.form.patchValue({ status });
  }

  public selectCustomer(customer: CustomerDTO) {
    this.form.patchValue({ customerId: customer.id });
  }

  public ngOnInit() {
    const pkg = this.packageSignal();
    if (pkg) {
      this._selectedStatusSignal.set(pkg.status as PackageStatus);
      this.form.patchValue({
        name: pkg.name,
        description: pkg.description,
        customerId: pkg.customerId,
        status: pkg.status
      });
    }
  }

  public submit() {
    if (this.form.invalid) return;

    const formValues = this.form.getRawValue();
    const pkg = this.packageSignal();

    if (!isPackageStatus(formValues.status)) return;

    let id: string = crypto.randomUUID();
    let createdAt = new Date();
    let receivedAt = new Date();
    let status = formValues.status;

    if (pkg) {
      id = pkg.id;
      createdAt = pkg.createdAt;
      receivedAt = pkg.receivedAt || new Date();
    }

    const updatedPackage: PackageDTO = {
      id,
      createdAt,
      receivedAt,
      ...formValues,
      status,
    };

    this.save.emit({ id, package: updatedPackage });
  }
}

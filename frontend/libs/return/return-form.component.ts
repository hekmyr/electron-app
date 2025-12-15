import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal, untracked } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PackageComboboxComponent } from '@libs/package';
import { HlmButtonImports } from '@libs/ui/button/src';
import { HlmCommandImports } from '@libs/ui/command/src';
import { HlmIconImports } from '@libs/ui/icon/src';
import { HlmInput } from '@libs/ui/input/src';
import { HlmPopoverImports } from '@libs/ui/popover/src';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronsUpDown, lucideSearch } from '@ng-icons/lucide';
import { PackageDTO } from '@shared/dto/package-dto.interface';
import { ReturnDTO, ReturnStatus, isReturnStatus, returnStatus } from '@shared/dto/return-dto.interface';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';

@Component({
  selector: 'return-form',
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
    PackageComboboxComponent,
  ],
  providers: [provideIcons({ lucideChevronsUpDown, lucideSearch, lucideCheck })],
  template: `
    <form
      class="grid gap-4"
      [formGroup]="form"
      (ngSubmit)="submit()"
      id="edit-return-form"
    >
      <h3 class="text-lg font-medium">Return Details</h3>
      <div class="grid gap-4">
        <label class="grid gap-2 text-sm">
          <span>Package</span>
          <package-combobox
             [packages]="packages()"
             [selectedPackage]="_selectedPackageSignal()"
             (onSelectPackage)="_selectPackage($event)"
          />
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
                  @for (status of _returnStatusOptions; track status) {
                    <button type="button" hlm-command-item class="font-normal" [value]="status" (selected)="_selectStatus(status)">
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

        <label class="grid gap-2 text-sm">
          <span>Reason</span>
          <textarea hlmInput formControlName="reason" rows="3"></textarea>
        </label>
      </div>
    </form>
  `,
})
export class ReturnFormComponent {
  public readonly returnSignal = input<ReturnDTO>(undefined, { alias: 'return' });
  public readonly packages = input<PackageDTO[]>([]);
  public readonly save = output<{ id: string; return: ReturnDTO }>();

  private readonly _formBuilder = inject(NonNullableFormBuilder);

  protected readonly _statusComboboxStateSignal = signal<'closed' | 'open'>('closed');
  protected readonly _selectedStatusSignal = signal<ReturnStatus | undefined>(undefined);

  protected readonly _selectedPackageSignal = signal<PackageDTO | undefined>(undefined);

  private readonly _statusMap: Record<ReturnStatus, string> = {
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'completed': 'Completed',
  };

  protected readonly _returnStatusOptions: ReturnStatus[] = [...returnStatus];

  constructor() {
    effect(() => {
      const returnData = this.returnSignal();
      const packages = this.packages();

      untracked(() => {
        if (returnData) {
          this._selectedStatusSignal.set(returnData.status as ReturnStatus);
          const pkg = packages.find(p => p.id === returnData.packageId);
          this._selectedPackageSignal.set(pkg);
          this.form.patchValue({
            packageId: returnData.packageId,
            status: returnData.status,
            reason: returnData.reason
          });
        } else {
          this.form.reset();
          this._selectedStatusSignal.set(undefined);
          this._selectedPackageSignal.set(undefined);
          // Set default values if needed
          this.form.patchValue({ status: 'pending' });
        }
      });
    });
  }

  protected _getStatusLabel(status: ReturnStatus | undefined): string {
    if (!status) return '';
    return this._statusMap[status] || status;
  }

  protected _selectStatus(status: ReturnStatus) {
    this._selectedStatusSignal.set(status);
    this._statusComboboxStateSignal.set('closed');
    this.form.patchValue({ status });
  }

  protected _selectPackage(pkg: PackageDTO) {
    this._selectedPackageSignal.set(pkg);
    this.form.patchValue({ packageId: pkg.id });
  }

  protected readonly form = this._formBuilder.group({
    packageId: ['', [Validators.required]],
    status: ['pending', [Validators.required]],
    reason: ['', [Validators.required, Validators.minLength(10)]],
  });

  public submit() {
    if (this.form.invalid) return;

    const formValues = this.form.getRawValue();
    const returnData = this.returnSignal();

    if (!isReturnStatus(formValues.status)) return;

    let id: string = crypto.randomUUID();
    let createdAt = new Date();
    let updatedAt = new Date();

    if (returnData) {
      id = returnData.id;
      createdAt = returnData.createdAt;
    }

    const updatedReturn: ReturnDTO = {
      id,
      createdAt,
      updatedAt,
      ...formValues,
    };

    this.save.emit({ id, return: updatedReturn });
  }
}

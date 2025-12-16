import { ContextService } from "@/shared/services/context";
import { DataServiceImpl } from "@/shared/services/data";
import { UtilService } from "@/shared/services/util.service";
import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CustomerComboboxComponent } from '@libs/customer';
import { HlmButtonImports } from '@libs/ui/button/src';
import { HlmCommandImports } from '@libs/ui/command/src';
import { HlmDatePicker } from "@libs/ui/date-picker/src";
import { HlmIconImports } from '@libs/ui/icon/src';
import { HlmInput } from "@libs/ui/input/src";
import { HlmPopoverImports } from '@libs/ui/popover/src';
import { HlmSelectImports } from '@libs/ui/select/src';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronsUpDown, lucideSearch } from '@ng-icons/lucide';
import { AddressDTO } from "@shared/dto/address-dto.interface";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";
import { DeliveryDTO, DeliveryStatus } from "@shared/dto/delivery-dto.interface";
import { PackageDTO } from "@shared/dto/package-dto.interface";
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { BrnSelectImports } from '@spartan-ng/brain/select';

@Component({
  selector: 'delivery-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HlmInput,
    HlmDatePicker,
    BrnCommandImports,
    HlmCommandImports,
    NgIcon,
    HlmIconImports,
    HlmButtonImports,
    BrnPopoverImports,
    HlmPopoverImports,
    BrnSelectImports,
    HlmSelectImports,
    CustomerComboboxComponent,
  ],
  providers: [provideIcons({ lucideChevronsUpDown, lucideSearch, lucideCheck })],
  template: `
    <form [formGroup]="_form" class="grid gap-4 py-4">
      <!-- Customer Selection -->
      <div class="grid grid-cols-4 items-center gap-4">
        <label class="text-right text-sm font-medium">Customer</label>
        <div class="col-span-3">
          <customer-combobox
            [customers]="customers()"
            [customer]="_selectedCustomerSignal()"
            (selectedCustomer)="selectCustomer($event)"
          />
        </div>
      </div>

       <!-- Address Selection -->
      <div class="grid grid-cols-4 items-center gap-4">
        <label class="text-right text-sm font-medium">Address</label>
         <div class="col-span-3">
            <brn-popover [state]="_addressComboboxStateSignal()" (stateChanged)="_addressComboboxStateSignal.set($event)" sideOffset="5">
            <button
              class="w-full justify-between font-normal"
              variant="outline"
              brnPopoverTrigger
              (click)="_addressComboboxStateSignal.set('open')"
              hlmBtn
            >
              @let selectedAddress = _selectedAddressSignal();
              {{ selectedAddress ? (selectedAddress.street + ' ' + selectedAddress.houseNumber + ', ' + selectedAddress.city) : 'Select address...' }}
              <ng-icon hlm size="sm" name="lucideChevronsUpDown" class="opacity-50" />
            </button>
            <hlm-command *brnPopoverContent="let ctx" hlmPopoverContent class="w-[300px] p-0">
              <hlm-command-search>
                <ng-icon hlm name="lucideSearch" />
                <input placeholder="Search address..." hlm-command-search-input />
              </hlm-command-search>
              <div *brnCommandEmpty hlmCommandEmpty>No addresses found.</div>
              <hlm-command-list>
                <hlm-command-group>
                  @for (address of _customerAddressesSignal(); track address.id) {
                    <button type="button" hlm-command-item [value]="address.id" (selected)="selectAddress(address)">
                      <span>{{ address.street }} {{ address.houseNumber }}, {{ address.city }}</span>
                      <ng-icon
                        hlm
                        class="ml-auto"
                        [class.opacity-0]="_selectedAddressSignal()?.id !== address.id"
                        name="lucideCheck"
                        hlmCommandIcon
                      />
                    </button>
                  }
                </hlm-command-group>
              </hlm-command-list>
            </hlm-command>
          </brn-popover>
         </div>
      </div>


      <!-- Scheduled At -->
      <div class="grid grid-cols-4 items-center gap-4">
        <label for="scheduledAt" class="text-right text-sm font-medium">
          Scheduled At
        </label>
        <hlm-date-picker
          id="scheduledAt"
          formControlName="scheduledAt"
          class="col-span-3 w-full"
          [formatDate]="formatDate"
        >
          Pick a date
        </hlm-date-picker>
      </div>

      <!-- Status -->
      <div class="grid grid-cols-4 items-center gap-4">
        <label class="text-right text-sm font-medium">
          Status
        </label>
        <div class="col-span-3">
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
                  @for (status of deliveryStatusOptions; track status) {
                    <button type="button" hlm-command-item class="font-normal" [value]="status" (selected)="selectStatus(status)">
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
        </div>
      </div>

      <!-- Instructions -->
      <div class="grid grid-cols-4 items-center gap-4">
        <label for="instruction" class="text-right text-sm font-medium">
          Instructions
        </label>
        <input
          hlmInput
          id="instruction"
          formControlName="instruction"
          class="col-span-3"
        />
      </div>

      <!-- Packages -->
       <div class="grid grid-cols-4 gap-4">
        <label class="text-right text-sm font-medium pt-2">Packages</label>
        <div class="col-span-3 border rounded-md p-2 max-h-40 overflow-y-auto">
            @let customerPackages = _customerPackagesSignal();
            @if (customerPackages.length > 0) {
                 @for (pkg of customerPackages; track pkg.id) {
                    <div class="flex items-center space-x-2 mb-2">
                        <input type="checkbox" [id]="pkg.id" [value]="pkg.id" (change)="togglePackage(pkg.id, $event)"
                            [checked]="_selectedPackageIds.has(pkg.id)"
                        />
                        <label [for]="pkg.id" class="text-sm">{{ pkg.name }} ({{ pkg.status }})</label>
                    </div>
                 }
            } @else {
                 <div class="text-sm text-muted-foreground">No packages found.</div>
            }
        </div>
      </div>

    </form>
  `
})
export class DeliveryFormComponent {
  private readonly _fb = inject(FormBuilder);
  private _contextService = inject(ContextService);
  private readonly _dataService = new DataServiceImpl(this._contextService.electronService);

  public readonly deliveryId = input<string>();
  public readonly customers = input<CustomerDTO[]>([]);
  public readonly save = output<{ id: string; delivery: DeliveryDTO }>();

  // State
  protected readonly _delivery = signal<DeliveryDTO | undefined>(undefined);
  protected readonly _customerComboboxStateSignal = signal<'closed' | 'open'>('closed');
  protected readonly _selectedCustomerSignal = signal<CustomerDTO | undefined>(undefined);
  protected readonly _addressComboboxStateSignal = signal<'closed' | 'open'>('closed');
  protected readonly _selectedAddressSignal = signal<AddressDTO | undefined>(undefined);
  protected readonly _statusComboboxStateSignal = signal<'closed' | 'open'>('closed');
  protected readonly _selectedStatusSignal = signal<DeliveryStatus | undefined>(undefined);
  protected readonly _customerAddressesSignal = signal<AddressDTO[]>([]);
  protected readonly _customerPackagesSignal = signal<PackageDTO[]>([]);
  protected readonly _selectedPackageIds = new Set<string>();

  private readonly _statusMap: Record<DeliveryStatus, string> = {
    'scheduled': 'Scheduled',
    'in-transit': 'In transit',
    'delivered': 'Delivered',
    'failed': 'Failed',
    'cancelled': 'Cancelled',
  };

  protected readonly deliveryStatusOptions: DeliveryStatus[] = ['scheduled', 'in-transit', 'delivered', 'failed', 'cancelled'];

  protected _getStatusLabel(status: DeliveryStatus | undefined): string {
    if (!status) return '';
    return this._statusMap[status] || status;
  }

  public selectStatus(status: DeliveryStatus) {
    this._selectedStatusSignal.set(status);
    this._statusComboboxStateSignal.set('closed');
    this._form.patchValue({ status });
  }

  protected readonly _form = this._fb.group({
    customerId: ['', Validators.required],
    status: ['scheduled', Validators.required],
    addressId: ['', Validators.required],
    instruction: [''],
    scheduledAt: [new Date(), Validators.required]
  });

  protected readonly formatDate = UtilService.formatLongDate;

  constructor() {
    effect(() => {
      const id = this.deliveryId();
      if (id) {
        this._dataService.deliveries.getDeliveryById(id).then(delivery => {
            if (delivery) {
                this._delivery.set(delivery);
                // Load existing delivery
                this._form.patchValue({
                  customerId: delivery.customerId,
                  status: delivery.status,
                  addressId: delivery.addressId,
                  instruction: delivery.instruction,
                  scheduledAt: delivery.scheduledAt ? new Date(delivery.scheduledAt) : new Date()
                });
        
                this._selectedStatusSignal.set(delivery.status);
        
                const customer = this.customers().find(c => c.id === delivery.customerId);
                if (customer) {
                  this.selectCustomer(customer, delivery.addressId);
                  // Also need to select packages. DeliveryDTO has packageIds.
                  this._selectedPackageIds.clear();
                  if (delivery.packageIds) {
                    delivery.packageIds.forEach(id => this._selectedPackageIds.add(id));
                  }
                }
            }
        });
      } else {
        // Reset or handle new delivery if ID is missing (though this component seems to be for editing mostly, or reused?)
        // The add dialog might use it without an ID?
        // If ID is undefined, it's a new delivery.
        this._delivery.set(undefined);
        this._form.reset({
            status: 'scheduled',
            scheduledAt: new Date()
        });
        this._selectedPackageIds.clear();
        this._selectedStatusSignal.set(undefined);
        this._selectedCustomerSignal.set(undefined);
        this._selectedAddressSignal.set(undefined);
      }
    }, { allowSignalWrites: true });
  }

  public async selectCustomer(customer: CustomerDTO, selectedAddressId?: string) {
    this._selectedCustomerSignal.set(customer);
    this._customerComboboxStateSignal.set('closed');
    this._form.patchValue({ customerId: customer.id });

    // Fetch details
    const details = await this._dataService.customers.findDetailsById(customer.id);
    if (details) {
        this._customerAddressesSignal.set(details.addresses);
        this._customerPackagesSignal.set(details.packages);

        let addressToSelect: AddressDTO | undefined;

        if (selectedAddressId) {
            addressToSelect = details.addresses.find(a => a.id === selectedAddressId);
        }

        if (!addressToSelect && details.addresses.length > 0) {
            addressToSelect = details.addresses[0];
        }

        if (addressToSelect) {
            this.selectAddress(addressToSelect);
        } else {
            this._selectedAddressSignal.set(undefined);
            this._form.patchValue({ addressId: '' });
        }
    }
  }

  public selectAddress(address: AddressDTO) {
    this._selectedAddressSignal.set(address);
    this._addressComboboxStateSignal.set('closed');
    this._form.patchValue({ addressId: address.id });
  }

  public togglePackage(id: string, event: Event) {
      const checked = (event.target as HTMLInputElement).checked;
      if (checked) {
          this._selectedPackageIds.add(id);
      }
      else {
          this._selectedPackageIds.delete(id);
      }
  }

  public submit() {
    if (this._form.invalid) {
      return;
    }

    const formValue = this._form.value;
    const delivery = this._delivery();

    const newDelivery: DeliveryDTO = {
      id: delivery?.id ?? crypto.randomUUID(),
      customerId: formValue.customerId ?? '',
      status: (formValue.status as any) ?? 'scheduled',
      addressId: formValue.addressId ?? '',
      packageIds: Array.from(this._selectedPackageIds),
      instruction: formValue.instruction ?? undefined,
      scheduledAt: formValue.scheduledAt instanceof Date ? formValue.scheduledAt : new Date(),
      createdAt: delivery?.createdAt ?? new Date(),
      updatedAt: new Date()
    };

    this.save.emit({
      id: newDelivery.id,
      delivery: newDelivery
    });
  }
}

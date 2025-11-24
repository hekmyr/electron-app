import { ContextService } from "@/shared/services/context";
import { DataServiceImpl } from "@/shared/services/data";
import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { HlmInput } from "@libs/ui/input/src";
import { AddressDTO } from "@shared/dto/address-dto.interface";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";
import { DeliveryDTO } from "@shared/dto/delivery-dto.interface";
import { PackageDTO } from "@shared/dto/package-dto.interface";

// Spartan UI Imports
import { HlmButtonImports } from '@libs/ui/button/src';
import { HlmCommandImports } from '@libs/ui/command/src';
import { HlmIconImports } from '@libs/ui/icon/src';
import { HlmPopoverImports } from '@libs/ui/popover/src';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronsUpDown, lucideSearch } from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';

@Component({
  selector: 'delivery-form',
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
  ],
  providers: [provideIcons({ lucideChevronsUpDown, lucideSearch, lucideCheck })],
  template: `
    <form [formGroup]="_form" class="grid gap-4 py-4">
      <!-- Customer Selection -->
      <div class="grid grid-cols-4 items-center gap-4">
        <label class="text-right text-sm font-medium">Customer</label>
        <div class="col-span-3">
           <brn-popover [state]="_customerComboboxState()" (stateChanged)="_customerComboboxState.set($event)" sideOffset="5">
            <button
              class="w-full justify-between"
              variant="outline"
              brnPopoverTrigger
              (click)="_customerComboboxState.set('open')"
              hlmBtn
            >
              {{ _selectedCustomer() ? (_selectedCustomer()?.firstName + ' ' + _selectedCustomer()?.lastName) : 'Select customer...' }}
              <ng-icon hlm size="sm" name="lucideChevronsUpDown" class="opacity-50" />
            </button>
            <hlm-command *brnPopoverContent="let ctx" hlmPopoverContent class="w-[300px] p-0">
              <hlm-command-search>
                <ng-icon hlm name="lucideSearch" />
                <input placeholder="Search customer..." hlm-command-search-input />
              </hlm-command-search>
              <div *brnCommandEmpty hlmCommandEmpty>No customers found.</div>
              <hlm-command-list>
                <hlm-command-group>
                  @for (customer of customers(); track customer.id) {
                    <button hlm-command-item [value]="customer.id" (selected)="selectCustomer(customer)">
                      <span>{{ customer.firstName }} {{ customer.lastName }}</span>
                      <ng-icon
                        hlm
                        class="ml-auto"
                        [class.opacity-0]="_selectedCustomer()?.id !== customer.id"
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

       <!-- Address Selection -->
      <div class="grid grid-cols-4 items-center gap-4">
        <label class="text-right text-sm font-medium">Address</label>
         <div class="col-span-3">
            @if (_customerAddresses().length > 0) {
                 <select class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        formControlName="addressId">
                    @for (addr of _customerAddresses(); track addr.id) {
                        <option [value]="addr.id">{{ addr.street }} {{ addr.houseNumber }}, {{ addr.city }}</option>
                    }
                 </select>
            } @else {
                 <div class="text-sm text-muted-foreground">No addresses found for this customer.</div>
            }
         </div>
      </div>


      <!-- Scheduled At -->
      <div class="grid grid-cols-4 items-center gap-4">
        <label for="scheduledAt" class="text-right text-sm font-medium">
          Scheduled At
        </label>
        <input
          hlmInput
          id="scheduledAt"
          formControlName="scheduledAt"
          type="datetime-local"
          class="col-span-3"
        />
      </div>

      <!-- Status -->
      <div class="grid grid-cols-4 items-center gap-4">
        <label for="status" class="text-right text-sm font-medium">
          Status
        </label>
        <input
          hlmInput
          id="status"
          formControlName="status"
          class="col-span-3"
        />
      </div>

      <!-- Instructions -->
      <div class="grid grid-cols-4 items-center gap-4">
        <label for="instructions" class="text-right text-sm font-medium">
          Instructions
        </label>
        <input
          hlmInput
          id="instructions"
          formControlName="instructions"
          class="col-span-3"
        />
      </div>

      <!-- Packages -->
       <div class="grid grid-cols-4 gap-4">
        <label class="text-right text-sm font-medium pt-2">Packages</label>
        <div class="col-span-3 border rounded-md p-2 max-h-40 overflow-y-auto">
            @if (_customerPackages().length > 0) {
                 @for (pkg of _customerPackages(); track pkg.id) {
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
export class DeliveryFormComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private _contextService = inject(ContextService);
  private readonly _dataService = new DataServiceImpl(this._contextService.electronService);

  public readonly delivery = input<DeliveryDTO>();
  public readonly customers = input<CustomerDTO[]>([]);
  public readonly save = output<{ id: string; delivery: DeliveryDTO }>();

  // State
  protected readonly _customerComboboxState = signal<'closed' | 'open'>('closed');
  protected readonly _selectedCustomer = signal<CustomerDTO | undefined>(undefined);
  protected readonly _customerAddresses = signal<AddressDTO[]>([]);
  protected readonly _customerPackages = signal<PackageDTO[]>([]);
  protected readonly _selectedPackageIds = new Set<string>();

  protected readonly _form = this._fb.group({
    customerId: ['', Validators.required],
    status: ['scheduled', Validators.required],
    addressId: ['', Validators.required],
    instructions: [''],
    scheduledAt: [new Date().toISOString().slice(0, 16), Validators.required]
  });

  public ngOnInit() {
    const delivery = this.delivery();
    if (delivery) {
      // Load existing delivery
      this._form.patchValue({
        customerId: delivery.customerId,
        status: delivery.status,
        addressId: delivery.addressId,
        instructions: delivery.instructions,
        scheduledAt: delivery.scheduledAt ? new Date(delivery.scheduledAt).toISOString().slice(0, 16) : ''
      });

      // We rely on the user passed 'customers' input or we should find it.
      const customer = this.customers().find(c => c.id === delivery.customerId);
      if (customer) {
        this.selectCustomer(customer);
        // Also need to select packages. DeliveryDTO has packageIds.
        if (delivery.packageIds) {
            delivery.packageIds.forEach(id => this._selectedPackageIds.add(id));
        }
      }
    }
  }

  public async selectCustomer(customer: CustomerDTO) {
    this._selectedCustomer.set(customer);
    this._customerComboboxState.set('closed');
    this._form.patchValue({ customerId: customer.id });

    // Fetch details
    const details = await this._dataService.customers.findDetailsById(customer.id);
    if (details) {
        this._customerAddresses.set(details.addresses);
        this._customerPackages.set(details.packages);

        // Auto-select first address if none selected or invalid
        if (details.addresses.length > 0) {
             const currentAddr = this._form.get('addressId')?.value;
             if (!currentAddr || !details.addresses.find(a => a.id === currentAddr)) {
                 this._form.patchValue({ addressId: details.addresses[0].id });
             }
        }
    }
  }

  public togglePackage(id: string, event: Event) {
      const checked = (event.target as HTMLInputElement).checked;
      if (checked) {
          this._selectedPackageIds.add(id);
      } else {
          this._selectedPackageIds.delete(id);
      }
  }

  public submit() {
    if (this._form.invalid) {
      return;
    }

    const formValue = this._form.value;
    const delivery = this.delivery();

    const newDelivery: DeliveryDTO = {
      id: delivery?.id ?? crypto.randomUUID(),
      customerId: formValue.customerId ?? '',
      status: (formValue.status as any) ?? 'scheduled',
      addressId: formValue.addressId ?? '',
      packageIds: Array.from(this._selectedPackageIds),
      instructions: formValue.instructions ?? undefined,
      scheduledAt: formValue.scheduledAt ? new Date(formValue.scheduledAt) : new Date(),
      createdAt: delivery?.createdAt ?? new Date(),
      updatedAt: new Date()
    };

    this.save.emit({
      id: newDelivery.id,
      delivery: newDelivery
    });
  }
}

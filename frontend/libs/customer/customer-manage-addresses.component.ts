import { ContextService } from "@/shared/services/context";
import { DataService, DataServiceImpl } from "@/shared/services/data";
import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, input, output, signal, ViewChild } from '@angular/core';
import { HlmAlertDialogImports } from "@libs/ui/alert-dialog/src";
import { HlmButton } from "@libs/ui/button/src";
import { HlmMenuImports } from "@libs/ui/menu/src";
import { HlmTable, HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTr } from "@libs/ui/table/src";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideCheck, lucideEllipsis } from "@ng-icons/lucide";
import { AddressDTO } from "@shared/dto/address-dto.interface";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";
import { CustomerUpdateEvent } from '@shared/types/customer';
import { BrnAlertDialogImports } from "@spartan-ng/brain/alert-dialog";
import { BrnContextMenuImports } from '@spartan-ng/ui-menu-brain';
import { AddressFormComponent } from './address-form.component';

@Component({
  selector: 'customer-manage-addresses',
  standalone: true,
  imports: [
    CommonModule,
    HlmAlertDialogImports,
    BrnAlertDialogImports,
    HlmButton,
    AddressFormComponent,
    HlmTable, HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTr,
    HlmMenuImports,
    BrnContextMenuImports,
    NgIcon
  ],
  providers: [
    provideIcons({ lucideEllipsis, lucideCheck })
  ],
  template: `
    <hlm-alert-dialog>
      <button #trigger class="hidden" brnAlertDialogTrigger></button>
      <hlm-alert-dialog-content *brnAlertDialogContent="let ctx" class="sm:max-w-[800px]">
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>Manage Addresses</h2>
          <p hlmAlertDialogDescription>
             Manage addresses for {{ _localCustomer()?.firstName }} {{ _localCustomer()?.lastName }}
          </p>
        </hlm-alert-dialog-header>

        <div class="flex flex-col gap-6 py-4 max-h-[70vh] overflow-y-auto">
          <!-- Default Addresses Section -->
          <div class="grid grid-cols-2 gap-4 border p-4 rounded-md bg-muted/20">
            <div>
              <h4 class="font-semibold text-sm">Default Billing</h4>
              <p class="text-sm text-muted-foreground">
                @if (defaultBilling()) {
                  {{ defaultBilling()?.street }} {{ defaultBilling()?.houseNumber }}, {{ defaultBilling()?.city }}
                } @else {
                  Not set
                }
              </p>
            </div>
            <div>
              <h4 class="font-semibold text-sm">Default Delivery</h4>
              <p class="text-sm text-muted-foreground">
                @if (defaultDelivery()) {
                  {{ defaultDelivery()?.street }} {{ defaultDelivery()?.houseNumber }}, {{ defaultDelivery()?.city }}
                } @else {
                  Not set
                }
              </p>
            </div>
          </div>

          <!-- Section 1: Add Address -->
          <div class="border p-4 rounded-md">
            <h3 class="font-semibold mb-2">Add New Address</h3>
            <address-form (save)="handleAddAddress($event)"></address-form>
          </div>

          <!-- Section 2: Addresses Table -->
          <div class="border rounded-md overflow-hidden">
            <table hlmTable>
              <thead hlmTHead>
                <tr hlmTr>
                  <th hlmTh>Street</th>
                  <th hlmTh>City</th>
                  <th hlmTh>Postal Code</th>
                  <th hlmTh>Country</th>
                </tr>
              </thead>
              <tbody hlmTBody>
                @for (addr of addresses(); track addr.id) {
                  <tr hlmTr
                    [brnCtxMenuTriggerFor]="menu"
                    [brnCtxMenuTriggerData]="{ item: addr }"
                    class="hover:bg-muted/50 cursor-context-menu"
                  >
                    <td hlmTd>{{ addr.street }} {{ addr.houseNumber }}</td>
                    <td hlmTd>{{ addr.city }}</td>
                    <td hlmTd>{{ addr.postalCode }}</td>
                    <td hlmTd>{{ addr.countryCode }}</td>
                  </tr>
                }
                @if (addresses().length === 0) {
                  <tr hlmTr>
                    <td hlmTd colspan="4" class="text-center py-4 text-muted-foreground">No addresses found.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel variant="outline" (click)="ctx.close()">Close</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>

    <ng-template #menu let-item="item">
      <hlm-menu class="w-48">
        <hlm-menu-group>
          <button hlmMenuItem (click)="setDefaultBilling(item)">
            <ng-icon name="lucideCheck" class="mr-2" [class.opacity-0]="item.id !== _localCustomer()?.billingAddressId" />
            Set Default Billing
          </button>
          <button hlmMenuItem (click)="setDefaultDelivery(item)">
            <ng-icon name="lucideCheck" class="mr-2" [class.opacity-0]="item.id !== _localCustomer()?.deliveryAddressId" />
            Set Default Delivery
          </button>
        </hlm-menu-group>
      </hlm-menu>
    </ng-template>
  `
})
export class CustomerManageAddressesComponent {
    @ViewChild('trigger') protected readonly trigger!: ElementRef<HTMLButtonElement>;
    protected onCustomerUpdate = output<CustomerUpdateEvent>();

    public readonly customerSignal = input.required<CustomerDTO>({ alias: 'customer' });

    private _contextService = inject(ContextService);
    private _dataService: DataService = new DataServiceImpl(this._contextService.electronService);

      protected readonly addresses = signal<AddressDTO[]>([]);

      // Local signal to track customer state including defaults, initialized from input but mutable
      protected readonly _localCustomer = signal<CustomerDTO | undefined>(undefined);

      protected readonly defaultBilling = computed(() =>
        this.addresses().find(a => a.id === this._localCustomer()?.billingAddressId)
      );

      protected readonly defaultDelivery = computed(() =>
        this.addresses().find(a => a.id === this._localCustomer()?.deliveryAddressId)
      );

      open() {
        this.trigger.nativeElement.click();
        // Sync local signal with input when opening
        this._localCustomer.set(this.customerSignal());
        this.loadAddresses();
      }

      async loadAddresses() {
        const customer = this._localCustomer();
        if(customer) {
          const addrs = await this._dataService.addresses.findAllByCustomerId(customer.id);
          this.addresses.set(addrs);
        }
      }

      async handleAddAddress(addressData: any) {
        const customer = this._localCustomer();
        if(!customer) return;

        const newAddr: any = {
          ...addressData,
          customerId: customer.id
        };

        await this._dataService.addresses.createAddress(newAddr);
        await this.loadAddresses();
      }

      async setDefaultBilling(addr: AddressDTO) {
        const customer = this._localCustomer();
        if (!customer) return;

        const updatedCustomer = { ...customer, billingAddressId: addr.id };
        await this._dataService.customers.updateCustomer(customer.id, updatedCustomer);
        this._localCustomer.set(updatedCustomer);
        this.onCustomerUpdate.emit({ id: updatedCustomer.id, customer: updatedCustomer });
      }

      async setDefaultDelivery(addr: AddressDTO) {
        const customer = this._localCustomer();
        if (!customer) return;

        const updatedCustomer = { ...customer, deliveryAddressId: addr.id };
        await this._dataService.customers.updateCustomer(customer.id, updatedCustomer);
        this._localCustomer.set(updatedCustomer);
        this.onCustomerUpdate.emit({ id: updatedCustomer.id, customer: updatedCustomer });
      }
    }

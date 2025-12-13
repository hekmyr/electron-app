import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from "@angular/core";
import { HlmButtonImports } from '@libs/ui/button/src';
import { HlmCommandImports } from '@libs/ui/command/src';
import { HlmIconImports } from '@libs/ui/icon/src';
import { HlmPopoverImports } from '@libs/ui/popover/src';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronsUpDown, lucideSearch } from '@ng-icons/lucide';
import { CustomerDTO } from "@shared/dto/customer-dto.interface";
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';

@Component({
  selector: 'customer-combobox',
  standalone: true,
  imports: [
    CommonModule,
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
    <brn-popover [state]="_customerComboboxStateSignal()" (stateChanged)="_customerComboboxStateSignal.set($event)" sideOffset="5">
      <button
        class="w-full justify-between font-normal"
        variant="outline"
        brnPopoverTrigger
        (click)="$event.stopPropagation(); _customerComboboxStateSignal.set('open')"
        hlmBtn
      >
        @let selectedCustomer = _selectedCustomerSignal();
        {{ selectedCustomer ? (selectedCustomer.firstName + ' ' + selectedCustomer.lastName) : 'Select customer...' }}
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
              <button type="button" hlm-command-item [value]="customer.id" (click)="$event.stopPropagation()" (selected)="_selectCustomer(customer)">
                <span>{{ customer.firstName }} {{ customer.lastName }}</span>
                <ng-icon
                  hlm
                  class="ml-auto"
                  [class.opacity-0]="_selectedCustomerSignal()?.id !== customer.id"
                  name="lucideCheck"
                  hlmCommandIcon
                />
              </button>
            }
          </hlm-command-group>
        </hlm-command-list>
      </hlm-command>
    </brn-popover>
  `
})
export class CustomerComboboxComponent {
  public readonly customers = input<CustomerDTO[]>([]);
  public readonly selectedCustomer = output<CustomerDTO>();

  protected readonly _customerComboboxStateSignal = signal<'closed' | 'open'>('closed');
  protected readonly _selectedCustomerSignal = signal<CustomerDTO | undefined>(undefined);

  protected _selectCustomer(customer: CustomerDTO) {
    this._selectedCustomerSignal.set(customer);
    this._customerComboboxStateSignal.set('closed');
    this.selectedCustomer.emit(customer);
  }
}

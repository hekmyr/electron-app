import { Component, input, output } from '@angular/core';
import { CustomerDTO } from '@shared/dto/customer-dto.interface';

@Component({
  selector: 'customer-delete-confirm',
  template: `
    <div class="grid gap-4">
    @let customer = customerSignal();
    @if (customer) {
      <p class="text-sm text-muted-foreground">
        Are you sure you want to delete the customer
        <strong>{{ customer.firstName }} {{ customer.lastName }}</strong>?
        This action cannot be undone.
      </p>
    }
    </div>
  `,
})
export class CustomerDeleteConfirmComponent {
  public readonly customerSignal = input.required<CustomerDTO>({ alias: 'customer' });
  public readonly confirm = output<{ id: string }>();

  public submit() {
    const customerData = this.customerSignal();
    if (!customerData) return;

    this.confirm.emit({ id: customerData.id });
  }
}

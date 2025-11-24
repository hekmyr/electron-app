import { Component, input, output } from '@angular/core';
import { DeliveryDTO } from '@shared/dto/delivery-dto.interface';

@Component({
    selector: 'delivery-delete-confirm',
    standalone: true,
    template: `
    <p>
      Are you sure you want to delete delivery <span class="font-bold">{{ delivery().id }}</span>?
    </p>
  `
})
export class DeliveryDeleteConfirmComponent {
    public readonly delivery = input.required<DeliveryDTO>();
    public readonly confirm = output<{ id: string }>();

    public submit() {
        this.confirm.emit({ id: this.delivery().id });
    }
}

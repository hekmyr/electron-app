import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { HlmInput } from "@libs/ui/input/src";
import { DeliveryDTO } from "@shared/dto/delivery-dto.interface";

@Component({
  selector: 'delivery-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HlmInput
  ],
  template: `
    <form [formGroup]="_form" class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <label for="customerId" class="text-right text-sm font-medium">
          Customer ID
        </label>
        <input
          hlmInput
          id="customerId"
          formControlName="customerId"
          class="col-span-3"
        />
      </div>
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
      <div class="grid grid-cols-4 items-center gap-4">
        <label for="addressId" class="text-right text-sm font-medium">
          Address ID
        </label>
        <input
          hlmInput
          id="addressId"
          formControlName="addressId"
          class="col-span-3"
        />
      </div>
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
    </form>
  `
})
export class DeliveryFormComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);

  public readonly delivery = input<DeliveryDTO>();
  public readonly save = output<{ id: string; delivery: DeliveryDTO }>();

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
      this._form.patchValue({
        customerId: delivery.customerId,
        status: delivery.status,
        addressId: delivery.addressId,
        instructions: delivery.instructions,
        scheduledAt: delivery.scheduledAt ? new Date(delivery.scheduledAt).toISOString().slice(0, 16) : ''
      });
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

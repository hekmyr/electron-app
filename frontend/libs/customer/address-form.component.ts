import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmInput } from '@libs/ui/input/src';
import { HlmButton } from '@libs/ui/button/src';
import { AddressDTO } from '@shared/dto/address-dto.interface';
import { WithoutId } from '@shared/helper';

@Component({
  selector: 'address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmInput, HlmButton],
  template: `
    <form
      class="grid gap-4"
      [formGroup]="form"
      (ngSubmit)="submit()"
      id="address-form"
    >
      <div class="grid grid-cols-2 gap-4">
        <label class="grid gap-2 text-sm">
          <span>Street</span>
          <input hlmInput type="text" formControlName="street" placeholder="Street Name" />
        </label>

        <div class="grid grid-cols-2 gap-4">
          <label class="grid gap-2 text-sm">
            <span>House No.</span>
            <input hlmInput type="text" formControlName="houseNumber" placeholder="123" />
          </label>
          <label class="grid gap-2 text-sm">
            <span>Box</span>
            <input hlmInput type="text" formControlName="boxNumber" placeholder="A" />
          </label>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <label class="grid gap-2 text-sm">
          <span>Postal Code</span>
          <input hlmInput type="text" formControlName="postalCode" placeholder="1000" />
        </label>

        <label class="grid gap-2 text-sm">
          <span>City</span>
          <input hlmInput type="text" formControlName="city" placeholder="Brussels" />
        </label>
      </div>

      <label class="grid gap-2 text-sm">
        <span>Country Code</span>
        <input hlmInput type="text" formControlName="countryCode" placeholder="BE" />
      </label>

      <div class="flex justify-end">
        <button hlmBtn type="submit">Save address</button>
      </div>
    </form>
  `,
})
export class AddressFormComponent {
  public readonly save = output<WithoutId<AddressDTO>>();

  private readonly _formBuilder = inject(NonNullableFormBuilder);

  protected readonly form = this._formBuilder.group({
    street: ['', [Validators.required, Validators.minLength(2)]],
    houseNumber: ['', [Validators.required]],
    boxNumber: [''],
    postalCode: ['', [Validators.required]],
    city: ['', [Validators.required]],
    countryCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
  });

  public submit() {
    if (this.form.invalid) return;

    const formValues = this.form.getRawValue();

    // We emit the form values. The parent component will handle adding customerId and IDs.
    // But AddressDTO requires customerId.
    // Here we return a partial object or WithoutId<AddressDTO> but missing customerId?
    // Let's just emit the values. Parent will merge.

    const addressData: any = {
      ...formValues,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.save.emit(addressData);
    this.form.reset();
  }
}

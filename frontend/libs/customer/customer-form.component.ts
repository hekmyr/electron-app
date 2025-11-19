import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, input, output } from '@angular/core';
import { FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmInput } from '@libs/ui/input/src';
import { CustomerDTO } from '@shared/dto/customer-dto.interface';

@Component({
  selector: 'customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmInput],
  template: `
    <form
      class="grid gap-4"
      [formGroup]="form"
      (ngSubmit)="submit()"
      id="edit-customer-form"
    >
      <label class="grid gap-2 text-sm">
        <span>First name</span>
        <input hlmInput type="text" formControlName="firstName" />
      </label>

      <label class="grid gap-2 text-sm">
        <span>Last name</span>
        <input hlmInput type="text" formControlName="lastName" />
      </label>
    </form>
  `,
})
export class CustomerFormComponent implements OnInit {
  public readonly customerSignal = input<CustomerDTO>(undefined, {alias: 'customer'});
  public readonly save = output<{ id: string; customer: CustomerDTO }>();

  private readonly _formBuilder = inject(NonNullableFormBuilder);

  protected readonly form = this._formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
  });

  public ngOnInit() {
    const customer = this.customerSignal();
    if (customer) this.form.patchValue({
      firstName: customer.firstName,
      lastName: customer.lastName
    });
  }

  public submit() {
    const customer = this.customerSignal();
    if (this.form.invalid || !customer) return;

    const formValues = this.form.getRawValue();
    const updatedCustomer: CustomerDTO = {
      ...customer,
      ...formValues,
      updatedAt: new Date(),
    };

    this.save.emit({ id: customer.id, customer: updatedCustomer });
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
      (ngSubmit)="handleSubmit()"
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
  public readonly save = output<CustomerDTO>();

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
  });

  public ngOnInit() {
    const customer = this.customerSignal();
    if (customer) this.form.patchValue({
      firstName: customer.firstName,
      lastName: customer.lastName
    });
  }

  protected handleSubmit() {
    if (this.form.invalid) return;
  }
}

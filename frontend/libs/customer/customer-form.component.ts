import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, input, output } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HlmInput } from '@libs/ui/input/src';
import { HlmDatePicker } from '@libs/ui/date-picker/src';
import { CustomerDTO } from '@shared/dto/customer-dto.interface';
import { UtilService } from '@/shared/services/util.service';
import { calculateAge, MIN_AGE } from '@shared/helper';

@Component({
  selector: 'customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmInput, HlmDatePicker],
  template: `
    <form
      class="grid gap-4"
      [formGroup]="form"
      (ngSubmit)="submit()"
      id="edit-customer-form"
    >
      <h3 class="text-lg font-medium">Customer Details</h3>
      <div class="grid grid-cols-2 gap-4">
        <label class="grid gap-2 text-sm">
          <span>First name</span>
          <input hlmInput type="text" formControlName="firstName" />
        </label>

        <label class="grid gap-2 text-sm">
          <span>Last name</span>
          <input hlmInput type="text" formControlName="lastName" />
        </label>
      </div>

      <label class="grid gap-2 text-sm">
        <span>Birth date</span>
        <hlm-date-picker
          formControlName="birthdate"
          class="w-full"
          [formatDate]="formatDate"
          captionLayout="dropdown"
          [max]="maxBirthdate"
        />
      </label>

      <h3 class="text-lg font-medium mt-4">Contact Information</h3>
      <div class="grid grid-cols-2 gap-4">
        <label class="grid gap-2 text-sm">
          <span>Email</span>
          <input hlmInput type="email" formControlName="email" />
        </label>

        <label class="grid gap-2 text-sm">
          <span>Phone</span>
          <input hlmInput type="tel" formControlName="phone" />
        </label>
      </div>
    </form>
  `,
})
export class CustomerFormComponent implements OnInit {
  public readonly customerSignal = input<CustomerDTO>(undefined, { alias: 'customer' });
  public readonly save = output<{ id: string; customer: CustomerDTO }>();

  private readonly _formBuilder = inject(NonNullableFormBuilder);

  protected readonly maxBirthdate = ((today) => new Date(today.getFullYear() - MIN_AGE, today.getMonth(), today.getDate()))(new Date());

  protected readonly form = this._formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    birthdate: [this.maxBirthdate, [Validators.required, minAgeValidator(MIN_AGE)]],
  });

  protected readonly formatDate = UtilService.formatLongDate;

  public ngOnInit() {
    const customer = this.customerSignal();
    if (customer) {
      this.form.patchValue({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        birthdate: customer.birthdate
      });
    }
  }

  public submit() {
    if (this.form.invalid) return;

    const formValues = this.form.getRawValue();
    const customer = this.customerSignal();

    let id: string = crypto.randomUUID();
    let createdAt = new Date();
    let updatedAt = new Date();

    if (customer) {
      id = customer.id;
      createdAt = customer.createdAt;
    }

    const updatedCustomer: CustomerDTO = {
      id,
      createdAt,
      updatedAt,
      ...formValues,
      birthdate: new Date(formValues.birthdate),
    };

    this.save.emit({ id, customer: updatedCustomer });
  }
}

function minAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }
    const age = calculateAge(control.value);
    return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
  };
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmInput } from '@libs/ui/input/src';
import { isPackageStatus, PackageDTO } from '@shared/dto/package-dto.interface';

@Component({
  selector: 'package-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmInput],
  template: `
    <form
      class="grid gap-4"
      [formGroup]="form"
      (ngSubmit)="submit()"
      id="edit-package-form"
    >
      <h3 class="text-lg font-medium">Package Details</h3>
      <div class="grid gap-4">
        <label class="grid gap-2 text-sm">
          <span>Name</span>
          <input hlmInput type="text" formControlName="name" />
        </label>

        <label class="grid gap-2 text-sm">
          <span>Description</span>
          <input hlmInput type="text" formControlName="description" />
        </label>
        
        <label class="grid gap-2 text-sm">
          <span>Customer ID</span>
          <input hlmInput type="text" formControlName="customerId" />
        </label>

        <label class="grid gap-2 text-sm">
          <span>Status</span>
          <input hlmInput type="text" formControlName="status" />
        </label>
      </div>
    </form>
  `,
})
export class PackageFormComponent implements OnInit {
  public readonly packageSignal = input<PackageDTO>(undefined, { alias: 'package' });
  public readonly save = output<{ id: string; package: PackageDTO }>();

  private readonly _formBuilder = inject(NonNullableFormBuilder);

  protected readonly form = this._formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]],
    customerId: ['', [Validators.required]],
    status: ['received', [Validators.required]],
  });

  public ngOnInit() {
    const pkg = this.packageSignal();
    if (pkg) {
      this.form.patchValue({
        name: pkg.name,
        description: pkg.description,
        customerId: pkg.customerId,
        status: pkg.status
      });
    }
  }

  public submit() {
    if (this.form.invalid) return;

    const formValues = this.form.getRawValue();
    const pkg = this.packageSignal();

    if (!isPackageStatus(formValues.status)) return;

    let id: string = crypto.randomUUID();
    let createdAt = new Date();
    let receivedAt = new Date();
    let status = formValues.status;

    if (pkg) {
      id = pkg.id;
      createdAt = pkg.createdAt;
      receivedAt = pkg.receivedAt || new Date();
    }

    const updatedPackage: PackageDTO = {
      id,
      createdAt,
      receivedAt,
      ...formValues,
      status,
    };

    this.save.emit({ id, package: updatedPackage });
  }
}

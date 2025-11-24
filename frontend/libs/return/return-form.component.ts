import { Component, OnInit, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmInput } from '@libs/ui/input/src';
import { isReturnStatus, ReturnDTO } from '@shared/dto/return-dto.interface';

@Component({
  selector: 'return-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmInput],
  template: `
    <form
      class="grid gap-4"
      [formGroup]="form"
      (ngSubmit)="submit()"
      id="edit-return-form"
    >
      <h3 class="text-lg font-medium">Return Details</h3>
      <div class="grid gap-4">
        <label class="grid gap-2 text-sm">
          <span>Package ID</span>
          <input hlmInput type="text" formControlName="packageId" />
        </label>

        <label class="grid gap-2 text-sm">
          <span>Status</span>
          <select hlmInput formControlName="status">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label class="grid gap-2 text-sm">
          <span>Reason</span>
          <textarea hlmInput formControlName="reason" rows="3"></textarea>
        </label>
      </div>
    </form>
  `,
})
export class ReturnFormComponent implements OnInit {
  public readonly returnSignal = input<ReturnDTO>(undefined, { alias: 'return' });
  public readonly save = output<{ id: string; return: ReturnDTO }>();

  private readonly _formBuilder = inject(NonNullableFormBuilder);

  protected readonly form = this._formBuilder.group({
    packageId: ['', [Validators.required]],
    status: ['pending', [Validators.required]],
    reason: ['', [Validators.required, Validators.minLength(10)]],
  });

  public ngOnInit() {
    const returnData = this.returnSignal();
    if (returnData) {
      this.form.patchValue({
        packageId: returnData.packageId,
        status: returnData.status,
        reason: returnData.reason
      });
    }
  }

  public submit() {
    if (this.form.invalid) return;

    const formValues = this.form.getRawValue();
    const returnData = this.returnSignal();

    if (!isReturnStatus(formValues.status)) return;

    let id: string = crypto.randomUUID();
    let createdAt = new Date();
    let updatedAt = new Date();

    if (returnData) {
      id = returnData.id;
      createdAt = returnData.createdAt;
    }

    const updatedReturn: ReturnDTO = {
      id,
      createdAt,
      updatedAt,
      ...formValues,
    };

    this.save.emit({ id, return: updatedReturn });
  }
}

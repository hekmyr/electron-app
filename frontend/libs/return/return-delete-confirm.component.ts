import { Component, input, output } from '@angular/core';
import { ReturnDTO } from '@shared/dto/return-dto.interface';

@Component({
    selector: 'return-delete-confirm',
    template: `
    <div class="grid gap-4">
      @let returnData = returnSignal();
      @if (returnData) {
        <p class="text-sm text-muted-foreground">
          Are you sure you want to delete this return for package
          <strong>{{ returnData.packageId }}</strong>?
          This action cannot be undone.
        </p>
      }
    </div>
  `,
})
export class ReturnDeleteConfirmComponent {
    public readonly returnSignal = input.required<ReturnDTO>({ alias: 'return' });
    public readonly confirm = output<{ id: string }>();

    public submit() {
        const returnData = this.returnSignal();
        if (!returnData) return;

        this.confirm.emit({ id: returnData.id });
    }
}

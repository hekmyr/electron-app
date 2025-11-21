import { Component, input, output } from '@angular/core';
import { PackageDTO } from '@shared/dto/package-dto.interface';

@Component({
  selector: 'package-delete-confirm',
  template: `
    <div class="grid gap-4">
      @let pkg = packageSignal();
      @if (pkg) {
        <p class="text-sm text-muted-foreground">
          Are you sure you want to delete the package
          <strong>{{ pkg.name }}</strong>?
          This action cannot be undone.
        </p>
      }
    </div>
  `,
})
export class PackageDeleteConfirmComponent {
  public readonly packageSignal = input.required<PackageDTO>({ alias: 'package' });
  public readonly confirm = output<{ id: string }>();

  public submit() {
    const packageData = this.packageSignal();
    if (!packageData) return;

    this.confirm.emit({ id: packageData.id });
  }
}

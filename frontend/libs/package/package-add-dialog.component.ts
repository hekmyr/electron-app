import { Component, ElementRef, output, viewChild } from "@angular/core";
import { HlmAlertDialogImports } from "@libs/ui/alert-dialog/src";
import { HlmButton } from "@libs/ui/button/src";
import { PackageDTO } from "@shared/dto/package-dto.interface";
import { BrnAlertDialogImports } from "@spartan-ng/brain/alert-dialog";
import { PackageFormComponent } from "./package-form.component";

@Component({
  selector: 'package-add-dialog',
  standalone: true,
  imports: [
    HlmAlertDialogImports,
    BrnAlertDialogImports,
    HlmButton,
    PackageFormComponent
  ],
  template: `
    <hlm-alert-dialog>
      <button
        #triggerRef
        class="hidden"
        brnAlertDialogTrigger
      ></button>
      <hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>Add package</h2>
          <p hlmAlertDialogDescription>
            Create a new package.
          </p>
        </hlm-alert-dialog-header>

        <package-form
          #formComponent
          (save)="handleSave($event, ctx)"
        />

        <hlm-alert-dialog-footer>
          <button
            hlmAlertDialogCancel
            variant="ghost"
            (click)="ctx.close()"
          >
            Cancel
          </button>
          <button
            hlmBtn
            variant="default"
            (click)="formComponent.submit()"
          >
            Create package
          </button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `
})
export class PackageAddDialogComponent {
  protected readonly triggerRefSignal = viewChild.required<ElementRef<HTMLButtonElement>>('triggerRef');

  public readonly save = output<{ id: string; package: PackageDTO }>();

  public open() {
    const triggerRef = this.triggerRefSignal();
    triggerRef.nativeElement.click();
  }

  protected handleSave(event: { id: string; package: PackageDTO }, ctx: { close: () => void }) {
    this.save.emit(event);
    ctx.close();
  }
}

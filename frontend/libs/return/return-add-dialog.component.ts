import { Component, ElementRef, input, output, viewChild } from "@angular/core";
import { HlmAlertDialogImports } from "@libs/ui/alert-dialog/src";
import { HlmButton } from "@libs/ui/button/src";
import { PackageDTO } from "@shared/dto/package-dto.interface";
import { ReturnDTO } from "@shared/dto/return-dto.interface";
import { BrnAlertDialogImports } from "@spartan-ng/brain/alert-dialog";
import { ReturnFormComponent } from "./return-form.component";

@Component({
    selector: 'return-add-dialog',
    standalone: true,
    imports: [
        HlmAlertDialogImports,
        BrnAlertDialogImports,
        HlmButton,
        ReturnFormComponent
    ],
    template: `
    <hlm-alert-dialog>
      <button
        #triggerRef
        class="hidden"
        brnAlertDialogTrigger
      ></button>
      <hlm-alert-dialog-content *brnAlertDialogContent="let ctx" size="md">
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>Add return</h2>
          <p hlmAlertDialogDescription>
            Create a new return request.
          </p>
        </hlm-alert-dialog-header>

        <return-form
          #formComponent
          [packages]="packages()"
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
            Create return
          </button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `
})
export class ReturnAddDialogComponent {
    protected readonly triggerRefSignal = viewChild.required<ElementRef<HTMLButtonElement>>('triggerRef');

    public readonly packages = input<PackageDTO[]>([]);
    public readonly save = output<{ id: string; return: ReturnDTO }>();

    public open() {
        const triggerRef = this.triggerRefSignal();
        triggerRef.nativeElement.click();
    }

    protected handleSave(event: { id: string; return: ReturnDTO }, ctx: { close: () => void }) {
        this.save.emit(event);
        ctx.close();
    }
}

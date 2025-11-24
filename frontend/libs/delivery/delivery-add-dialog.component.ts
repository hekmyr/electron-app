import { Component, ElementRef, input, output, viewChild } from "@angular/core";
import { HlmAlertDialogImports } from "@libs/ui/alert-dialog/src";
import { HlmButton } from "@libs/ui/button/src";
import { DeliveryDTO } from "@shared/dto/delivery-dto.interface";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";
import { BrnAlertDialogImports } from "@spartan-ng/brain/alert-dialog";
import { DeliveryFormComponent } from "./delivery-form.component";

@Component({
    selector: 'delivery-add-dialog',
    standalone: true,
    imports: [
        HlmAlertDialogImports,
        BrnAlertDialogImports,
        HlmButton,
        DeliveryFormComponent
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
          <h2 hlmAlertDialogTitle>Add delivery</h2>
          <p hlmAlertDialogDescription>
            Create a new delivery.
          </p>
        </hlm-alert-dialog-header>

        <delivery-form
          #formComponent
          [customers]="customers()"
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
            Create delivery
          </button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `
})
export class DeliveryAddDialogComponent {
    protected readonly triggerRefSignal = viewChild.required<ElementRef<HTMLButtonElement>>('triggerRef');

    public readonly customers = input<CustomerDTO[]>([]);
    public readonly save = output<{ id: string; delivery: DeliveryDTO }>();

    public open() {
        const triggerRef = this.triggerRefSignal();
        triggerRef.nativeElement.click();
    }

    protected handleSave(event: { id: string; delivery: DeliveryDTO }, ctx: { close: () => void }) {
        this.save.emit(event);
        ctx.close();
    }
}

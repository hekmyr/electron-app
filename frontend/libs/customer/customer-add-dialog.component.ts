import { Component, input, output, ViewChild, ElementRef } from "@angular/core";
import { HlmAlertDialogImports } from "@libs/ui/alert-dialog/src";
import { HlmButton } from "@libs/ui/button/src";
import { BrnAlertDialogImports } from "@spartan-ng/brain/alert-dialog";
import { CustomerFormComponent } from "./customer-form.component";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";

@Component({
    selector: 'customer-add-dialog',
    standalone: true,
    imports: [
        HlmAlertDialogImports,
        BrnAlertDialogImports,
        HlmButton,
        CustomerFormComponent
    ],
    template: `
    <hlm-alert-dialog>
      <button
        #trigger
        class="hidden"
        brnAlertDialogTrigger
      ></button>
      <hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>Add customer</h2>
          <p hlmAlertDialogDescription>
            Create a new customer.
          </p>
        </hlm-alert-dialog-header>

        <customer-form
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
            Create customer
          </button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `
})
export class CustomerAddDialogComponent {
    @ViewChild('trigger') protected readonly trigger!: ElementRef<HTMLButtonElement>;

    public readonly save = output<{ id: string; customer: CustomerDTO }>();

    public open() {
        this.trigger.nativeElement.click();
    }

    protected handleSave(event: { id: string; customer: CustomerDTO }, ctx: { close: () => void }) {
        this.save.emit(event);
        ctx.close();
    }
}

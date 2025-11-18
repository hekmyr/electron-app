import { Icon } from "@/shared/types/icon";
import { Component, Type, input } from "@angular/core";
import { NgComponentOutlet } from "@angular/common";
import { HlmAlertDialogImports } from "@libs/ui/alert-dialog/src";
import { HlmButton } from "@libs/ui/button/src";
import { NgIcon } from "@ng-icons/core";
import { BrnAlertDialogImports } from "@spartan-ng/brain/alert-dialog";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";

@Component({
  selector: 'customer-actions',
  standalone: true,
  imports: [
    NgComponentOutlet,
    HlmButton,
    NgIcon,
    HlmAlertDialogImports,
    BrnAlertDialogImports
  ],
    template: `
      <div class="flex gap-2">
        @let actions = actionSignal();
        @for (item of actions; track item.label) {
          <hlm-alert-dialog>
            <button
              hlmBtn
              variant="ghost"
              brnAlertDialogTrigger
              type="button"
            >
              <ng-icon hlm [name]="item.icon.name" />
            </button>

            <hlm-alert-dialog-content *brnAlertDialogContent="let dialogCtx">
              @if (item.dialog.title || item.dialog.description) {
                <hlm-alert-dialog-header>
                  @if (item.dialog.title) {
                    <h2 hlmAlertDialogTitle>{{ item.dialog.title }}</h2>
                  }
                  @if (item.dialog.description) {
                    <p hlmAlertDialogDescription>
                      {{ item.dialog.description }}
                    </p>
                  }
                </hlm-alert-dialog-header>
              }

              <ng-container
                *ngComponentOutlet="
                  item.dialog.component;
                  inputs: buildDialogInputs(item);
                "
              />

              <hlm-alert-dialog-footer>
                <button
                  hlmAlertDialogCancel
                  variant="ghost"
                  (click)="dialogCtx.close()"
                >
                  {{ item.dialog.cancelLabel ?? 'Cancel' }}
                </button>
                
                <button
                  hlmAlertDialogCancel
                  variant="default"
                  (click)="executeAction(item, dialogCtx)"
                >
                  {{ item.dialog.confirmLabel ?? 'Save changes' }}
                </button>
              </hlm-alert-dialog-footer>
            </hlm-alert-dialog-content>
          </hlm-alert-dialog>
        }
      </div>
    `
})
export class CustomerActionsComponent {
  public readonly actionSignal = input.required<Action<CustomerDTO>[]>({alias: 'actions'});
  public readonly contextSignal = input.required<any>({alias: 'context'});

  protected buildDialogInputs(action: Action<CustomerDTO>) {
    const context = this.contextSignal();
    return action.dialog.inputs(context);
  }

  protected executeAction(action: Action<CustomerDTO>, dialog: DialogContext) {
    action.execute();
    dialog.close();
  }
}

export interface Action<T> {
  label: string;
  icon: Icon,
  execute: () => void;
  dialog: ActionDialog<T>;
}

export interface ActionDialog<T> {
  component: Type<any>;
  title?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  inputs: (context: T) => Record<string, T>;
}

interface DialogContext {
  close: () => void;
}
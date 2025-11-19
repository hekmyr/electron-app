import { Icon } from "@/shared/types/icon";
import { Component, Type, input, ViewChild } from "@angular/core";
import { NgComponentOutlet } from "@angular/common";
import { HlmAlertDialogImports } from "@libs/ui/alert-dialog/src";
import { HlmButton } from "@libs/ui/button/src";
import { NgIcon } from "@ng-icons/core";
import { BrnAlertDialogImports } from "@spartan-ng/brain/alert-dialog";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";
import { CustomerFormComponent } from "./customer-form.component";
import { CustomerDeleteConfirmComponent } from "./customer-delete-confirm.component";

@Component({
  selector: 'customer-actions',
  standalone: true,
  imports: [
    NgComponentOutlet,
    HlmButton,
    NgIcon,
    HlmAlertDialogImports,
    BrnAlertDialogImports,
    CustomerFormComponent,
    CustomerDeleteConfirmComponent
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

              @switch (item.label) {
                @case ('Edit') {
                  <customer-form
                    #formComponent
                    [customer]="contextSignal()"
                    (save)="handleFormSave($event, item, dialogCtx)"
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
                      hlmBtn
                      variant="default"
                      (click)="formComponent.submit()"
                    >
                      {{ item.dialog.confirmLabel ?? 'Save changes' }}
                    </button>
                  </hlm-alert-dialog-footer>
                }
                @case ('Delete') {
                  <customer-delete-confirm
                    #confirmComponent
                    [customer]="contextSignal()"
                    (confirm)="handleConfirm($event, item, dialogCtx)"
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
                      hlmBtn
                      variant="destructive"
                      (click)="confirmComponent.submit()"
                    >
                      {{ item.dialog.confirmLabel ?? 'Confirm' }}
                    </button>
                  </hlm-alert-dialog-footer>
                }
                @default {
                  <div class="p-4">
                    <p class="text-destructive">Action "{{ item.label }}" is not implemented.</p>
                    <hlm-alert-dialog-footer class="mt-4">
                      <button
                        hlmBtn
                        variant="ghost"
                        (click)="dialogCtx.close()"
                      >
                        Close
                      </button>
                    </hlm-alert-dialog-footer>
                  </div>
                }
              }
            </hlm-alert-dialog-content>
          </hlm-alert-dialog>
        }
      </div>
    `
})
export class CustomerActionsComponent {
  public readonly actionSignal = input.required<CustomerAction[]>({ alias: 'actions' });
  public readonly contextSignal = input.required<CustomerDTO>({ alias: 'context' });

  protected buildDialogInputs(action: CustomerAction) {
    const context = this.contextSignal();
    return action.dialog.inputs(context);
  }

  private hasSaveCallback(inputs: Record<string, any>): inputs is { save: (event: { id: string; customer: CustomerDTO }) => void } {
    return 'save' in inputs && typeof inputs['save'] === 'function';
  }

  protected handleFormSave(event: { id: string; customer: CustomerDTO }, action: CustomerAction, dialog: DialogContext) {

    const inputs = this.buildDialogInputs(action);
    if (this.hasSaveCallback(inputs)) {
      inputs.save(event);
    }

    dialog.close();
  }

  protected handleConfirm(event: { id: string }, action: CustomerAction, dialog: DialogContext) {
    const inputs = this.buildDialogInputs(action);
    if (this.hasConfirmCallback(inputs)) {
      inputs.confirm(event);
    }

    dialog.close();
  }

  private hasConfirmCallback(inputs: Record<string, any>): inputs is { confirm: (event: { id: string }) => void } {
    return 'confirm' in inputs && typeof inputs['confirm'] === 'function';
  }
}

const actionLabels = ['Edit', 'Delete'] as const;
type ActionLabel = typeof actionLabels[number];

export interface CustomerAction {
  label: ActionLabel;
  icon: Icon,
  dialog: CustomerActionDialog;
}

export interface CustomerActionDialog {
  title?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  inputs: (context: CustomerDTO) => Record<string, any>;
}

interface DialogContext {
  close: () => void;
}
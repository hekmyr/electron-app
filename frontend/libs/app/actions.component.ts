import { Icon } from "@/shared/types/icon";
import { Component, input } from "@angular/core";
import { HlmButton } from "@libs/ui/button/src";
import { NgIcon } from "@ng-icons/core";

@Component({
  selector: 'app-actions',
  imports: [HlmButton, NgIcon],
    template: `
      <div class="flex gap-2">
        @let actions = actionSignal();
        @for (item of actions; track item.label) {
          <button
            hlmBtn
            variant="ghost"
            (click)="handleAction(item)"
          >
            <ng-icon hlm [name]="item.icon.name" />
          </button>
        }
      </div>
    `
})
export class ActionsComponent {
  public readonly actionSignal = input.required<Action[]>({alias: 'actions'});
  public readonly contextSignal = input<any>(null, { alias: 'context' });

  protected handleAction(action: Action) {
    action.onClick?.(this.contextSignal());
  }
}

export interface Action<T = unknown> {
  label: string;
  icon: Icon,
  onClick: (context?: T | null) => void;
  dialog?: string;
}
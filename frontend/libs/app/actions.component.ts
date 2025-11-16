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
            (click)="item.onClick()"
          >
            <ng-icon hlm [name]="item.icon.name" />
          </button>
        }
      </div>
    `
})
export class ActionsComponent {
  public readonly actionSignal = input.required<Action[]>({alias: 'actions'});
}

export interface Action {
  label: string;
  icon: Icon,
  onClick: () => void;
}
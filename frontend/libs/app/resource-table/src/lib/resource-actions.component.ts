import { Component, input } from "@angular/core";
import { HlmButton } from "@libs/ui/button/src";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucidePenLine, lucideTrash2 } from "@ng-icons/lucide";

@Component({
  selector: 'resource-actions',
  standalone: true,
  imports: [
    HlmButton,
    NgIcon
  ],
  providers: [
    provideIcons({ lucidePenLine, lucideTrash2 })
  ],
  template: `
    <div class="flex gap-2">
      @for (action of actions(); track action.label) {
        <button
          hlmBtn
          [variant]="action.variant || 'ghost'"
          size="icon"
          (click)="action.onClick(context())"
          [title]="action.label"
        >
          <ng-icon [name]="action.icon" />
        </button>
      }
    </div>
  `
})
export class ResourceActionsComponent<T> {
  actions = input.required<ResourceAction<T>[]>();
  context = input.required<T>();
}

import { Component, input } from "@angular/core";
import { HlmIconImports } from '@libs/ui/icon/src';
import { HlmMenuImports } from '@libs/ui/menu/src';
import { HlmTable, HlmTableContainer, HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTr } from "@libs/ui/table/src";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideGitBranch, lucidePenLine, lucideTrash2 } from "@ng-icons/lucide";
import { BrnContextMenuImports } from '@spartan-ng/ui-menu-brain';
import type { ColumnDef } from '@tanstack/angular-table';
import { createAngularTable, FlexRenderDirective, getCoreRowModel } from '@tanstack/angular-table';

export type ResourceColumnDef<T> = ColumnDef<T, any>;

export interface ResourceAction<T> {
  label: string;
  icon: string;
  onClick: (row: T) => void;
}

@Component({
  selector: 'resource-table',
  imports: [
    HlmTable,
    FlexRenderDirective,
    HlmTableContainer,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd,
    BrnContextMenuImports,
    HlmMenuImports,
    HlmIconImports,
    NgIcon
  ],
  providers: [
    provideIcons({
      lucideGitBranch,
      lucidePenLine,
      lucideTrash2
    })
  ],
  template: `
		@defer {
		<div hlmTableContainer>
		  <table hlmTable>
		    <thead hlmTHead>
		      @for (headerGroup of _table.getHeaderGroups(); track headerGroup.id) {
		        <tr hlmTr>
		          @for (header of headerGroup.headers; track header.id) {
		            <th hlmTh>
		              @if (!header.isPlaceholder) {
		                <ng-container
		                  *flexRender="
		                    header.column.columnDef.header;
		                    props: header.getContext();
		                    let headerText
		                  "
		                >
		                  {{ headerText }}
		                </ng-container>
		              }
		            </th>
		          }
		        </tr>
		      }
		    </thead>
		    <tbody hlmTBody>
		      @for (row of _table.getRowModel().rows; track row.id) {
		        <tr hlmTr class="h-8"
		            [brnCtxMenuTriggerFor]="menu"
		            [brnCtxMenuTriggerData]="{ item: row.original }">
		          @let cells = row.getVisibleCells();
		          @for (cell of cells; track cell.id) {
		            <td hlmTd
		                class="relative">
		                <ng-container
		                  *flexRender="
		                    cell.column.columnDef.cell;
		                    props: cell.getContext();
		                    let cellText
		                  "
		                >
		                  {{ cellText }}
		                </ng-container>
		            </td>
		          }
		        </tr>
		      }
		    </tbody>
		  </table>
		</div>

		<ng-template #menu let-item="item">
		  <hlm-menu class="w-48">
		    <hlm-menu-group class="flex flex-col gap-1">
		      @for (action of actions(); track action.label) {
		        <button hlmMenuItem (click)="action.onClick(item)">
		          <ng-icon hlm size="sm" [name]="action.icon" />
		          {{ action.label }}
		        </button>
		      }
		    </hlm-menu-group>
		  </hlm-menu>
		</ng-template>
		}
	`,
})
export class ResourceTableComponent<T> {
  public readonly columns = input.required<ResourceColumnDef<T>[]>();
  public readonly data = input.required<T[]>();
  public readonly actions = input<ResourceAction<T>[]>([]);

  protected readonly _table = createAngularTable<T>(() => ({
    data: this.data(),
    columns: this.columns(),
    getCoreRowModel: getCoreRowModel(),
  }));
}

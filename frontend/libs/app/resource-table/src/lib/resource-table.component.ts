import { Component, input } from "@angular/core";
import { HlmTable, HlmTableContainer, HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTr } from "@libs/ui/table/src";
import type { ColumnDef, Row } from '@tanstack/angular-table';
import { createAngularTable, FlexRenderDirective, getCoreRowModel } from '@tanstack/angular-table';
import { ResourceAction, ResourceActionsComponent } from "./resource-actions.component";

export type ResourceColumnDef<T> = ColumnDef<T, any>;

@Component({
  selector: 'resource-table',
  standalone: true,
  imports: [
    HlmTable,
    FlexRenderDirective,
    HlmTableContainer,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd,
    ResourceActionsComponent
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
              <tr hlmTr class="h-8">
                @let cells = row.getVisibleCells();
                @for (cell of cells; track cell.id) {
                  <td hlmTd
                    class="relative"
                    (mouseenter)="setHoveredDetails(row)"
                  >
                    @if (isRowActionColumn(cell.column.columnDef.meta)) {
                      @if (isLineHovered(row)) {
                        <resource-actions
                          [actions]="actions()"
                          [context]="row.original"
                        />
                      }
                    } @else {
                      <ng-container
                        *flexRender="
                          cell.column.columnDef.cell;
                          props: cell.getContext();
                          let cellText
                        "
                      >
                        {{ cellText }}
                      </ng-container>
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
			  </table>
			</div>
		}
	`,
})
export class ResourceTableComponent<T> {
  public readonly columns = input.required<ResourceColumnDef<T>[]>();
  public readonly data = input.required<T[]>();
  public readonly actions = input<ResourceAction<T>[]>([]);

  protected _hoveredDetails: Row<T> | null = null;

  protected readonly _table = createAngularTable<T>(() => ({
    data: this.data(),
    columns: this.columns(),
    getCoreRowModel: getCoreRowModel(),
  }));

  setHoveredDetails(rowDetails: Row<T> | null) {
    if (rowDetails === null) {
      this._hoveredDetails = null;
      return;
    }
    this._hoveredDetails = rowDetails;
  }

  isLineHovered(row: Row<T>) {
    return this._hoveredDetails?.id === row.id;
  }

  isRowActionColumn(meta: any): boolean {
    return meta?.kind === 'rowActions';
  }
}

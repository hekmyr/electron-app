import { Component, input } from "@angular/core";
import { HlmTable, HlmTableContainer, HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTr } from "@libs/ui/table/src";
import type { ColumnDef } from '@tanstack/angular-table';
import { createAngularTable, FlexRenderDirective, getCoreRowModel } from '@tanstack/angular-table';
import { Action, CustomerActionsComponent } from "./customer-actions.component";

@Component({
	selector: 'app-table',
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
    CustomerActionsComponent
  ],
	template: `
		<!-- we defer the loading of the table, because tanstack manipulates the DOM with flexRender which can cause errors during SSR -->
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
                        <customer-actions
                          [actions]="actionsSignal()"
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
export class CustomerTableComponent<T> {
	public readonly columnsSignal = input.required<ColumnDef<T, any>[]>({ alias: 'columns' });
	public readonly dataSignal = input.required<T[]>({ alias: 'data' });
  public readonly actionsSignal = input<Action<T>[]>([], { alias: 'actions' });
  
  protected _hoveredDetails: HoveredDetails | null = null;

	protected readonly _table = createAngularTable<T>(() => ({
		data: this.dataSignal(),
		columns: this.columnsSignal(),
		getCoreRowModel: getCoreRowModel(),
	}));

  setHoveredDetails(rowDetails: Row<T> | null) {
    if (rowDetails === null) {
      this._hoveredDetails = null;
      return;
    }
    const original: any = rowDetails.original;
    const index = rowDetails.index;
    this._hoveredDetails = {
      id: original.id,
      index: index
    }
  }

  isLineHovered(row: Row<T>) {
    if (this._hoveredDetails === null) return false;
    return this._hoveredDetails.index === row.index;
  }

  protected isRowActionColumn(meta: ColumnMeta | undefined): meta is RowActionColumnMeta {
    return !!meta && meta.kind === 'rowActions';
  }
}

interface Row<T> {
  original: T;
  index: number;
}

interface HoveredDetails {
  id: string;
  index: number;
}

interface ColumnMeta {
  kind?: 'rowActions' | string;
}

interface RowActionColumnMeta extends ColumnMeta {
  kind: 'rowActions';
}
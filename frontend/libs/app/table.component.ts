import { Component, input } from "@angular/core";
import { HlmTable, HlmTableContainer, HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTr } from "@libs/ui/table/src";
import type { ColumnDef } from '@tanstack/angular-table';
import { createAngularTable, FlexRenderDirective, getCoreRowModel } from '@tanstack/angular-table';

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
    HlmTd
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
                @for (cell of row.getVisibleCells(); track cell.id) {
                  <td hlmTd>
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
		}
	`,
})
export class TableComponent<T> {
	public readonly columns = input.required<ColumnDef<T, any>[]>();
	public readonly data = input.required<T[]>();

	protected readonly _table = createAngularTable<T>(() => ({
		data: this.data(),
		columns: this.columns(),
		getCoreRowModel: getCoreRowModel(),
	}));
}


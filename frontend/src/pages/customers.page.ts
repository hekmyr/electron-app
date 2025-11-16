import { Component, inject } from "@angular/core";
import { ShellComponent } from "@libs/app/shell.component";
import { BreadcrumbItem } from "@libs/app/header.component";
import { HlmTable, HlmTableContainer, HlmTBody, HlmTh, HlmTHead, HlmTr } from "@libs/ui/table/src";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";
import { DataService } from "@/shared/services/data";
import { DataServiceImpl } from "@/shared/services/data";
import {createAngularTable, FlexRenderDirective, getCoreRowModel} from '@tanstack/angular-table'

@Component({
  selector: 'app-customers',
  imports: [
    ShellComponent,
    FlexRenderDirective,
    HlmTableContainer,
    HlmTable,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh
  ],
  template: `
    <app-shell [breadcrumbs]="_breadcrumbs">
      <!-- we defer the loading of the table, because tanstack manipulates the DOM with flexRender which can cause errors during SSR -->
      @defer {
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              @for (headerGroup of _table.getHeaderGroups(); track headerGroup.id) {
                <tr hlmTr>
                  @for (header of headerGroup.headers; track header.id) {
                    <th hlmTh class="px-0">
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
    </app-shell>
  `
})
export class CustomersPage {
  private readonly _dataService: DataService;

  protected readonly _breadcrumbs: BreadcrumbItem[] = [
    { label: "Customers", url: "/customers" }
  ];

  protected _customers: CustomerDTO[] = [];
  protected readonly _columns = [
    {
      accessorKey: 'id',
			id: 'id',
			header: 'ID',
			enableSorting: false,
			cell: (info: { getValue<T>(): () => T }) => `${info.getValue<string>()}`,
    },
    {
      accessorKey: 'email',
      id: 'email',
			header: 'Email',
			enableSorting: false,
			cell: (info: { getValue<T>(): () => T }) => `${info.getValue<string>()}`,
    },
    {
      accessorKey: 'firstName',
      id: 'firstName',
      header: 'First Name',
      enableSorting: false,
      cell: (info: { getValue<T>(): () => T }) => `${info.getValue<string>()}`,
    },
    {
      accessorKey: 'lastName',
      id: 'lastName',
      header: 'Last Name',
      enableSorting: false,
      cell: (info: { getValue<T>(): () => T }) => `${info.getValue<string>()}`,
    },
    {
      accessorKey: 'birthDate',
      id: 'birthDate',
      header: 'Age',
      enableSorting: false,
      cell: (info: { getValue<T>(): () => T }) => `${info.getValue<Date>()}`,
    },
    {
      accessorKey: 'createdAt',
      id: 'createdAt',
      header: 'Created',
      enableSorting: false,
      cell: (info: { getValue<T>(): () => T }) => `${info.getValue<Date>()}`,
    },
  ];

  protected readonly _table = createAngularTable<CustomerDTO>(() => ({
		data: this._customers,
		columns: this._columns,
    getCoreRowModel: getCoreRowModel(),
	}));

  constructor() {
    this._dataService = inject(DataServiceImpl);
    this._customers = this._dataService.customers.findCustomers(40);
    console.log(this._customers);
  }
}

import { Component, inject } from "@angular/core";
import { ShellComponent } from "@libs/app/shell.component";
import { BreadcrumbItem } from "@libs/app/header.component";
import { HlmTable, HlmTableContainer, HlmTBody, HlmTh, HlmTHead, HlmTr } from "@libs/ui/table/src";
import { CustomerDTO } from "@shared/dto/customer-dto.interface";
import { DataService } from "@/shared/services/data";
import { DataServiceImpl } from "@/shared/services/data";
import {
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
} from '@tanstack/angular-table'
import { TableComponent } from '@libs/app/table.component';

@Component({
  selector: 'app-customers',
  imports: [
    ShellComponent,
    TableComponent
  ],
  template: `
    <app-shell [breadcrumbs]="_breadcrumbs">
      <app-table [data]="_customers" [columns]="_columns" />
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

  constructor() {
    this._dataService = inject(DataServiceImpl);
    this._customers = this._dataService.customers.findCustomers(40);
    console.log(this._customers);
  }
}

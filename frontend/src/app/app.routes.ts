import { Routes } from '@angular/router';
import { CustomersPage } from '@/pages/customers.page';
import { DashboardPage } from '@/pages/dashboard.page';
import { PackagesPage } from '@/pages/packages.page';
import { DeliveriesPage } from '@/pages/deliveries.page';

export const routes: Routes = [
  {
    path: '',
    component: DashboardPage
  },
  {
    path: 'customers',
    component: CustomersPage
  },
  {
    path: 'packages',
    component: PackagesPage
  },
  {
    path: 'deliveries',
    component: DeliveriesPage
  }
];

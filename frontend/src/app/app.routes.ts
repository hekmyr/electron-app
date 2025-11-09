import { Routes } from '@angular/router';
import { CustomersPage } from '@/pages/customers.page';
import { DashboardPage } from '@/pages/dashboard.page';
import { PackagesPage } from '@/pages/packages.page';

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
  }
];

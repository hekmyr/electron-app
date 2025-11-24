import { Routes } from '@angular/router';
import { CustomersPage } from '../pages/customers.page';
import { DashboardPage } from '../pages/dashboard.page';
import { DeliveriesPage } from '../pages/deliveries.page';
import { PackagesPage } from '../pages/packages.page';
import { ReturnsPage } from '../pages/returns.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
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
  },
  {
    path: 'returns',
    component: ReturnsPage
  }
];

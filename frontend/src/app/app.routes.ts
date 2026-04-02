import { Routes } from '@angular/router';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StockSearchComponent } from './components/stock-search/stock-search.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'stock', component: StockSearchComponent, canActivate: [authGuard] },
  { path: 'portfolio', component: PortfolioComponent, canActivate: [authGuard] },
  { path: 'watchlist', component: WatchlistComponent, canActivate: [authGuard] }
];
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CartComponent } from './pages/cart/cart.component';
import { Landing } from './pages/landing/landing';
import { Info } from './pages/info/info';
import { Events } from './pages/events/events';
import { Discover } from './pages/discover/discover';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { MarcasComponent } from './pages/marcas/marcas.component';
import { ProfileComponent } from './services/profile.component';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'info', component: Info },
  { path: 'events', component: Events },
  { path: 'home', component: Home },
  { path: 'marcas', component: MarcasComponent },
  { path: 'cart', component: CartComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'discover', component: Discover },
  { path: 'profile', component: ProfileComponent }
];
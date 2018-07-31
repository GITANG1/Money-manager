import { Routes } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import {LoginComponent} from '../login/login.component';
import {ProfileComponent} from '../profile/profile.component';
import { EmailLoginComponent } from '../email-login/email-login.component';
import { HomeComponent } from '../home/home.component';
import {CategoryComponent} from '../category/category.component'
import {AboutComponent} from '../about/about.component'
/**
 * Routes file determines which page/component will be displayed for a particular URL route
 */
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {path: 'register', component: RegisterComponent },
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'email-login', component: EmailLoginComponent},
  {path: 'category/:cat', component: CategoryComponent},
  {path: 'about', component: AboutComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

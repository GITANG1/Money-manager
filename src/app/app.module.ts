import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { AngularFireModule } from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";
import {AuthService} from './auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatFormFieldModule,
  MatToolbarModule,
  MatCardModule,
  MatButtonModule,
  MatSelectModule,
  MatInputModule,
  MatGridListModule,
  MatNativeDateModule,
  MatDatepickerModule,
} from '@angular/material';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { EmailLoginComponent } from './email-login/email-login.component';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { AboutComponent } from './about/about.component';
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'email-login', component: EmailLoginComponent},
  {path: 'category', component: CategoryComponent},
  {path: 'about', component: AboutComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }

 // { path: '', redirectTo: '/home', pathMatch: 'full' }
];

export const firebaseConfig = {
  apiKey: 'AIzaSyDJuN8-LKKwHqusjSXC8brI8m7IejE0Lxk',
  authDomain: 'money-app-54bfd.firebaseapp.com',
  databaseURL: 'https://money-app-54bfd.firebaseio.com',
  storageBucket: '',
  messagingSenderId: '489173781559'
};

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    ProfileComponent,
    EmailLoginComponent,
    HomeComponent,
    CategoryComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    MatToolbarModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatSelectModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    FlexLayoutModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig),
    BrowserAnimationsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

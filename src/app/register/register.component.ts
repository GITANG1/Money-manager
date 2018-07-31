import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
 
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormControl
  ],
})
export class RegisterComponent {

  constructor(private authService: AuthService) { }
  email = new FormControl('', [Validators.required, Validators.email]);
  firstName: string;
  lastName: string;
  emailid: string;
  password: string;
  passwordless
  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
}

async registerUser()
{

var pass =  await this.authService.emailSignup(this.emailid,this.password);
this.passwordless = (pass == true);
  }
}
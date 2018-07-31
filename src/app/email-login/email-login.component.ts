import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.css']
})
export class EmailLoginComponent implements OnInit {
  emailid: string;
  password: string;
  constructor(private authService: AuthService) { }
  email = new FormControl('', [Validators.required, Validators.email]);
  incorrectPassword

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }

  ngOnInit() {
  }

  async sign_in() {
    var x = await this.authService.login(this.emailid, this.password);
    this.incorrectPassword = (x == true);
    console.log(this.incorrectPassword);
  }
}

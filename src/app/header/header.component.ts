import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import {AngularFireAuth} from 'angularfire2/auth';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
  }
  getIsloggedIn()
  {
    return this.authService.getIsloggedIn();
  }

  signOut() {
    this.afAuth.auth.onAuthStateChanged(function(user) {
    });
    this.authService.logout();
  }
}

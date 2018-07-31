import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AngularFireDatabase,AngularFireList  } from 'angularfire2/database';
import { resolveReflectiveProviders } from '../../node_modules/@angular/core/src/di/reflective_provider';


const helper = new JwtHelperService();



@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  googleEmail : any;
  usersCustomerId;
  incorrectPassword: boolean;
  private loggedInStatus= JSON.parse(localStorage.getItem('loggedIn') || 'false');

  public Users: AngularFireList<any[]>;
  
 constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afd: AngularFireDatabase) {
      this.afAuth.authState.subscribe(user=> {
        if(user) this.usersCustomerId = user.uid;
      });
    }

  login(email: string, password: string) {
    return new Promise((resolve)=>{
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
        this.setloggedIn(true,email);
        window.location.href = "http://localhost:4200/home";
        resolve(false);
      })
      .catch(err => {
        this.incorrectPassword=true;
        console.log('Something went wrong: ', err.message);
        resolve(true);
      });
    })
 
  }


  

  setloggedIn(value:boolean,email:string)
  {
    this.loggedInStatus=value;
    localStorage.setItem('loggedIn',value.toString());
    localStorage.setItem('email',email.toString());
  }

  getIsloggedIn()
  {
   return JSON.parse(localStorage.getItem('loggedIn') || this.loggedInStatus.toString());
    //return this.loggedInStatus;
  }

  emailSignup(email: string, password: string) {

    return new Promise((resolve)=>{
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(value => {
        this.afd.database.ref('/Users').child(value.user.uid);
        console.log('Sucess', value.user.uid);
        this.setloggedIn(true,email);        
        window.location.href = "http://localhost:4200/home"
        console.log("***A new user has been registered***" );
        resolve(false);
      })
      .catch(error => {
        console.log('Something went wrong: ', error);
        resolve(true);
      });
    })

  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider)
      .then(value => {
        this.setloggedIn(true,"");
        console.log('Sucess', value),
          //console.log('The given name is ' + value.additionalUserInfo.profile);
          window.location.href = "http://localhost:4200/home"
      })
      .catch(error => {
        console.log('Something went wrong: ', error);
      });
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.setloggedIn(false,"");

     window.location.href = "http://localhost:4200/home"
    });
  }

  async getUser()
  {
    var Uid = await this.getUserDetails();
    return Uid;
  }

  getUserDetails()
  {
   return new Promise((resolve)=>{
    this.afAuth.auth.onAuthStateChanged(user=>{
      this.usersCustomerId= user.uid;
      console.log(user.uid);
      resolve(user.uid);
    });
   }); 
  }


  addUserToDatabase()
  {
    var Uid = this.getUser();
     //this.Users.push(Uid.toString());
  }


  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider).then(function (result) {
      var user = result.user;
      localStorage.setItem('loggedIn',true.toString());
      localStorage.setItem('email',user.email);
    });
  }
}
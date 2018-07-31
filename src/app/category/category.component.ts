import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ChildActivationEnd } from '@angular/router';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Router } from '@angular/router';
import { resolve } from '../../../node_modules/@types/q';
import { ValueTransformer } from '../../../node_modules/@angular/compiler/src/util';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  cat
  sub
  usersCustomerId
  item;
  amount;
  totalcatamt;
  transactions = [];
  date : Date;
  dateinvalid: boolean;
  constructor(private route: ActivatedRoute, public authService: AuthService,
    private afAuth: AngularFireAuth,
    private cd: ChangeDetectorRef,
    private afd: AngularFireDatabase,
    private router: Router) { }

  async ngOnInit() {
    if (!this.getIsloggedIn()) {
      this.router.navigate(['email-login'])
    }
    else{
      this.transactions = [];
      this.usersCustomerId = await this.getUserDetails();
      this.sub = this.route.params.subscribe(params => {
        this.cat = params['cat'];
      });
  
      this.getallTransactions();
    }
  
  }

  getIsloggedIn() {
    return this.authService.getIsloggedIn();
  }
  
  async addTransaction() {
    var json = await this.getTotal();
    var total = parseFloat(json['sum']);
    var exist = await this.getTransaction(this.item);
    if (exist == true) {
      var temp = await this.deletetransaction(this.item);
      total = parseInt(temp.toString());
    }

    if (typeof(this.date) == 'undefined')
    {
      this.dateinvalid = true;
      console.log("the date is invalid");
    }
    else
    {
      this.dateinvalid = false;
      var newtotal = total - parseFloat(this.amount);
      this.afd.database.ref('/Users/' + this.usersCustomerId).child(this.cat).child('sum').set(newtotal);
      this.afd.database.ref('/Users/' + this.usersCustomerId + '/' + this.cat + '/').child(this.item).child('Date').set(this.date.toLocaleString());
      this.afd.database.ref('/Users/' + this.usersCustomerId + '/' + this.cat + '/').child(this.item).child('Amount').set(this.amount);
      window.location.href = "http://localhost:4200/category/" + this.cat;
    }
   

  }

  async deletetransaction(itemname) {
    return new Promise(async (resolve) => {
      var json = await this.getTotal();
      var total = parseFloat(json['sum']);
      var prevamt = await this.getTransactionamt(itemname);
      var addamt = parseFloat(prevamt.toString());
      var newtotal = total + addamt;
      this.afd.database.ref('/Users/' + this.usersCustomerId).child(this.cat).child('sum').set(newtotal);
      this.afd.object('/Users/' + this.usersCustomerId + '/' + this.cat + '/' + itemname).remove();
      resolve(newtotal);
    })
  }

  getTotal() {
    var itemref = this.afd.list('/Users/' + this.usersCustomerId);
    return new Promise((resolve) => {
      itemref.snapshotChanges().subscribe(res => {
        res.forEach(value => {
          var json = {
            'category': value.payload.key,
            'budget': value.payload.val()
          }
          if (json.category === this.cat) {
            this.totalcatamt = json.budget;
          }
        })
        resolve(this.totalcatamt);
      });
    });
  }

  getTransaction(itemname) {
    var itemref = this.afd.list('/Users/' + this.usersCustomerId + '/' + this.cat);
    var tramt;
    return new Promise((resolve) => {
      itemref.snapshotChanges().subscribe(res => {
        this.transactions = [];
        res.forEach(value => {
          var json = {
            'itemname': value.payload.key,
            'amount': value.payload.val()
          }
          if (json.itemname == itemname) {
            tramt = json.amount['Amount'];
            resolve(true);
          }
        })
        resolve(false);
      });
    })
  }

  getTransactionamt(itemname) {
    var itemref = this.afd.list('/Users/' + this.usersCustomerId + '/' + this.cat);
    var tramt;
    return new Promise((resolve) => {
      itemref.snapshotChanges().subscribe(res => {
        this.transactions = [];
        res.forEach(value => {
          var json = {
            'itemname': value.payload.key,
            'amount': value.payload.val()
          }
          if (json.itemname == itemname) {
            tramt = json.amount['Amount'];
            resolve(tramt);
          }
        })
      });
    })
  }

  getallTransactions() {
    var itemref = this.afd.list('/Users/' + this.usersCustomerId + '/' + this.cat);
    itemref.snapshotChanges().subscribe(res => {
      this.transactions = [];
      res.forEach(value => {
        var json = {
          'itemname': value.payload.key,
          'amount': value.payload.val()
        }
        if (json.itemname != 'sum') {
          this.transactions.push(json);
        }
      })
    });
  }

  getUserDetails() {
    return new Promise((resolve) => {
      this.afAuth.auth.onAuthStateChanged(user => {
        this.usersCustomerId = user.uid;
        resolve(user.uid);
      });
    });
  }
}

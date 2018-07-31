import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  usersCustomerId;
  category: string;
  monthBudget: number;
  fdate: Date;
  tdate: Date;
  categories = [];
  datedTransactions = [];
  categorynotdefined;
  budgetnotdefined;
  viewSummary
  totalSum
  notanumber: boolean;
  dateinvalid: boolean;
  nocategories: boolean;

  @Input() data: Observable<any>;

  constructor(public authService: AuthService,
    private afAuth: AngularFireAuth,
    private cd: ChangeDetectorRef,
    private afd: AngularFireDatabase,
    private router: Router) { }

  async  ngOnInit() {
    if (!this.getIsloggedIn()) {
      this.router.navigate(['email-login'])
    }
    this.usersCustomerId = await this.getUserDetails();
    await this.getallCategories();
  }


  getallCategories() {
    var itemref = this.afd.list('/Users/' + this.usersCustomerId);
    return new Promise((resolve) => {
      itemref.snapshotChanges().subscribe(res => {
        res.forEach(value => {
          var json = {
            'category': value.payload.key,
            'budget': value.payload.val()
          }
          this.categories.push(json);
        })
      });
    })
  }

  async getUid() {
    var Uid = await this.getUserDetails();
    return Uid;
  }

  printuser(email) {
    this.usersCustomerId = "node";

  }

  getIsloggedIn() {
    return this.authService.getIsloggedIn();
  }

  deleteCategory(category) {
    if (window.confirm('Deleting this category will delete all the transactions in that category. Are you sure you want to proceed?')) {
      this.afd.object('/Users/' + this.usersCustomerId + '/' + category).remove();
      this.categories = [];
    }
  }
  getUserDetails() {
    return new Promise((resolve) => {
      this.afAuth.auth.onAuthStateChanged(user => {
        this.usersCustomerId = user.uid;
        resolve(user.uid);
      });
    });
  }

  async findtransactions() {
    if (typeof (this.fdate) == 'undefined' || typeof (this.tdate) == 'undefined') {
      this.dateinvalid = true;
      console.log("the date is invalid");
    }
    else {
      this.dateinvalid = false;
      this.viewSummary = true;
      this.totalSum = 0;
      for (let i = 0; i < this.categories.length; i++) {
        var dates = await this.getItemsBydate(this.categories[i].category);
      }
    }


  }

  getItemsBydate(cat) {
    var itemref = this.afd.list('/Users/' + this.usersCustomerId + '/' + cat);
    this.datedTransactions = [];
    return new Promise((resolve) => {
      itemref.snapshotChanges().subscribe(res => {
        res.forEach(value => {
          var json = {
            'itemname': value.payload.key,
            'amount': value.payload.val()
          }


          if (json.itemname != 'sum') {
            let tempdate = new Date(json.amount['Date'].valueOf());
            if (tempdate.valueOf() - this.fdate.valueOf() >= 0 && tempdate.valueOf() - this.tdate.valueOf() <= 0) {
              this.totalSum = this.totalSum + parseFloat(json.amount['Amount']);
              this.datedTransactions.push(json)
            }
          }
        })
      });
      resolve(this.datedTransactions);
    })
  }

  async createCategory() {
    if (isNaN(this.monthBudget)) {
      this.notanumber = true;
      console.log("budget is not a number")
    }
    else {
      this.notanumber = false;
      if (this.category == null || this.category == "") {
        this.categorynotdefined = true;
        this.budgetnotdefined = false;
      }
      else if (this.monthBudget == null) {
        this.budgetnotdefined = true;
        this.categorynotdefined = false;
      }
      else {
        this.categorynotdefined = false;
        this.budgetnotdefined = false;
        var currsum = 0;
        var transum = await this.getTotalOfTransaction(this.category);
        currsum = parseInt(transum.toString());
        var budget = this.monthBudget;
        transum = budget - currsum;
        this.afd.database.ref('/Users/' + this.usersCustomerId).child(this.category).child('sum').set(transum);
        this.categories = [];
      }
    }

  }

  signOut() {
    this.authService.logout();
  }

  getTotalOfTransaction(catname) {
    var itemref = this.afd.list('/Users/' + this.usersCustomerId + '/' + catname);
    var tramt = 0;
    return new Promise((resolve) => {
      itemref.snapshotChanges().subscribe(res => {
        res.forEach(value => {
          var json = {
            'itemname': value.payload.key,
            'amount': value.payload.val()
          }
          if (json.itemname != 'sum') {
            tramt = tramt + parseInt((json.amount['Amount']).toString());
          }
        })
        resolve(tramt);
      });
    })
  }

  openCategory(clickedcategory) {
    this.router.navigate(['category/' + clickedcategory]);
  }
}
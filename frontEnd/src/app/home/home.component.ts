import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Moment, invalid } from 'moment';
import * as moment from 'moment';
import { CheckInService } from '../providers/check-in.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { FormsModule } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  today:string = moment().format('DD MMM YYYY');
  name:string;
  nameResponsive:string;

  constructor(public toastr: ToastsManager, vcr: ViewContainerRef, 
              private sessionSt: SessionStorageService, 
              private router: Router) {
    if (this.sessionSt.retrieve('email') == null){
      this.router.navigate([''])
    }
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.name = this.sessionSt.retrieve('name');
    this.responsiveName(this.name);
  }

  responsiveName(name){
    let separate = name.split(" ");
    if(separate.length>3){
      this.nameResponsive = separate[0]+" "+separate[2];
    }else{
      this.nameResponsive = separate[0]+" "+separate[1];
    }
  }

}

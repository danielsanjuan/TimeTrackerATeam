import { Component, OnInit, ViewContainerRef } from '@angular/core';
import * as moment from 'moment';
import { NgClass } from '@angular/common'; 
import { CheckInService } from '../providers/check-in.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {
  checkOutTime: string = "" ;
  doClick:boolean = true;
  E202:boolean=false;
  E406:boolean=false;
  E500:boolean=false;
  checkInTime:string;

  constructor( private services:CheckInService,
               private router: Router,
               public toastr: ToastsManager, vcr: ViewContainerRef) {
       this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    
  }
  
  timeCheckIn(){
    // this.checkInTime = moment().format('YYYY/MM/DD, hh:mm:ss');
     this.doClick=false;
    // console.log(this.checkInTime);
    this.services.postCheckIn().subscribe( (data)=>{
      //console.log(data);
      console.log(data.response_code);
      console.log(data.response_date);
      console.log(data.response_status);
      switch(data.response_code){
        case "200":
            this.checkInTime = data.response_date;
            let timeOk = this.checkInTime[7]+""+this.checkInTime[8]+":"+this.checkInTime[10]+""+this.checkInTime[11];
            this.toastr.success('Has hecho check-in a las '+timeOk, 'Success!');
            break;  
        case "202":
            this.checkInTime = data.response_date;
            let timeLate = this.checkInTime[7]+""+this.checkInTime[8]+":"+this.checkInTime[10]+""+this.checkInTime[11];
            this.toastr.warning('Que son estas horas de llegar '+ timeLate, 'Alert!');
            this.E202=true;
            break; 
        case "406":
            this.E406=true;
            this.toastr.error('No puedes trabajar ha esta hora', 'Oops!');
            this.doClick=true;
            break; 
        case "500":
            this.E500=true;
            this.toastr.error('No puedes 2 check-in el mismo dia', 'Oops!');
            this.doClick=true;
            break; 
      }
    });

  }


  timeCheckOut(){
    this.checkOutTime = moment().format('YYYY/MM/DD, hh:mm:ss');
    this.doClick=true;
    console.log(this.checkOutTime);
  }
}

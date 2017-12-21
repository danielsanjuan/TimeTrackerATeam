import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NgForm, RequiredValidator } from '@angular/forms';
import { CheckInService } from '../providers/check-in.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-set-time-company',
  templateUrl: './set-time-company.component.html',
  styleUrls: ['./set-time-company.component.css']
})
export class SetTimeCompanyComponent implements OnInit {
  checkinmin: string = "07:00";
  checkinmax: string = "09:00";
  checkoutmin: string = "14:00";
  checkoutmax: string = "19:00";
  checkoutminfriday: string = "13:00";
  checkoutmaxfriday: string = "15:00";

  constructor(private services: CheckInService, public toastr: ToastsManager, vcr: ViewContainerRef) { 
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
  }

  onFormSubmit(companyTimeTrackerForm: NgForm) {
    if(companyTimeTrackerForm.valid){
      this.toastr.success('Success!');
      //Realizar llamada a la API para setear las variables.
      // this.services.postCheckTimes(companyTimeTrackerForm.value).subscribe((data) => {
      //   console.log(data.response);
      // });
    }else{
      this.toastr.error('Complete all required fields!');
    }
    console.log(companyTimeTrackerForm.value);
    console.log('checkinmin:' + companyTimeTrackerForm.controls['checkinminMT'].value);
    console.log('checkinmax:' + companyTimeTrackerForm.controls['checkinmaxMT'].value);
    console.log('checkoutmin:' + companyTimeTrackerForm.controls['checkoutminMT'].value);
    console.log('checkoutmax:' + companyTimeTrackerForm.controls['checkoutmaxMT'].value);
    console.log('checkoutfriday:' + companyTimeTrackerForm.controls['checkoutminF'].value);
    console.log('checkoutmaxfriday:' + companyTimeTrackerForm.controls['checkoutmaxF'].value);
    console.log('Form Valid:' + companyTimeTrackerForm.valid);
    console.log('Form Submitted:' + companyTimeTrackerForm.submitted);
  }

}

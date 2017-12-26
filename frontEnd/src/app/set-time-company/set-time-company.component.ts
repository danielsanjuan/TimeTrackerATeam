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
  checkin_min: string;
  checkin_max: string;
  checkout_min: string;
  checkout_max: string;
  checkout_minfriday: string;
  checkout_maxfriday: string;

  constructor(private services: CheckInService, public toastr: ToastsManager, vcr: ViewContainerRef) { 
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.services.getCompanyTimes().subscribe((data) => {
      this.checkin_min = data.response.checkinmin;
      this.checkin_max = data.response.checkinmax;
      this.checkout_min = data.response.checkoutmin;
      this.checkout_max = data.response.checkoutmax;
      this.checkout_minfriday = data.response.checkoutminfriday;
      this.checkout_maxfriday = data.response.checkoutmaxfriday;
    })
  }

  onFormSubmit(companyTimeTrackerForm: NgForm) {
    if(companyTimeTrackerForm.valid){
      //Realizar llamada a la API para setear las variables.
      this.services.postCompanyTimes(companyTimeTrackerForm.value).subscribe((data) => {
        if (data.response_code == 500){
          this.toastr.error('Error!');
        }else{
          this.toastr.success('Success!');          
        }
        console.log(data.response_code);
      });
    }else{
      this.toastr.error('Complete all required fields!');
    }
    console.log(companyTimeTrackerForm.value);
    console.log('checkinmin:' + companyTimeTrackerForm.controls['checkinmin'].value);
    console.log('checkinmax:' + companyTimeTrackerForm.controls['checkinmax'].value);
    console.log('checkoutmin:' + companyTimeTrackerForm.controls['checkoutmin'].value);
    console.log('checkoutmax:' + companyTimeTrackerForm.controls['checkoutmax'].value);
    console.log('checkoutfriday:' + companyTimeTrackerForm.controls['checkoutminfriday'].value);
    console.log('checkoutmaxfriday:' + companyTimeTrackerForm.controls['checkoutmaxfriday'].value);
    console.log('Form Valid:' + companyTimeTrackerForm.valid);
    console.log('Form Submitted:' + companyTimeTrackerForm.submitted);
  }

}

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NgForm, RequiredValidator } from '@angular/forms';
import { CheckInService } from '../providers/check-in.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {ToastOptions} from 'ng2-toastr';

@Component({
  selector: 'app-set-time-company',
  templateUrl: './set-time-company.component.html',
  styleUrls: ['./set-time-company.component.css']
})
export class SetTimeCompanyComponent implements OnInit  {
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
          this.toastr.error('Checkin Minimun Time invalid', 'Error!');
        }
        if (data.response_code == 501){
          this.toastr.error('Checkin Maximum Time invalid', 'Error!');
        }
        if (data.response_code == 502){
          this.toastr.error('Checkout Minimun Time invalid', 'Error!');
        }
        if (data.response_code == 503){
          this.toastr.error('Checkout Minimun Friday Time invalid', 'Error!');
        }
        if(data.response_code == 200){
          this.toastr.success('The input data is correct','Success!');
        }
      });
    }else{
      this.toastr.error('Complete all required fields!');
    }
  }

}

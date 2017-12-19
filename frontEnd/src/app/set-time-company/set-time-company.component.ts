import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-set-time-company',
  templateUrl: './set-time-company.component.html',
  styleUrls: ['./set-time-company.component.css']
})
export class SetTimeCompanyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onFormSubmit(companyTimeTrackerForm: NgForm) {
    console.log(companyTimeTrackerForm.value);
    console.log('checkinmin:' + companyTimeTrackerForm.controls['checkin-min'].value);
    console.log('checkinmax:' + companyTimeTrackerForm.controls['checkin-max'].value);
    console.log('checkoutmin:' + companyTimeTrackerForm.controls['checkout-min'].value);
    console.log('checkoutmax:' + companyTimeTrackerForm.controls['checkout-max'].value);
    console.log('checkoutfriday:' + companyTimeTrackerForm.controls['checkout-min-friday'].value);
    console.log('checkoutmaxfriday:' + companyTimeTrackerForm.controls['checkout-max-friday'].value);
    console.log('Form Valid:' + companyTimeTrackerForm.valid);
    console.log('Form Submitted:' + companyTimeTrackerForm.submitted);
  }

}

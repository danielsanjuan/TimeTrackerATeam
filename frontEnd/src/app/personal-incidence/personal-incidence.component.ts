import { Component, OnInit, ViewContainerRef, Input, NgZone, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidenceService } from '../providers/incidence.provider';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-personal-incidence',
  templateUrl: './personal-incidence.component.html',
  styleUrls: ['./personal-incidence.component.css']
})
export class PersonalIncidenceComponent implements OnInit {

  rForm: FormGroup;
  key: any;
  email: any;
  private sub: any;
  employees: any = {};
  incidences = [];
  modalRef: BsModalRef;
  incidence: any;
  check_in: any;
  check_out: any;
  error: number = 200;

  constructor(private zone: NgZone, private route: ActivatedRoute, private services: IncidenceService,
    private modalService: BsModalService, private router: Router, private fb: FormBuilder, public toastr: ToastsManager,
    vcr: ViewContainerRef,) {
      this.toastr.setRootViewContainerRef(vcr);
      this.rForm = this.fb.group({
        check_in: ["", Validators.required],
        check_out: [""]
      });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.email = params['email'];
    });
    this.services.getEmployee(this.email).subscribe((data) => {
      this.employees = data.employee;
    });
    this.services.getPersonalIncidences(this.email).subscribe((data) => {
      this.incidences = data.incidences;
    });
    this.services.setIncidencesChecked(this.email).subscribe((data) => {
    });
  }

  openModal(incidence, template: TemplateRef<any>) {
    this.services.getCheckHoursIncidence(this.email, incidence.date).subscribe((data) => {
      this.key = data.response_change_check.key;
      if (data.response_change_check.checkin != "None") {
        let dateStringIn = data.response_change_check.checkin.split(' ')[0] + 'T' + data.response_change_check.checkin.split(' ')[1].split('.')[0];
        this.check_in = dateStringIn;
      }
      if (data.response_change_check.checkout != "None") {
        let dateStringOut = data.response_change_check.checkout.split(' ')[0] + 'T' + data.response_change_check.checkout.split(' ')[1].split('.')[0];
        this.check_out = dateStringOut;
      }
      this.rForm.patchValue({check_in: this.check_in, check_out: this.check_out});
    });
    this.incidence = incidence;
    this.modalRef = this.modalService.show(template);
  }

  setSolved(formValues) {
    if(formValues.check_in){
      if (formValues.check_out){
        this.services.setCheckHoursIncidence(this.key, this.email, formValues.check_in.replace('T', ' ') + ".100", formValues.check_out.replace('T', ' ') + ".100").subscribe((data) => {
          if (data.response_code == 200){
            this.toastr.success('Success!');
            this.services.solveIncidence(this.incidence.date).subscribe((data) => {
              setTimeout(() => {
                this.zone.run(() => {
                  this.modalRef.hide();
                  this.modalRef = null;
                  this.services.getPersonalIncidences(this.email).subscribe((data) => {
                    this.incidences = data.incidences;
                  });
                });
              }, 200);
            });
          }else{
            this.error = 404;
          }
        });
      }else{
        this.services.setCheckHoursIncidence(this.key, this.email, formValues.check_in.replace('T', ' ') + ".100", null).subscribe((data) => {
          if (data.response_code == 200){
            this.toastr.success('Success!');
            this.services.solveIncidence(this.incidence.date).subscribe((data) => {
              setTimeout(() => {
                this.zone.run(() => {
                  this.modalRef.hide();
                  this.modalRef = null;
                  this.services.getPersonalIncidences(this.email).subscribe((data) => {
                    this.incidences = data.incidences;
                  });
                });
              }, 200);
            });
          }else{
            this.error = 404;
          }
        });
      }
    }else{
      this.error = 404;
    }
  }
}
